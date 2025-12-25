你需要开发混合应用的 JSBridge（实现 JS 与安卓/iOS 原生之间的双向通信），首先梳理核心关键点，再提供可落地的简单实现方案，覆盖双向通信、异步回调等核心需求：

### 一、JSBridge 开发核心关键点

#### 1. 通信机制选型（核心基础）

JS 与原生的通信有 3 种主流方式，需根据兼容性和需求选择：

| 通信方式               | 优点                  | 缺点                  | 适用场景                  |
|------------------------|-----------------------|-----------------------|---------------------------|
| 原生注入 API 式（推荐） | 高效、无性能损耗、支持异步 | 需原生主动注入 JS 对象 | 现代混合应用（Android 4.2+、iOS 8+） |
| URL Scheme 拦截式      | 兼容性好（支持低版本） | 有性能损耗、可能被拦截 | 老旧设备兼容、简单通信场景 |
| MessageChannel 式      | 现代标准、双向通信流畅 | 部分老 WebView 不支持  | 高版本 WebView（Android 5.0+、iOS 10+） |

#### 2. 统一消息格式规范

必须定义统一的消息结构，避免双方解析混乱，核心字段至少包含：

- `method`：通信方法名（如 `getDeviceInfo`、`jumpToNativePage`），用于原生识别要执行的功能；
- `params`：传递的参数（对象格式，方便多参数传递）；
- `callbackId`：唯一回调 ID（用于异步回调，JS 调用原生后，原生通过该 ID 回调结果）；
- `type`：消息类型（可选，如 `JS_CALL_NATIVE`/`NATIVE_CALL_JS`，区分双向通信方向）。

#### 3. 异步回调机制

JS 调用原生方法（如获取设备信息、请求原生权限）大多是异步操作，需通过「回调 ID 映射」实现精准回调：

- JS 端：生成唯一 `callbackId`，将回调函数存入全局缓存对象；
- 原生端：执行完方法后，携带 `callbackId` 和结果，调用 JS 全局回调方法；
- JS 端：根据 `callbackId` 从缓存中取出对应回调函数，执行并销毁缓存。

#### 4. 双向通信支持

不仅要支持「JS 调用原生」，还要支持「原生主动调用 JS」（如原生推送通知、页面生命周期回调）：

- JS 端：注册全局方法，供原生直接调用；
- 原生端：封装调用 JS 方法的工具类，支持传递参数和回调。

#### 5. 错误处理机制

覆盖通信全流程的异常场景，避免程序崩溃：

- 方法不存在：原生收到未注册的 `method`，返回明确错误码；
- 参数非法：校验参数类型和必填项，返回参数错误提示；
- 通信失败：网络/环境异常时，JS 端触发默认错误回调；
- 统一错误格式：包含 `errorCode` 和 `errorMsg`，方便双方解析。

#### 6. 安全校验（重要）

防止恶意 JS 调用原生敏感方法，或恶意原生调用 JS：

- 白名单校验：原生仅允许执行白名单内的 `method`（如禁止 JS 调用原生支付以外的敏感接口）；
- 参数校验：原生对 `params` 进行合法性校验（如手机号、ID 格式）；
- 签名验证：重要接口（如支付、用户信息获取）需添加签名校验，防止参数被篡改；
- 域名校验：WebView 仅允许指定域名的页面使用 JSBridge，防止恶意页面注入。

#### 7. 兼容性与调试

- 兼容不同系统/版本：针对安卓（系统 WebView/X5 内核）、iOS 不同版本的差异做兼容处理；
- 调试能力：添加日志打印（JS 端 `console.log`、原生端 Logcat/Xcode 日志），方便排查通信问题；
- 降级处理：部分老设备不支持注入 API 时，自动降级为 URL Scheme 方式。

### 二、简单 JSBridge 实现方案（注入 API 式，推荐）

以下实现覆盖「JS 调用原生」和「原生调用 JS」双向通信，基于现代 WebView 兼容（Android 4.2+、iOS 8+）。

#### 1. JS 端实现（核心代码）

