是的，`WebView Bridge` 的实现原理确实是在 `window` 对象上挂载对应的函数或变量，以便 JavaScript 可以调用原生方法，同时原生代码也可以调用 JavaScript 方法。这种机制允许 Web 代码和原生代码之间进行双向通信。下面详细解释一下这个实现原理，并提供具体的实现示例。

### 实现原理

1. **注册原生方法**：
   - 在原生代码中，注册一些可以在 JavaScript 中调用的方法。
   - 这些方法通常通过 `window` 对象上的特定名称暴露给 JavaScript。

2. **调用原生方法**：
   - JavaScript 通过调用 `window` 对象上的这些方法来调用原生代码。
   - 原生代码接收到调用请求后，执行相应的逻辑，并可以返回结果给 JavaScript。

3. **调用 JavaScript 方法**：
   - 原生代码可以通过 `WebView` 提供的 API（如 `evaluateJavaScript`）来调用 JavaScript 方法。
   - JavaScript 方法可以处理原生代码传递的数据，并返回结果给原生代码。

### 具体实现示例

#### 1. iOS 实现

**原生侧**：

```objective-c
#import <WebKit/WebKit.h>

@interface ViewController : UIViewController <WKScriptMessageHandler>
@property (nonatomic, strong) WKWebView *webView;
@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.webView = [[WKWebView alloc] initWithFrame:self.view.bounds];
    [self.view addSubview:self.webView];
    
    WKUserContentController *userContentController = [[WKUserContentController alloc] init];
    [userContentController addScriptMessageHandler:self name:@"myHandler"];
    self.webView.configuration.userContentController = userContentController;
    
    NSURL *url = [[NSBundle mainBundle] URLForResource:@"index" withExtension:@"html"];
    [self.webView loadRequest:[NSURLRequest requestWithURL:url]];
}

- (void)userContentController:(WKUserContentController *)userContentController didReceiveScriptMessage:(WKScriptMessage *)message {
    if ([message.name isEqualToString:@"myHandler"]) {
        NSDictionary *params = message.body;
        NSString *action = params[@"action"];
        if ([action isEqualToString:@"doSomething"]) {
            // 处理 params
            NSString *result = @"Result from native";
            [self.webView evaluateJavaScript:[NSString stringWithFormat:@"handleNativeResponse('%@')", result] completionHandler:nil];
        }
    }
}

@end
```

**Web 侧**：

```html
<!DOCTYPE html>
<html>
<head>
    <script>
        function callNative() {
            window.webkit.messageHandlers.myHandler.postMessage({ action: 'doSomething', param1: 'value1', param2: 'value2' });
        }

        function handleNativeResponse(result) {
            console.log('Native response:', result);
        }
    </script>
</head>
<body>
    <button onclick="callNative()">Call Native</button>
</body>
</html>
```

#### 2. Android 实现

**原生侧**：

```java
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webView);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.addJavascriptInterface(new MyJavaScriptInterface(), "myHandler");

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
            }
        });

        webView.loadUrl("file:///android_asset/index.html");
    }

    private class MyJavaScriptInterface {
        @JavascriptInterface
        public void callNative(String jsonString) {
            try {
                JSONObject params = new JSONObject(jsonString);
                String action = params.getString("action");
                if ("doSomething".equals(action)) {
                    // 处理 params
                    String result = "Result from native";
                    webView.evaluateJavascript("javascript:handleNativeResponse('" + result + "')", null);
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }
}
```

**Web 侧**：

```html
<!DOCTYPE html>
<html>
<head>
    <script>
        function callNative() {
            window.myHandler.callNative(JSON.stringify({ action: 'doSomething', param1: 'value1', param2: 'value2' }));
        }

        function handleNativeResponse(result) {
            console.log('Native response:', result);
        }
    </script>
</head>
<body>
    <button onclick="callNative()">Call Native</button>
</body>
</html>
```

### 关键点

1. **注册原生方法**：
   - **iOS**：通过 `WKUserContentController` 和 `WKScriptMessageHandler` 注册方法。
   - **Android**：通过 `addJavascriptInterface` 注册方法。

2. **调用原生方法**：
   - **JavaScript**：通过调用 `window` 对象上的方法来调用原生方法。
   - **原生**：处理请求并返回结果给 JavaScript。

3. **调用 JavaScript 方法**：
   - **原生**：通过 `evaluateJavaScript` 或 `loadUrl` 调用 JavaScript 方法。
   - **JavaScript**：处理原生代码传递的数据并返回结果。

### 总结

`WebView Bridge` 的实现原理确实是在 `window` 对象上挂载对应的函数名称或变量，以便 JavaScript 可以调用原生方法，同时原生代码也可以调用 JavaScript 方法。这种机制允许 Web 代码和原生代码之间进行高效的双向通信。希望这个解释和示例能帮助你更好地理解和实现 `WebView Bridge`。
