在 React 项目中，捕获错误是非常重要的，以确保应用在发生错误时能够优雅地处理并提供用户友好的反馈。React 提供了几种机制来捕获和处理错误，包括错误边界（Error Boundaries）、`componentDidCatch` 生命周期方法、以及在函数组件中使用 `useErrorBoundary` 钩子。

### 1. 错误边界（Error Boundaries）

错误边界是一种 React 组件，可以捕获并打印发生在其子组件树中的任何错误。错误边界在渲染期间、生命周期方法和整个组件树的构造函数中捕获错误。

#### 创建错误边界

```jsx
import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // 你可以在日志服务中记录错误
    console.error('Caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    // 正常渲染子组件
    return this.props.children;
  }
}

export default ErrorBoundary;
```

#### 使用错误边界

```jsx
import React from 'react';
import ErrorBoundary from './ErrorBoundary';

function MyComponent() {
  throw new Error('This is an error');
  return <div>Hello, World!</div>;
}

function App() {
  return (
    <div>
      <h1>React Error Boundary Example</h1>
      <ErrorBoundary>
        <MyComponent />
      </ErrorBoundary>
    </div>
  );
}

export default App;
```

### 2. 使用 `useErrorBoundary` 钩子

对于函数组件，你可以使用 `useErrorBoundary` 钩子来捕获错误。`useErrorBoundary` 钩子可以在函数组件中提供类似错误边界的功能。

#### 安装 `use-error-boundary` 包

```sh
npm install use-error-boundary
```

#### 使用 `useErrorBoundary` 钩子

```jsx
import React from 'react';
import { useErrorBoundary } from 'use-error-boundary';

function MyComponent() {
  throw new Error('This is an error');
  return <div>Hello, World!</div>;
}

function App() {
  const { ErrorBoundary } = useErrorBoundary();

  return (
    <div>
      <h1>React Error Boundary Example</h1>
      <ErrorBoundary>
        <MyComponent />
      </ErrorBoundary>
    </div>
  );
}

export default App;
```

### 3. 使用 `React.Suspense` 和 `React.Lazy`

在使用代码分割（Code Splitting）时，`React.Suspense` 和 `React.Lazy` 可以帮助你处理异步加载错误。

```jsx
import React, { Suspense, lazy } from 'react';

const MyComponent = lazy(() => import('./MyComponent'));

function App() {
  return (
    <div>
      <h1>React Suspense Example</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <MyComponent />
      </Suspense>
    </div>
  );
}

export default App;
```

### 4. 全局错误处理

你还可以在应用的顶层设置一个全局的错误处理机制，例如使用 `window.onerror` 或 `unhandledrejection` 事件。

```jsx
import React from 'react';

window.onerror = (msg, source, line, col, error) => {
  console.error('Global error handler:', msg, source, line, col, error);
  return true;
};

window.addEventListener('unhandledrejection', (event) => {
  console.error('Global promise rejection handler:', event.reason);
});

function App() {
  return (
    <div>
      <h1>React Global Error Handling Example</h1>
      <button onClick={() => { throw new Error('Global error'); }}>Trigger Global Error</button>
      <button onClick={() => { Promise.reject(new Error('Promise rejection')); }}>Trigger Promise Rejection</button>
    </div>
  );
}

export default App;
```

### 总结

- **错误边界**：适用于捕获子组件树中的错误，并提供降级后的 UI。
- **`useErrorBoundary` 钩子**：适用于函数组件，提供类似错误边界的功能。
- **`React.Suspense` 和 `React.Lazy`**：适用于处理异步加载错误。
- **全局错误处理**：适用于捕获全局的错误和未处理的 Promise 拒绝。

选择哪种方法取决于你的具体需求和应用场景。希望这些示例能帮助你更好地捕获和处理 React 项目中的错误。如果有任何进一步的问题，请随时提问。
