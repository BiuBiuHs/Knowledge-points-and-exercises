HTTP 头部字段用于在 HTTP 请求和响应中传递附加信息。这些头部字段可以分为请求头部和响应头部，每种类型的头部字段都有其特定的作用。以下是一些常见的 HTTP 头部字段及其作用的解释：

### 常见的请求头部字段

1. **Host**：
   - **作用**：指定请求的目标主机和端口号。
   - **示例**：`Host: example.com`

2. **User-Agent**：
   - **作用**：提供客户端的信息，如浏览器类型、版本、操作系统等。
   - **示例**：`User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3`

3. **Accept**：
   - **作用**：指定客户端能够处理的内容类型。
   - **示例**：`Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8`

4. **Accept-Language**：
   - **作用**：指定客户端的首选语言。
   - **示例**：`Accept-Language: en-US,en;q=0.9`

5. **Accept-Encoding**：
   - **作用**：指定客户端能够处理的内容编码方式（如压缩）。
   - **示例**：`Accept-Encoding: gzip, deflate, br`

6. **Content-Type**：
   - **作用**：指定请求体的 MIME 类型。
   - **示例**：`Content-Type: application/json`

7. **Content-Length**：
   - **作用**：指定请求体的长度（以字节为单位）。
   - **示例**：`Content-Length: 34`

8. **Authorization**：
   - **作用**：提供客户端的认证信息，用于身份验证。
   - **常见方案**：
     - `Basic`：基本认证（Base64 编码的用户名:密码）
     - `Bearer`：JWT Token 或 OAuth2 令牌
     - `Digest`：摘要认证
     - 自定义方案
   - **示例**：
     - `Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=`
     - `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **特点**：
     - 需要前端手动设置（不会自动携带）
     - 不受 Cookie 限制，可跨域携带
     - 通常用于 API 认证（RESTful API、JWT）
     - 每次请求都需要手动添加到请求头

9. **Referer**：
   - **作用**：指定发出请求的页面 URL。
   - **示例**：`Referer: https://example.com/page1`

10. **Connection**：
    - **作用**：指定连接的管理方式，如 `keep-alive` 或 `close`。
    - **示例**：`Connection: keep-alive`

11. **Cache-Control**：
    - **作用**：控制缓存的行为。
    - **示例**：`Cache-Control: no-cache`

12. **Cookie**：
    - **作用**：发送存储在客户端的 Cookie 信息到服务器。浏览器会自动携带该域名下的 Cookie。
    - **示例**：`Cookie: session_id=12345; user_id=67890`
    - **特点**：
      - 浏览器自动管理（自动携带、自动存储）
      - 受同源策略限制
      - 有大小限制（约 4KB）
      - 可设置过期时间、Domain、Path、HttpOnly、Secure 等属性

### 常见的响应头部字段

1. **Date**：
   - **作用**：指定响应生成的日期和时间。
   - **示例**：`Date: Tue, 26 Jul 2023 12:00:00 GMT`

2. **Server**：
   - **作用**：提供服务器的软件信息。
   - **示例**：`Server: Apache/2.4.41 (Ubuntu)`

3. **Content-Type**：
   - **作用**：指定响应体的 MIME 类型。
   - **示例**：`Content-Type: text/html; charset=utf-8`

4. **Content-Length**：
   - **作用**：指定响应体的长度（以字节为单位）。
   - **示例**：`Content-Length: 1234`

5. **Content-Encoding**：
   - **作用**：指定响应体的编码方式（如压缩）。
   - **示例**：`Content-Encoding: gzip`

6. **Content-Language**：
   - **作用**：指定响应的自然语言。
   - **示例**：`Content-Language: en-US`

7. **Cache-Control**：
   - **作用**：控制缓存的行为。
   - **示例**：`Cache-Control: max-age=3600`

8. **ETag**：
   - **作用**：提供资源的唯一标识符，用于缓存验证。
   - **示例**：`ETag: "1234567890"`

9. **Last-Modified**：
   - **作用**：指定资源的最后修改时间。
   - **示例**：`Last-Modified: Tue, 26 Jul 2023 11:00:00 GMT`

10. **Set-Cookie**：
    - **作用**：服务器通过该字段设置客户端的 Cookie，浏览器会自动存储。
    - **示例**：`Set-Cookie: session_id=12345; HttpOnly; Secure; Path=/; Max-Age=3600`
    - **常用属性**：
      - `Expires`：过期时间（绝对时间）
      - `Max-Age`：过期时间（相对秒数）
      - `Domain`：Cookie 的域（默认为当前域）
      - `Path`：Cookie 的路径（默认为 /）
      - `Secure`：仅通过 HTTPS 传输
      - `HttpOnly`：禁止 JavaScript 访问（防止 XSS）
      - `SameSite`：跨站请求限制（Strict/Lax/None）
    - **完整示例**：

      ```
      Set-Cookie: token=abc123; Max-Age=7200; Path=/; HttpOnly; Secure; SameSite=Strict
      ```