封装 `JSBridge` 类，负责消息封装、回调管理、双向通信注册：

```javascript
class JSBridge {
  constructor() {
    // 存储回调函数：key 为 callbackId，value 为回调函数
    this.callbackMap = {};
    // 生成唯一 callbackId 的计数器
    this.callbackIdCounter = 0;
    // 初始化：检查原生是否已注入 JSBridge 对象
    this.init();
  }

  // 初始化：确保原生已注入 window.NativeBridge（原生需提前注入该对象）
  init() {
    if (!window.NativeBridge) {
      console.warn("原生 JSBridge 未注入，等待重试...");
      setTimeout(() => this.init(), 100);
    } else {
      console.log("JSBridge 初始化成功");
    }
  }

  // 生成唯一 callbackId
  generateCallbackId() {
    return `JSBRIDGE_CALLBACK_${this.callbackIdCounter++}`;
  }

  /**
   * JS 调用原生方法
   * @param {string} method - 原生方法名
   * @param {object} params - 传递参数
   * @param {function} success - 成功回调
   * @param {function} fail - 失败回调
   */
  callNative(method, params = {}, success = () => {}, fail = () => {}) {
    if (!window.NativeBridge) {
      fail({ errorCode: -1, errorMsg: "原生 JSBridge 未初始化" });
      return;
    }

    // 1. 生成唯一 callbackId
    const callbackId = this.generateCallbackId();
    // 2. 缓存回调函数
    this.callbackMap[callbackId] = { success, fail };
    // 3. 组装统一消息格式
    const message = {
      method,
      params,
      callbackId,
      type: "JS_CALL_NATIVE"
    };

    try {
      // 4. 调用原生注入的方法（NativeBridge 是原生注入的全局对象）
      window.NativeBridge.receiveMessage(JSON.stringify(message));
    } catch (e) {
      fail({ errorCode: -2, errorMsg: `JS 调用原生失败：${e.message}` });
      // 移除缓存的回调
      delete this.callbackMap[callbackId];
    }
  }

  /**
   * 原生回调 JS 的统一入口（原生会调用该方法）
   * @param {object} result - 原生返回的结果，包含 callbackId、data、error
   */
  onNativeCallback(result) {
    try {
      const { callbackId, data, error } = result;
      const callback = this.callbackMap[callbackId];
      if (!callback) return;

      // 有错误则执行失败回调，否则执行成功回调
      if (error) {
        callback.fail(error);
      } else {
        callback.success(data);
      }

      // 执行完回调后，移除缓存
      delete this.callbackMap[callbackId];
    } catch (e) {
      console.error("原生回调 JS 处理失败：", e);
    }
  }

  /**
   * 注册原生调用 JS 的方法（供原生主动调用）
   * @param {string} method - 方法名
   * @param {function} handler - 方法处理函数
   */
  registerNativeCallHandler(method, handler) {
    if (typeof handler !== "function") {
      console.error(`注册方法 ${method} 失败：handler 必须是函数`);
      return;
    }

    // 挂载到 window 全局，供原生调用
    window[`JS_HANDLER_${method}`] = (params) => {
      try {
        // 原生传递的参数可能是 JSON 字符串，需解析
        const paramsObj = typeof params === "string" ? JSON.parse(params) : params;
        return handler(paramsObj); // 支持返回结果给原生
      } catch (e) {
        console.error(`执行原生调用 JS 方法 ${method} 失败：`, e);
        return { errorCode: -1, errorMsg: e.message };
      }
    };

    console.log(`已注册原生调用 JS 方法：${method}`);
  }
}

// 实例化并挂载到 window 全局，供页面使用
window.JSBridge = new JSBridge();

// -------------------------- 示例使用 --------------------------
// 1. JS 调用原生：获取设备信息
window.JSBridge.callNative(
  "getDeviceInfo",
  { appVersion: "1.0.0" },
  (data) => {
    console.log("获取设备信息成功：", data); // { deviceType: "android", deviceId: "xxx" }
  },
  (error) => {
    console.error("获取设备信息失败：", error);
  }
);

// 2. 注册原生调用 JS 的方法：原生通知页面刷新
window.JSBridge.registerNativeCallHandler("onPageRefresh", (params) => {
  console.log("原生通知页面刷新：", params);
  // 执行页面刷新逻辑
  window.location.reload();
  // 返回结果给原生
  return { code: 0, message: "页面已刷新" };
});
```

