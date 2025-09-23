### Token 存储与认证：JWT 与 OAuth 2.0（实战指南）

本文聚焦两类最常用方案：

- JWT（JSON Web Token）自包含令牌：无状态验证、前后端分离常用
- OAuth 2.0（含 OIDC）：标准授权协议，覆盖第三方登录、移动/SPA 场景

目标：给出端到端流程与“前端/后端如何存储与安全使用 Token”的明确实践。

---

## 1. 基本术语

- Access Token：短期访问令牌，用于访问受保护资源（通常放在 `Authorization: Bearer <token>`）。
- Refresh Token：长期刷新令牌，用于换取新的 Access Token（绝不暴露给前端 JS）。
- ID Token（OIDC）：描述用户身份的 JWT（仅身份，不用于访问资源）。

---

## 2. 前端存储与传输的最佳实践

- Access Token：存“内存”（Memory）
  - 可放在应用状态（例如 React Context/Redux/Pinia/全局变量）
  - 退出/刷新页面会丢失，配合 Refresh Token 透明续期
  - 发送时置于请求头：`Authorization: Bearer <access_token>`

- Refresh Token：存“安全 Cookie”（服务端设置 HttpOnly, Secure, SameSite）
  - HttpOnly：JS 无法读取，有效抵御 XSS 窃取
  - Secure：仅 HTTPS 传输
  - SameSite=Lax/Strict：降低 CSRF 风险；若需跨站调用刷新接口，使用 Lax 并配合 CSRF Token
  - 调用刷新接口时，浏览器自动携带 Cookie；前端无需操作

- 绝不建议：在 LocalStorage/SessionStorage 里存 Refresh Token；Access Token 如无更好替代可放内存，避免被 XSS 扫荡本地存储。

---

## 3. JWT 验证（后端无状态）

### 3.1 签发流程

1) 用户登录提交凭证（账号+密码 / 第三方回调）
2) 服务器验证通过后：
   - 生成短期 Access Token（JWT，含用户标识、过期时间 `exp`、权限等）
   - 生成长期 Refresh Token（随机不可预测字符串或 JWT），通过 Set-Cookie 下发：`HttpOnly; Secure; SameSite=Lax; Path=/auth/refresh`（示例）
   - 将 Access Token 返回给前端（JSON 响应体）

### 3.2 访问受保护资源

- 前端在请求头附带 `Authorization: Bearer <access_token>`
- 服务器使用公钥/密钥验证 JWT 签名与过期时间
- 通过后继续执行业务逻辑，否则返回 401/403

### 3.3 刷新与轮换（Token Rotation）

- Access Token 过期后：前端静默调用 `/auth/refresh`（携带 HttpOnly Refresh Token Cookie）
- 服务器验证 Refresh Token（查黑名单/存库/签名校验/是否被吊销），签发新一对令牌：
  - 新 Access Token（返回给前端）
  - 新 Refresh Token（Set-Cookie 覆盖旧的）
- 将旧 Refresh Token 作废（入黑名单/版本号递增），防止被重放

### 3.4 Node/Express 验证示例（伪代码）

```javascript
// 中间件：验证 Access Token
const jwt = require('jsonwebtoken');

function auth(required = true) {
  return (req, res, next) => {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (!token) return required ? res.status(401).end() : next();
    try {
      const payload = jwt.verify(token, process.env.JWT_PUBLIC_KEY, { algorithms: ['RS256'] });
      req.user = payload; // { sub, scope, exp, ... }
      next();
    } catch (e) {
      return res.status(401).json({ error: 'invalid_or_expired_token' });
    }
  };
}

// 刷新接口：使用 HttpOnly Refresh Token Cookie
app.post('/auth/refresh', async (req, res) => {
  const rt = req.cookies?.refresh_token; // 需使用 cookie 解析中间件
  if (!rt) return res.status(401).end();

  // 校验/查询是否被吊销/版本号匹配
  const isValid = await verifyRefreshToken(rt);
  if (!isValid) return res.status(401).end();

  const newAccess = signAccessToken({ sub: userId, scope: '...' }, { expiresIn: '15m' });
  const newRefresh = await rotateRefreshToken(rt); // 旧的作废，新的写入 Cookie

  res.cookie('refresh_token', newRefresh, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/auth/refresh',
    maxAge: 30 * 24 * 3600 * 1000
  });
  res.json({ access_token: newAccess, token_type: 'Bearer', expires_in: 900 });
});
```

---

## 4. OAuth 2.0（含 PKCE 与 OIDC）