11. **Location**：
    - **作用**：指定重定向的 URL。
    - **示例**：`Location: https://example.com/newpage`

12. **Access-Control-Allow-Origin**：
    - **作用**：指定允许访问资源的源（用于 CORS）。
    - **示例**：`Access-Control-Allow-Origin: https://example.com`

13. **Access-Control-Allow-Methods**：
    - **作用**：指定允许的 HTTP 方法（用于 CORS）。
    - **示例**：`Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`

14. **Access-Control-Allow-Headers**：
    - **作用**：指定允许的请求头（用于 CORS）。
    - **示例**：`Access-Control-Allow-Headers: Content-Type, Authorization`

---

## Cookie vs Token 认证方式详解

### 1. Cookie 认证流程

```
客户端                                  服务器
  |                                       |
  | -------- POST /login ---------------> |
  | { username, password }                | 
  |                                       | 验证成功，生成 session
  | <------- Set-Cookie: sessionId ---- |
  | 浏览器自动保存 Cookie                 |
  |                                       |
  | -------- GET /api/user ------------> |
  | Cookie: sessionId=abc123  (自动携带) | 
  |                                       | 根据 sessionId 查找用户
  | <------- 返回用户数据 --------------- |
```

**关键点：**

- 服务器响应头：`Set-Cookie: sessionId=abc123; HttpOnly; Secure`
- 浏览器请求头：`Cookie: sessionId=abc123`（**自动携带**）
- 浏览器会自动管理 Cookie 的存储和发送

### 2. Token (JWT) 认证流程

```
客户端                                  服务器
  |                                       |
  | -------- POST /login ---------------> |
  | { username, password }                |
  |                                       | 验证成功，生成 JWT
  | <------- { token: "eyJhb..." } ----- |
  | 前端手动保存 token                    |
  | (localStorage/sessionStorage)         |
  |                                       |
  | -------- GET /api/user ------------> |
  | Authorization: Bearer eyJhb... (手动) |
  |                                       | 验证 JWT 并解析用户信息
  | <------- 返回用户数据 --------------- |
```

**关键点：**

- 服务器响应体：`{ token: "eyJhbGci..." }`
- 前端手动保存：`localStorage.setItem('token', token)`
- 前端手动携带：`Authorization: Bearer ${token}`（**需要手动添加**）

### 3. 实际代码示例

#### Cookie 方式（传统 Session）

**服务端（Node.js + Express）：**

```javascript
// 登录接口
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // 验证用户
  if (validateUser(username, password)) {
    const sessionId = generateSessionId();
    
    // 存储 session（Redis/内存/数据库）
    sessions[sessionId] = { userId: user.id, username };
    
    // 设置 Cookie（浏览器会自动保存）
    res.cookie('sessionId', sessionId, {
      httpOnly: true,    // 防止 XSS
      secure: true,      // 仅 HTTPS
      maxAge: 3600000,   // 1小时
      sameSite: 'strict' // 防止 CSRF
    });
    
    res.json({ success: true });
  }
});

// 受保护的接口
app.get('/api/user', (req, res) => {
  // 浏览器自动携带 Cookie
  const sessionId = req.cookies.sessionId;
  
  // 从 session 存储中查找用户
  const session = sessions[sessionId];
  
  if (session) {
    res.json({ userId: session.userId, username: session.username });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});
```

**前端（Fetch）：**

```javascript
// 登录（Cookie 会自动保存）
async function login() {
  const response = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',  // ⚠️ 关键：允许携带 Cookie
    body: JSON.stringify({ username: 'admin', password: '123456' })
  });
  
  // Cookie 已自动保存，不需要手动处理
  const data = await response.json();
  console.log('登录成功', data);
}

// 后续请求（Cookie 自动携带）
async function getUserInfo() {
  const response = await fetch('/api/user', {
    credentials: 'include'  // ⚠️ 关键：自动携带 Cookie
  });
  
  const user = await response.json();
  console.log('用户信息:', user);
}
```

#### Token (JWT) 方式

**服务端（Node.js + Express）：**

```javascript
const jwt = require('jsonwebtoken');

// 登录接口
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // 验证用户
  if (validateUser(username, password)) {
    // 生成 JWT Token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      'secret_key',
      { expiresIn: '1h' }
    );
    
    // 返回 token（前端需要手动保存）
    res.json({ token });
  }
});

// 受保护的接口
app.get('/api/user', (req, res) => {
  // 从 Authorization 头获取 token
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.substring(7);  // 去掉 "Bearer "
  
  try {
    // 验证并解析 token
    const decoded = jwt.verify(token, 'secret_key');
    res.json({ userId: decoded.userId, username: decoded.username });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});
```