#### 2. 原生端核心实现（关键代码）

##### （1）安卓端（Android）

基于 `WebView` 注入 JS 对象，实现消息接收和回调：

```java
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import com.google.gson.Gson;

// 1. 定义 JSBridge 注入类（需添加 @JavascriptInterface 注解，Android 4.2+ 必需）
public class NativeJSBridge {
    private WebView mWebView;
    private Gson mGson = new Gson();

    public NativeJSBridge(WebView webView) {
        this.mWebView = webView;
    }

    // 供 JS 调用的方法（原生注入后，JS 可通过 window.NativeBridge.receiveMessage 调用）
    @JavascriptInterface
    public void receiveMessage(String messageJson) {
        // 解析 JS 传递的消息
        JsCallNativeMessage message = mGson.fromJson(messageJson, JsCallNativeMessage.class);
        if (message == null) {
            callbackToJs(message.getCallbackId(), null, new JsBridgeError(-1, "消息格式错误"));
            return;
        }

        // 2. 白名单校验（仅允许合法方法）
        if (!isMethodInWhitelist(message.getMethod())) {
            callbackToJs(message.getCallbackId(), null, new JsBridgeError(-2, "方法不存在或未授权"));
            return;
        }

        // 3. 执行对应方法（示例：处理 getDeviceInfo 方法）
        try {
            switch (message.getMethod()) {
                case "getDeviceInfo":
                    // 获取设备信息（实际项目中需封装工具类）
                    DeviceInfo deviceInfo = new DeviceInfo("android", "123456789", "1.0.0");
                    // 回调 JS 成功结果
                    callbackToJs(message.getCallbackId(), deviceInfo, null);
                    break;
                case "jumpToNativePage":
                    // 跳转原生页面逻辑
                    String pageName = message.getParams().get("pageName");
                    // 业务逻辑...
                    callbackToJs(message.getCallbackId(), "跳转成功", null);
                    break;
                default:
                    callbackToJs(message.getCallbackId(), null, new JsBridgeError(-2, "方法不存在"));
                    break;
            }
        } catch (Exception e) {
            callbackToJs(message.getCallbackId(), null, new JsBridgeError(-3, "原生方法执行失败：" + e.getMessage()));
        }
    }

    // 4. 原生回调 JS 的统一方法
    private void callbackToJs(String callbackId, Object data, JsBridgeError error) {
        if (callbackId == null || callbackId.isEmpty()) {
            return;
        }

        // 组装回调消息
        NativeCallbackResult result = new NativeCallbackResult();
        result.setCallbackId(callbackId);
        result.setData(data);
        result.setError(error);
        String resultJson = mGson.toJson(result);

        // 调用 JS 的 onNativeCallback 方法（需在主线程执行）
        mWebView.post(() -> {
            String jsCode = String.format("window.JSBridge.onNativeCallback(%s);", resultJson);
            // Android 4.4+ 推荐使用 evaluateJavascript，无弹窗风险
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.KITKAT) {
                mWebView.evaluateJavascript(jsCode, null);
            } else {
                mWebView.loadUrl("javascript:" + jsCode);
            }
        });
    }

    // 5. 原生主动调用 JS 方法
    public void callJsMethod(String method, Object params) {
        String paramsJson = mGson.toJson(params);
        String jsCode = String.format("window.JS_HANDLER_%s(%s);", method, paramsJson);
        mWebView.post(() -> {
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.KITKAT) {
                mWebView.evaluateJavascript(jsCode, result -> {
                    // 可选：接收 JS 返回的结果
                    Log.d("NativeJSBridge", "调用 JS 方法 " + method + " 返回结果：" + result);
                });
            } else {
                mWebView.loadUrl("javascript:" + jsCode);
            }
        });
    }

    // 白名单校验
    private boolean isMethodInWhitelist(String method) {
        List<String> whitelist = Arrays.asList("getDeviceInfo", "jumpToNativePage", "requestPermission");
        return whitelist.contains(method);
    }

    // 消息实体类（省略 getter/setter）
    static class JsCallNativeMessage {
        private String method;
        private Object params;
        private String callbackId;
        private String type;
    }

    static class NativeCallbackResult {
        private String callbackId;
        private Object data;
        private JsBridgeError error;
    }

    static class JsBridgeError {
        private int errorCode;
        private String errorMsg;

        public JsBridgeError(int errorCode, String errorMsg) {
            this.errorCode = errorCode;
            this.errorMsg = errorMsg;
        }
    }

    static class DeviceInfo {
        private String deviceType;
        private String deviceId;
        private String appVersion;

        public DeviceInfo(String deviceType, String deviceId, String appVersion) {
            this.deviceType = deviceType;
            this.deviceId = deviceId;
            this.appVersion = appVersion;
        }
    }
}

// 6. 在 WebView 中注入 JSBridge
WebView webView = findViewById(R.id.web_view);
WebSettings webSettings = webView.getSettings();
webSettings.setJavaScriptEnabled(true); // 开启 JS 支持
// 注入 NativeBridge 对象（JS 端通过 window.NativeBridge 访问）
webView.addJavascriptInterface(new NativeJSBridge(webView), "NativeBridge");
```