OAuth 2.0 定义了角色（授权服务器、资源服务器、客户端、资源所有者）与多种“授权方式”。前端应用（SPA/移动端）推荐“授权码模式 + PKCE”。如需要获取身份信息，配合 OIDC 返回 ID Token。

### 4.1 授权码模式 + PKCE（SPA/移动端首选）

流程：

1) 客户端生成 `code_verifier`，派生 `code_challenge`
2) 跳转到授权服务器 `/authorize`：
   - 携带：`response_type=code`、`client_id`、`redirect_uri`、`scope`、`state`、`code_challenge`、`code_challenge_method=S256`
3) 用户登录并同意授权，浏览器重定向回 `redirect_uri?code=...&state=...`
4) 客户端将 `code` + `code_verifier` 发送至授权服务器 `/token` 交换 `access_token`（可伴随 `refresh_token`、`id_token`）
5) 客户端用 `access_token` 调用资源服务器 API

示例（生成 PKCE 参数，伪代码）：

```javascript
// 浏览器端生成 PKCE 参数
async function createPKCE() {
  const codeVerifier = base64url(crypto.getRandomValues(new Uint8Array(32)));
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier));
  const codeChallenge = base64url(new Uint8Array(digest));
  return { codeVerifier, codeChallenge };
}
```

交换 Token（后端或前端安全通道）：

```http
POST /oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
code=AUTH_CODE&
redirect_uri=ENCODED_REDIRECT_URI&
client_id=CLIENT_ID&
code_verifier=CODE_VERIFIER
```

服务器响应：`access_token`、`expires_in`、可选 `refresh_token`、可选 `id_token`（OIDC）。

### 4.2 其他授权方式（简述）

- 客户端凭证（Client Credentials）：服务对服务（机器对机器），无用户参与
- 资源所有者密码凭证（ROPC）：已不推荐，除非强需求且场景受控
- 隐式模式（Implicit）：历史方案，已被 PKCE 替代（安全性不足）

### 4.3 OIDC（OpenID Connect）

- 在 OAuth 2.0 之上增加身份层，返回 ID Token（JWT），可包含 `sub`、`email`、`name` 等声明
- ID Token 只用于身份，不用于访问资源 API

---

## 5. 前后端协作要点（安全）

- 全站 HTTPS（确保 `Secure` Cookie 与令牌传输安全）
- CSRF 防护：
  - 使用 `SameSite=Lax/Strict` + 非幂等操作要求携带自定义头（如 `X-CSRF-Token`）
  - 刷新接口可采用双重提交 Cookie/服务器维护 CSRF Token
- XSS 防护：严格 CSP、输出转义、输入校验、依赖锁定
- 令牌最小化：短生命周期 Access Token + 可吊销/轮换的 Refresh Token
- 注销/吊销：
  - 后端提供 `/auth/logout`（清除刷新 Cookie、刷新令牌入黑名单）
  - OAuth 提供 revocation endpoint 撤销 `access_token`/`refresh_token`
- 跨域：若前端与后端域不同，需要 CORS 允许 `Authorization`、`withCredentials` 并限制可信域

---

## 6. 常见落坑与对策

- 把 Refresh Token 放在 LocalStorage → 高风险；改为 HttpOnly Cookie
- Access Token 长期有效 → 被盗即长期有效；改为短期（5–15 分钟）并强制刷新
- 刷新接口未做 Token 轮换与吊销 → 一旦泄漏可无限刷新；开启轮换与黑名单
- 未校验 JWT `aud`/`iss`/`exp`/`nbf` → 拒绝不符合受众/发行者/过期的令牌
- OIDC 的 ID Token 被错误用于资源访问 → 仅用作身份声明

---

## 7. 前端调用时序（SPA 示例）

1) 登录成功：服务端返回 `access_token`（JSON）+ 设置 `refresh_token`（HttpOnly Cookie）
2) 前端将 `access_token` 存内存；请求时带 `Authorization: Bearer ...`
3) 401 或将过期：静默调用 `/auth/refresh`（浏览器自动带上 Cookie）换新 token
4) 刷新失败：跳转登录页/触发重新认证
5) 退出登录：调用 `/auth/logout`，清除服务器端记录并让 Cookie 过期

---

## 8. 小结（一页记住）

- Access Token：存内存，短期有效，放 `Authorization` 头
- Refresh Token：服务端以 HttpOnly+Secure+SameSite Cookie 下发，负责续期
- JWT：无状态、快；注意签名算法、密钥管理与声明校验
- OAuth 2.0 + PKCE：前端/移动端首选路径；OIDC 带来用户身份（ID Token）
- 安全三板斧：HTTPS、XSS/CSRF 防护、Token 短期化 + 轮换 + 吊销