**前端（Fetch）：**

```javascript
// 登录（需要手动保存 token）
async function login() {
  const response = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: '123456' })
  });
  
  const data = await response.json();
  
  // ⚠️ 手动保存 token
  localStorage.setItem('token', data.token);
  console.log('登录成功，token 已保存');
}

// 后续请求（需要手动携带 token）
async function getUserInfo() {
  // ⚠️ 手动获取 token
  const token = localStorage.getItem('token');
  
  const response = await fetch('/api/user', {
    headers: {
      // ⚠️ 手动添加 Authorization 头
      'Authorization': `Bearer ${token}`
    }
  });
  
  const user = await response.json();
  console.log('用户信息:', user);
}

// Axios 可以设置拦截器自动添加 token
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 4. 对比总结

| 特性 | Cookie | Token (JWT) |
|------|--------|-------------|
| **服务器设置** | `Set-Cookie` 响应头 | 响应体返回 token |
| **客户端存储** | 浏览器自动存储 | 手动存储（localStorage/sessionStorage） |
| **请求携带** | `Cookie` 请求头（**自动**） | `Authorization` 请求头（**手动**） |
| **大小限制** | 约 4KB | 无限制（取决于存储） |
| **跨域** | 受同源策略限制 | 可自由跨域 |
| **CSRF 攻击** | 容易受到攻击 | 不受影响 |
| **XSS 攻击** | HttpOnly 可防御 | 无法防御（存在 localStorage） |
| **适用场景** | 传统 Web 应用、同源请求 | RESTful API、跨域、移动端 |
| **服务器存储** | 需要（Session） | 不需要（无状态） |

### 5. 混合方案（Cookie + Token）

**最佳实践：将 Token 存储在 Cookie 中**

```javascript
// 服务端：将 JWT 设置为 HttpOnly Cookie
app.post('/login', (req, res) => {
  const token = jwt.sign({ userId: user.id }, 'secret');
  
  res.cookie('token', token, {
    httpOnly: true,    // 防止 XSS
    secure: true,      // HTTPS only
    sameSite: 'strict' // 防止 CSRF
  });
  
  res.json({ success: true });
});

// 客户端：Cookie 自动携带，无需手动处理
fetch('/api/user', {
  credentials: 'include'  // 自动携带 Cookie 中的 token
});
```

**优势：**

- ✅ 结合 Cookie 的自动携带
- ✅ 结合 JWT 的无状态
- ✅ HttpOnly 防止 XSS
- ✅ SameSite 防止 CSRF

### 6. 自定义请求头传递 Token

除了 `Authorization`，也可以使用自定义头部：

```javascript
// 前端
fetch('/api/user', {
  headers: {
    'X-Auth-Token': token,      // 自定义头部
    'X-API-Key': apiKey         // API Key
  }
});

// 服务端
app.use((req, res, next) => {
  const token = req.headers['x-auth-token'];
  if (token) {
    // 验证 token
  }
  next();
});
```

**注意：** 自定义头部在跨域时需要服务器配置 CORS：

```javascript
res.setHeader('Access-Control-Allow-Headers', 'X-Auth-Token, X-API-Key');
```

### 7. 常见问题

#### Q1: 为什么 Token 需要手动携带？

**A:** 因为 Token 通常存储在 localStorage 或 sessionStorage 中，浏览器不会自动发送。需要通过 JavaScript 手动添加到请求头。

#### Q2: Cookie 一定会自动携带吗？

**A:** 不一定。需要满足以下条件：

- 同源请求：自动携带
- 跨域请求：需要设置 `credentials: 'include'`
- 服务器需要返回 `Access-Control-Allow-Credentials: true`

#### Q3: Authorization 头部可以携带 Cookie 吗？

**A:** 不行。Cookie 有专门的 `Cookie` 请求头。`Authorization` 通常用于携带 Token。

#### Q4: 如何选择 Cookie 还是 Token？

**A:**

- 传统 Web 应用、同源 → **Cookie**
- RESTful API、跨域、移动端 → **Token**
- 安全性高、混合应用 → **Cookie + JWT（Token 存在 HttpOnly Cookie）**

### 8. 完整对比示例

```javascript
// ========== Cookie 方式 ==========
// 登录
fetch('/login', {
  method: 'POST',
  credentials: 'include',
  body: JSON.stringify({ username, password })
});
// 响应头: Set-Cookie: sessionId=abc123

// 请求
fetch('/api/data', {
  credentials: 'include'  // 浏览器自动添加: Cookie: sessionId=abc123
});


// ========== Token 方式 ==========
// 登录
const res = await fetch('/login', {
  method: 'POST',
  body: JSON.stringify({ username, password })
});
const { token } = await res.json();
localStorage.setItem('token', token);  // 手动保存

// 请求
fetch('/api/data', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`  // 手动携带
  }
});
```