##### （2）iOS 端（WKWebView）

基于 `WKWebView` 的 `WKScriptMessageHandler` 实现消息通信：

```swift
import WebKit

// 1. 定义 JSBridge 管理类，遵守 WKScriptMessageHandler 协议
class NativeJSBridge: NSObject, WKScriptMessageHandler {
    private var webView: WKWebView!
    private let gson = JSONSerialization() // 实际项目可使用 SwiftyJSON 简化解析

    init(webView: WKWebView) {
        super.init()
        self.webView = webView
        // 注册消息监听（JS 端通过 window.webkit.messageHandlers.NativeBridge.postMessage 发送消息）
        self.webView.configuration.userContentController.add(self, name: "NativeBridge")
    }

    // 2. 接收 JS 传递的消息
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard message.name == "NativeBridge", let messageDict = message.body as? [String: Any] else {
            callbackToJs(callbackId: nil, data: nil, error: ["errorCode": -1, "errorMsg": "消息格式错误"])
            return
        }

        // 解析消息字段
        let method = messageDict["method"] as? String ?? ""
        let params = messageDict["params"] as? [String: Any] ?? [:]
        let callbackId = messageDict["callbackId"] as? String ?? ""

        // 3. 白名单校验
        let whitelist = ["getDeviceInfo", "jumpToNativePage", "requestPermission"]
        guard whitelist.contains(method) else {
            callbackToJs(callbackId: callbackId, data: nil, error: ["errorCode": -2, "errorMsg": "方法不存在或未授权"])
            return
        }

        // 4. 执行对应方法
        do {
            switch method {
            case "getDeviceInfo":
                // 获取设备信息
                let deviceInfo = [
                    "deviceType": "ios",
                    "deviceId": "987654321",
                    "appVersion": "1.0.0"
                ]
                callbackToJs(callbackId: callbackId, data: deviceInfo, error: nil)
            case "jumpToNativePage":
                let pageName = params["pageName"] as? String ?? ""
                // 跳转原生页面逻辑
                callbackToJs(callbackId: callbackId, data: "跳转成功", error: nil)
            default:
                callbackToJs(callbackId: callbackId, data: nil, error: ["errorCode": -2, "errorMsg": "方法不存在"])
            }
        } catch {
            callbackToJs(callbackId: callbackId, data: nil, error: ["errorCode": -3, "errorMsg": "原生方法执行失败：\(error.localizedDescription)"])
        }
    }

    // 5. 原生回调 JS 的统一方法
    private func callbackToJs(callbackId: String?, data: Any?, error: [String: Any]?) {
        guard let callbackId = callbackId, !callbackId.isEmpty else {
            return
        }

        // 组装回调结果
        var resultDict: [String: Any] = ["callbackId": callbackId]
        if let data = data {
            resultDict["data"] = data
        }
        if let error = error {
            resultDict["error"] = error
        }

        // 转换为 JSON 字符串
        guard JSONSerialization.isValidJSONObject(resultDict),
              let resultData = try? JSONSerialization.data(withJSONObject: resultDict),
              let resultJson = String(data: resultData, encoding: .utf8) else {
            return
        }

        // 调用 JS 的 onNativeCallback 方法
        let jsCode = "window.JSBridge.onNativeCallback(\(resultJson));"
        webView.evaluateJavaScript(jsCode, completionHandler: nil)
    }

    // 6. 原生主动调用 JS 方法
    func callJsMethod(method: String, params: [String: Any]?) {
        guard let params = params,
              JSONSerialization.isValidJSONObject(params),
              let paramsData = try? JSONSerialization.data(withJSONObject: params),
              let paramsJson = String(data: paramsData, encoding: .utf8) else {
            let jsCode = "window.JS_HANDLER_\(method)({})"
            webView.evaluateJavaScript(jsCode, completionHandler: { result in
                print("调用 JS 方法 \(method) 返回结果：\(result ?? "无结果")")
            })
            return
        }

        let jsCode = "window.JS_HANDLER_\(method)(\(paramsJson))"
        webView.evaluateJavaScript(jsCode, completionHandler: { result in
            print("调用 JS 方法 \(method) 返回结果：\(result ?? "无结果")")
        })
    }

    // 销毁监听
    deinit {
        webView.configuration.userContentController.removeScriptMessageHandler(forName: "NativeBridge")
    }
}

// 7. 初始化 WKWebView 并配置 JSBridge
class WebViewVC: UIViewController {
    private var webView: WKWebView!
    private var jsBridge: NativeJSBridge!

    override func viewDidLoad() {
        super.viewDidLoad()

        // 配置 WKWebView
        let config = WKWebViewConfiguration()
        webView = WKWebView(frame: view.bounds, configuration: config)
        view.addSubview(webView)

        // 初始化 JSBridge
        jsBridge = NativeJSBridge(webView: webView)

        // 加载网页
        if let url = URL(string: "https://your-hybrid-app.com") {
            webView.load(URLRequest(url: url))
        }

        // 示例：原生主动调用 JS 方法
        let params = ["refreshType": "pullDown"]
        jsBridge.callJsMethod(method: "onPageRefresh", params: params)
    }
}
```

