# React 18 严格模式下 useEffect 调用两次的问题

## 问题描述

在 React 18 中，使用 `createRoot` 创建应用并启用严格模式（`<StrictMode>`）时，`useEffect` 在依赖项为空数组 `[]` 时会被调用两次。

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  useEffect(() => {
    console.log('Effect 执行了'); // 在严格模式下会打印两次
  }, []);

  return <div>Hello</div>;
}

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

## 原因分析

### 1. 这是 React 18 的预期行为

**React 18 严格模式故意双重调用以下函数**：
- 组件函数（包括函数组件）
- 初始化器函数（`useState`、`useMemo`、`useReducer` 等）
- 更新器函数（`setState`、`dispatch` 等）
- Effect 清理函数和 Effect 函数（`useEffect`、`useLayoutEffect`）

### 2. 为什么这样做？

React 严格模式通过双重调用来帮助开发者：
- **发现副作用问题**：确保组件能够正确处理副作用
- **准备并发特性**：确保代码在并发模式下也能正常工作
- **提前发现 bug**：暴露潜在的副作用问题

### 3. 执行流程

```
严格模式下的执行流程：

1. 首次渲染
   - 组件函数执行
   - useEffect 执行（第一次）
   - useEffect 清理函数执行（立即）
   - 组件函数再次执行（严格模式）
   - useEffect 执行（第二次）

2. 更新时
   - 组件函数执行
   - useEffect 清理函数执行
   - useEffect 执行（第一次）
   - 组件函数再次执行（严格模式）
   - useEffect 清理函数执行（再次）
   - useEffect 执行（第二次）
```

## 解决方案

### 方案1：使用 useRef 防止重复执行（推荐）

使用 `useRef` 创建一个标志，确保副作用只执行一次：

```jsx
import { useEffect, useRef } from 'react';

function MyComponent() {
  const hasRun = useRef(false);

  useEffect(() => {
    // 只在第一次执行
    if (!hasRun.current) {
      hasRun.current = true;
      
      // 你的副作用代码
      console.log('Effect 只执行一次');
      fetchData();
    }
  }, []);

  return <div>Content</div>;
}
```

### 方案2：使用清理函数确保幂等性（最佳实践）

确保副作用是幂等的（可以安全地多次执行）：

```jsx
import { useEffect } from 'react';

function MyComponent() {
  useEffect(() => {
    let isCancelled = false;

    // 异步操作
    const fetchData = async () => {
      const data = await api.getData();
      if (!isCancelled) {
        setData(data);
      }
    };

    fetchData();

    // 清理函数
    return () => {
      isCancelled = true;
    };
  }, []);

  return <div>Content</div>;
}
```

### 方案3：移除 StrictMode（不推荐）

如果确实需要避免双重调用，可以移除 `StrictMode`：

```jsx
// ❌ 不推荐：移除严格模式
const root = createRoot(document.getElementById('root'));
root.render(<App />); // 移除了 <StrictMode>

// ✅ 推荐：保留严格模式，使用方案1或2
```

### 方案4：使用自定义 Hook 封装

创建一个自定义 Hook 来封装"只执行一次"的逻辑：

```jsx
import { useEffect, useRef } from 'react';

/**
 * 自定义 Hook：确保 useEffect 在严格模式下只执行一次
 */
function useOnceEffect(effect, deps) {
  const hasRun = useRef(false);
  const cleanupRef = useRef(null);

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      cleanupRef.current = effect();
    }

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, deps);
}

// 使用
function MyComponent() {
  useOnceEffect(() => {
    console.log('只执行一次');
    fetchData();
  }, []);

  return <div>Content</div>;
}
```

### 方案5：使用 useMemo 或 useState 的初始化函数

对于只需要初始化一次的值，使用 `useState` 的初始化函数：

```jsx
import { useState } from 'react';

function MyComponent() {
  // useState 的初始化函数只在首次渲染时执行一次
  const [data] = useState(() => {
    console.log('只执行一次');
    return fetchInitialData();
  });

  return <div>{data}</div>;
}
```

## 不同场景的处理

### 场景1：API 请求

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    async function fetchUser() {
      try {
        const data = await fetch(`/api/users/${userId}`).then(r => r.json());
        if (!isCancelled) {
          setUser(data);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error(error);
        }
      }
    }

    fetchUser();

    return () => {
      isCancelled = true;
    };
  }, [userId]);

  return <div>{user?.name}</div>;
}
```

### 场景2：事件监听器

```jsx
function WindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function handleResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // 初始化

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // 空依赖数组，清理函数会确保正确移除监听器

  return <div>Window size: {size.width} x {size.height}</div>;
}
```

### 场景3：定时器

```jsx
function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []); // 清理函数确保定时器被正确清除

  return <div>Count: {count}</div>;
}
```

### 场景4：DOM 操作

```jsx
function Modal({ isOpen }) {
  useEffect(() => {
    if (!isOpen) return;

    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'modal';
    document.body.appendChild(modal);

    return () => {
      // 清理：移除模态框
      document.body.removeChild(modal);
    };
  }, [isOpen]);

  return null;
}
```

## 最佳实践

### ✅ 推荐做法

1. **保持严格模式**：不要移除 `StrictMode`，它有助于发现潜在问题
2. **编写幂等的副作用**：确保副作用可以安全地多次执行
3. **正确使用清理函数**：始终返回清理函数来撤销副作用
4. **使用 useRef 防止重复**：对于确实只需要执行一次的操作

### ❌ 避免的做法

1. **不要移除 StrictMode**：这会隐藏潜在问题
2. **不要忽略清理函数**：可能导致内存泄漏
3. **不要在副作用中直接修改外部状态**：应该通过状态更新函数

## 常见问题

### Q1: 为什么生产环境也会调用两次？

**A**: 严格模式在生产环境也会启用（如果使用了 `<StrictMode>`）。但如果你移除了 `StrictMode`，生产环境就不会双重调用。

### Q2: 如何判断是否在严格模式下？

**A**: React 没有提供直接的 API 来判断。但你可以通过检查组件是否被调用两次来判断。

```jsx
function MyComponent() {
  console.log('组件渲染'); // 严格模式下会打印两次
  
  useEffect(() => {
    console.log('Effect 执行'); // 严格模式下会打印两次
  }, []);
}
```

### Q3: 双重调用会影响性能吗？

**A**: 
- 在开发环境中，双重调用有助于发现问题，性能影响可以接受
- 在生产环境中，如果移除了 `StrictMode`，不会有双重调用
- 如果保留了 `StrictMode`，双重调用仍然存在，但通常影响很小

### Q4: 所有 Effect 都会被调用两次吗？

**A**: 是的，在严格模式下，所有 `useEffect` 和 `useLayoutEffect` 都会被调用两次。但清理函数也会被调用两次。

## 总结

1. **React 18 严格模式故意双重调用 useEffect**，这是预期行为
2. **不要移除 StrictMode**，它有助于发现潜在问题
3. **使用清理函数**确保副作用可以安全地多次执行
4. **使用 useRef** 如果确实需要只执行一次的操作
5. **编写幂等的副作用**是最佳实践

## 参考资源

- [React 官方文档 - 严格模式](https://react.dev/reference/react/StrictMode)
- [React 18 更新日志](https://react.dev/blog/2022/03/29/react-v18)
- [useEffect 完整指南](https://react.dev/reference/react/useEffect)



