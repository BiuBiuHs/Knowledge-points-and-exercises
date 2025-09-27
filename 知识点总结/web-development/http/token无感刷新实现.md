### 核心思路
- 主动感知：从 JWT 的 exp 字段提前判断将过期，定时静默刷新。
- 被动感知：请求返回 401/invalid_token 时触发刷新，再重放原请求。
- 两者结合最佳：尽量提前刷新，兜底用 401 触发。

### 如何判断过期
- 方式1（推荐）：解码 JWT（不需验签，仅读取 payload）取 exp，提前 N 秒刷新。
- 方式2：后端登录响应里返回 `expires_in`，前端用时间戳推算。

简单解码 exp（无验签，仅做调度用）：
```js
function getJwtExp(jwt) {
  if (!jwt) return 0;
  const [, payload] = jwt.split('.');
  try { return JSON.parse(atob(payload)).exp || 0; } catch { return 0; }
}
```

### Axios 拦截器（含单次刷新与请求排队）
```js
import axios from 'axios';

let accessToken = '';            // 内存存储
let refreshPromise = null;       // 刷新进行中的“锁”
const EARLY_REFRESH_S = 60;      // 过期前60秒刷新

function willExpireSoon(token) {
  const exp = getJwtExp(token);
  const now = Math.floor(Date.now() / 1000);
  return exp && exp - now <= EARLY_REFRESH_S;
}

async function refreshTokens() {
  // 复用进行中的刷新
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    // 与后端约定：Refresh Token 放在 HttpOnly Cookie，需带凭证
    const res = await axios.post('/auth/refresh', null, { withCredentials: true });
    accessToken = res.data.access_token;
    return accessToken;
  })().finally(() => { refreshPromise = null; });
  return refreshPromise;
}

const api = axios.create({ baseURL: '/api', withCredentials: false });

// 请求拦截：自动挂载 token，必要时先刷新
api.interceptors.request.use(async (config) => {
  if (accessToken && willExpireSoon(accessToken)) {
    try { await refreshTokens(); } catch { /* 刷新失败走响应拦截兜底 */ }
  }
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// 响应拦截：401 时尝试刷新并重放一次
api.interceptors.response.use(
  r => r,
  async (error) => {
    const { config, response } = error;
    if (!response || response.status !== 401 || config.__retried) throw error;

    try {
      await refreshTokens();
      config.__retried = true;
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
      return api(config);
    } catch (e) {
      // 刷新失败：清理并跳登录
      accessToken = '';
      // 可选：window.location.href = '/login';
      throw e;
    }
  }
);

export async function login(username, password) {
  const res = await axios.post('/auth/login', { username, password }, { withCredentials: true });
  accessToken = res.data.access_token; // Refresh Token 已在 HttpOnly Cookie 中
}
```

### Fetch 轻量封装（锁 + 重放）
```js
let token = '';
let refreshing = null;

async function refresh() {
  if (refreshing) return refreshing;
  refreshing = fetch('/auth/refresh', { method: 'POST', credentials: 'include' })
    .then(r => r.json())
    .then(d => (token = d.access_token))
    .finally(() => (refreshing = null));
  return refreshing;
}

async function request(input, init = {}) {
  const headers = new Headers(init.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);

  // 主动刷新
  if (token && willExpireSoon(token)) {
    try { await refresh(); headers.set('Authorization', `Bearer ${token}`); } catch {}
  }

  let res = await fetch(input, { ...init, headers });
  if (res.status !== 401) return res;

  // 401 兜底刷新并重放一次
  await refresh();
  headers.set('Authorization', `Bearer ${token}`);
  return fetch(input, { ...init, headers });
}
```

### 关键注意点
- Refresh Token 放 HttpOnly+Secure+SameSite Cookie；刷新接口要 `credentials: 'include'` 或 `withCredentials: true`。
- 使用“单次刷新锁”避免并发多次刷新；请求在锁释放后重放。
- 刷新失败需清理状态并引导重新登录。
- 多标签页可用 BroadcastChannel/Storage 事件同步 token（可选）。

这样前端即可在“将过期/已过期（401）”两种场景下可靠地触发刷新并无感续期。