### 三、关键注意事项

1. **安卓注入安全**：Android 4.2 以下存在注入漏洞，需避免使用 `addJavascriptInterface`，可降级为 URL Scheme 方式；
2. **iOS 循环引用**：`WKScriptMessageHandler` 容易导致循环引用，需在 `deinit` 中移除监听；
3. **JSON 序列化**：JS 与原生传递复杂对象时，必须通过 JSON 序列化/反序列化，避免类型丢失；
4. **主线程执行**：原生调用 JS 方法时，需在主线程执行（安卓 `webView.post`、iOS 主线程队列），避免 WebView 异常；
5. **调试技巧**：
   - JS 端：通过 `console.log` 打印消息内容，在 Chrome DevTools（安卓）/ Safari 开发者工具（iOS）中查看；
   - 原生端：Android 用 Logcat 打印日志，iOS 用 Xcode 控制台查看，方便定位通信问题。

### 总结

1. JSBridge 开发核心：统一消息格式、异步回调管理、双向通信支持、安全校验、兼容性处理；
2. 推荐使用「原生注入 API 式」通信，高效且稳定，适合现代混合应用；
3. 上述实现覆盖核心功能，可根据实际业务扩展（如添加签名校验、批量方法注册、缓存机制等）；
4. 注意不同系统的差异，做好兼容性处理和日志调试，方便后续问题排查。
