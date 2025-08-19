`fetch` 和 `axios` 都是用于在客户端发送 HTTP 请求的库，但它们在设计、使用方式和功能上有一些重要的区别。以下是 `fetch` 和 `axios` 的主要区别：

### 1. **设计和实现**

- **`fetch`**：
  - `fetch` 是浏览器内置的全局函数，无需额外安装。
  - 它返回一个 Promise，符合现代 JavaScript 的异步编程模型。
  - `fetch` 遵循 Fetch API 规范，提供了一个低级别的、标准化的接口。

- **`axios`**：
  - `axios` 是一个基于 Promise 的 HTTP 客户端，可以用于浏览器和 Node.js 环境。
  - 它是一个第三方库，需要通过 npm 或其他包管理器安装。
  - `axios` 提供了更多的高级功能和更好的开发体验。

### 2. **请求配置**

- **`fetch`**：
  - 配置选项需要通过一个对象传递，且某些选项（如 `body`）需要进行额外的处理（例如，将对象转换为 JSON 字符串）。
  - 默认情况下，`fetch` 不会发送任何请求头，除非明确指定。
  - 例如：

    ```javascript
    fetch('https://api.example.com/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ key: 'value' })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
    ```

- **`axios`**：
  - 配置选项更加直观，支持直接传递对象。
  - `axios` 会自动处理 JSON 序列化和解析。
  - 例如：

    ```javascript
    axios.post('https://api.example.com/data', {
      key: 'value'
    })
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
    ```

### 3. **错误处理**

- **`fetch`**：
  - `fetch` 只会在网络请求失败时（例如，网络中断或服务器无响应）才返回一个被拒绝的 Promise。
  - 服务器返回的非 2xx 状态码不会导致 `fetch` 返回的 Promise 被拒绝。需要手动检查 `response.ok`。
  - 例如：

    ```javascript
    fetch('https://api.example.com/data')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
    ```

- **`axios`**：
  - `axios` 会在网络请求失败或服务器返回非 2xx 状态码时返回一个被拒绝的 Promise。
  - 例如：

    ```javascript
    axios.get('https://api.example.com/data')
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    ```

### 4. **请求拦截和响应拦截**

- **`fetch`**：
  - `fetch` 本身不支持请求拦截和响应拦截，需要手动实现。
  - 例如，可以使用中间件或自定义函数来实现。

- **`axios`**：
  - `axios` 内置了请求和响应拦截器，可以在请求发送前或响应接收后进行处理。
  - 例如：

    ```javascript
    axios.interceptors.request.use(config => {
      // 在发送请求之前做些什么
      console.log('Request intercepted:', config);
      return config;
    }, error => {
      // 对请求错误做些什么
      return Promise.reject(error);
    });

    axios.interceptors.response.use(response => {
      // 对响应数据做些什么
      console.log('Response intercepted:', response);
      return response;
    }, error => {
      // 对响应错误做些什么
      return Promise.reject(error);
    });
    ```

### 5. **默认行为和配置**

- **`fetch`**：
  - 默认情况下，`fetch` 不会发送任何请求头，除非明确指定。
  - 不支持取消请求，需要使用第三方库（如 `AbortController`）来实现。

- **`axios`**：
  - 支持默认配置，可以设置全局默认值（如基础 URL、请求头等）。
  - 支持取消请求，可以使用 `cancelToken` 来取消请求。
  - 例如：

    ```javascript
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    axios.get('https://api.example.com/data', {
      cancelToken: source.token
    }).catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled', thrown.message);
      } else {
        // 处理错误
      }
    });

    // 取消请求
    source.cancel('Operation canceled by the user.');
    ```

### 6. **浏览器支持**

- **`fetch`**：
  - `fetch` 是现代浏览器的内置函数，但在一些旧版本的浏览器中可能不支持。可以使用 polyfill（如 `whatwg-fetch`）来提供兼容性。

- **`axios`**：
  - `axios` 是一个纯 JavaScript 库，可以在所有现代浏览器和 Node.js 环境中使用。

### 总结

- **`fetch`**：内置、标准化、低级别、需要更多的手动配置和错误处理。
- **`axios`**：第三方库、高级功能、更好的开发体验、支持请求和响应拦截、支持取消请求。

希望这些解释对你有帮助！如果有任何进一步的问题，请随时告诉我。
