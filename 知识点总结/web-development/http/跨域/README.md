# 跨域示例

本目录包含两种常见的跨域解决方案的完整示例：

- **JSONP**：利用 script 标签不受同源策略限制的特性
- **CORS**：现代标准的跨域资源共享方案

## 前置要求

- Node.js >= 14.x
- 现代浏览器（支持 ES6+ 语法）

## 🚀 快速开始

### JSONP 示例

#### 方法一：通过 HTTP 服务器访问（推荐）

1. **启动 API 服务器**（端口 3100）：

```bash
cd JSONP
node server.js
```

2. **启动静态文件服务器**（端口 8080）：

```bash
cd JSONP
node static-server.js
```

3. **访问前端页面**：
   - 浏览器打开：<http://127.0.0.1:8080>
   - 或直接访问：<http://127.0.0.1:8080/frontend.html>

4. **测试 JSONP**：
   - 点击"发送 JSONP 请求"按钮
   - 查看返回的用户数据

#### 方法二：直接打开 HTML 文件

1. **启动 API 服务器**：

```bash
cd JSONP
node server.js
```

2. **打开前端页面**：
   - 直接用浏览器打开 `JSONP/frontend.html` 文件

### CORS 示例

#### 方法一：通过 HTTP 服务器访问（推荐）

1. **启动 API 服务器**（端口 3200）：

```bash
cd CORS
node server.js
```

2. **启动静态文件服务器**（端口 8081）：

```bash
cd CORS
node static-server.js
```

3. **访问前端页面**：
   - 浏览器打开：<http://127.0.0.1:8081>
   - 或直接访问：<http://127.0.0.1:8081/frontend.html>

4. **测试 CORS**：
   - 点击"发送 GET 请求"测试简单请求
   - 输入消息后点击"发送 POST 请求"测试预检请求

#### 方法二：直接打开 HTML 文件

1. **启动 API 服务器**：

```bash
cd CORS
node server.js
```

2. **打开前端页面**：
   - 直接用浏览器打开 `CORS/frontend.html` 文件

## 📋 端口分配

| 服务 | 端口 | 说明 |
|------|------|------|
| JSONP API | 3100 | JSONP 后端接口服务 |
| JSONP 静态文件 | 8080 | JSONP 前端页面服务 |
| CORS API | 3200 | CORS 后端接口服务 |
| CORS 静态文件 | 8081 | CORS 前端页面服务 |

## 🔍 关键知识点

### JSONP 原理

1. **利用 script 标签**：`<script>` 标签不受同源策略限制
2. **动态回调**：服务端返回 `callbackName(data)` 格式的 JavaScript 代码
3. **全局函数执行**：浏览器执行返回的 JS，调用预定义的全局回调函数

### CORS 原理

1. **简单请求**：直接发送，服务端返回 `Access-Control-Allow-Origin` 头
2. **预检请求**：复杂请求先发送 OPTIONS 请求检查权限
3. **响应头控制**：服务端通过响应头控制允许的域名、方法、头部等

## ⚠️ 注意事项

### JSONP 限制

- **仅支持 GET 请求**
- **安全风险**：需要信任服务端返回的 JavaScript 代码
- **错误处理困难**：难以获取详细的错误信息
- **调试复杂**：需要检查动态生成的 script 标签

### CORS 优势

- **支持所有 HTTP 方法**
- **更安全**：浏览器原生支持，有完整的安全检查
- **错误处理完善**：可以获取详细的错误信息
- **标准化**：W3C 标准，被所有现代浏览器支持

## 🛠️ 调试技巧

### JSONP 调试

1. **查看网络请求**：在浏览器开发者工具的 Network 面板查看 script 请求
2. **检查回调函数**：确保全局回调函数正确定义
3. **验证返回格式**：确保服务端返回的是 `callback(data)` 格式

### CORS 调试

1. **检查预检请求**：查看 OPTIONS 请求是否成功
2. **验证响应头**：确保服务端设置了正确的 CORS 头
3. **查看控制台错误**：CORS 错误会在控制台显示详细信息

## 🌐 扩展阅读

- [MDN - 同源策略](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy)
- [MDN - CORS](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)
- [MDN - JSONP](https://developer.mozilla.org/zh-CN/docs/Glossary/JSONP)

## 🤝 常见问题

**Q: 为什么推荐使用 HTTP 服务器而不是直接打开 HTML？**
A: 使用 HTTP 服务器可以更真实地模拟跨域环境，file:// 协议与 http:// 协议之间的跨域行为可能有所不同。

**Q: JSONP 和 CORS 应该选择哪个？**
A: 现代项目建议使用 CORS，JSONP 主要用于兼容不支持 CORS 的老旧浏览器。

**Q: 如何在生产环境中安全地使用这些方案？**
A:

- JSONP：严格验证回调函数名，使用白名单机制
- CORS：精确设置 `Access-Control-Allow-Origin`，避免使用 `*`
