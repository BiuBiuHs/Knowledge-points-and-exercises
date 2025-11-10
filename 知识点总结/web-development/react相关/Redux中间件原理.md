# Redux 中间件原理

## 中间件的基本结构

Redux 中间件的标准格式是一个三层柯里化函数：

```javascript
const middleware = (store) => (next) => (action) => {
  // 中间件逻辑
  return next(action);
};
```

- 第一层：接收 `store` 对象（包含 `getState` 和 `dispatch`）
- 第二层：接收 `next` 函数（指向下一个中间件或原始 dispatch）
- 第三层：接收 `action` 对象，执行中间件逻辑

## applyMiddleware 的实现原理

Redux 的 `applyMiddleware` 源码简化版本：

```javascript
function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, preloadedState) => {
    // 1. 创建原始的 store
    const store = createStore(reducer, preloadedState);
    
    // 2. 保存原始的 dispatch
    let dispatch = store.dispatch;
    
    // 3. 准备传递给中间件的 store API
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action) // 这里使用闭包引用最终的 dispatch
    };
    
    // 4. 给每个中间件注入 middlewareAPI，得到第二层函数
    // 此时每个中间件已经可以访问 getState 和 dispatch
    const chain = middlewares.map(middleware => middleware(middlewareAPI));
    
    // 5. 使用 compose 组合所有中间件，并传入原始 dispatch
    // 这一步是关键：将 store.dispatch 传递给最后一个中间件
    dispatch = compose(...chain)(store.dispatch);
    
    // 6. 返回增强后的 store
    return {
      ...store,
      dispatch // 返回的是增强后的 dispatch
    };
  };
}
```

## compose 函数的实现

`compose` 函数是实现中间件链式调用的核心：

```javascript
function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  // 关键：从右向左组合函数
  // reduce 的执行顺序：从左到右遍历数组
  // 但组合的结果是从右到左执行
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}
```

## 执行流程详解

假设我们有三个中间件：

```javascript
const logger1 = (store) => (next) => (action) => {
  console.log('logger1 开始', action);
  const result = next(action);
  console.log('logger1 结束');
  return result;
};

const logger2 = (store) => (next) => (action) => {
  console.log('logger2 开始', action);
  const result = next(action);
  console.log('logger2 结束');
  return result;
};

const logger3 = (store) => (next) => (action) => {
  console.log('logger3 开始', action);
  const result = next(action);
  console.log('logger3 结束');
  return result;
};

// 应用中间件
const store = createStore(
  reducer,
  applyMiddleware(logger1, logger2, logger3)
);
```

### 步骤分解

#### 1. 注入 store API

```javascript
// middlewares.map(middleware => middleware(middlewareAPI))
const chain = [
  logger1(middlewareAPI), // (next) => (action) => {...}
  logger2(middlewareAPI), // (next) => (action) => {...}
  logger3(middlewareAPI)  // (next) => (action) => {...}
];
```

#### 2. compose 组合过程

```javascript
// compose(logger1, logger2, logger3)(store.dispatch)

// compose 内部 reduce 的执行：
// 第一次：a = logger1, b = logger2
//   返回：(...args) => logger1(logger2(...args))
// 第二次：a = logger1(logger2(...args)), b = logger3
//   返回：(...args) => logger1(logger2(logger3(...args)))

// 最终结果等同于：
dispatch = logger1(logger2(logger3(store.dispatch)));
```

#### 3. 展开后的实际结构

```javascript
// 从右向左展开：
// logger3(store.dispatch) 返回：
const fn3 = (action) => {
  console.log('logger3 开始', action);
  const result = store.dispatch(action); // next 是原始的 dispatch
  console.log('logger3 结束');
  return result;
};

// logger2(fn3) 返回：
const fn2 = (action) => {
  console.log('logger2 开始', action);
  const result = fn3(action); // next 是 logger3 包装后的函数
  console.log('logger2 结束');
  return result;
};

// logger1(fn2) 返回：
const fn1 = (action) => {
  console.log('logger1 开始', action);
  const result = fn2(action); // next 是 logger2 包装后的函数
  console.log('logger1 结束');
  return result;
};

// 最终 dispatch = fn1
```

#### 4. 调用 dispatch 时的执行顺序

```javascript
store.dispatch({ type: 'TEST' });

// 输出顺序：
// logger1 开始 { type: 'TEST' }
// logger2 开始 { type: 'TEST' }
// logger3 开始 { type: 'TEST' }
// [真正的 reducer 执行，state 更新]
// logger3 结束
// logger2 结束
// logger1 结束
```

## 关键点总结

### 1. 原始 dispatch 如何传递给最后一个中间件？

通过 `compose(...chain)(store.dispatch)`，compose 函数从右向左组合，所以：

- 最右边的中间件（logger3）接收到的 `next` 是 `store.dispatch`
- 中间的中间件（logger2）接收到的 `next` 是 logger3 包装后的函数
- 最左边的中间件（logger1）接收到的 `next` 是 logger2 包装后的函数

### 2. 中间件如何按顺序执行？

执行顺序分为两个阶段：

**洋葱模型**：

```
dispatch(action)
    ↓
[logger1 开始] → next() → [logger1 结束]
                  ↓
        [logger2 开始] → next() → [logger2 结束]
                          ↓
                [logger3 开始] → next() → [logger3 结束]
                                  ↓
                            [store.dispatch]
```

- **进入阶段**（从左到右）：logger1 → logger2 → logger3 → 原始 dispatch
- **返回阶段**（从右到左）：原始 dispatch → logger3 → logger2 → logger1

### 3. 为什么要用三层柯里化？

```javascript
const middleware = (store) => (next) => (action) => {}
```

- **第一层 `store`**：在中间件初始化时注入，可以访问 `getState` 和完整的 `dispatch`
- **第二层 `next`**：在 compose 组合时注入，指向下一个中间件或原始 dispatch
- **第三层 `action`**：实际调用时传入，处理具体的 action

## 实际应用示例

### Redux-Thunk 中间件

```javascript
const thunk = (store) => (next) => (action) => {
  // 如果 action 是函数，调用它并传入 dispatch 和 getState
  if (typeof action === 'function') {
    return action(store.dispatch, store.getState);
  }
  
  // 否则传递给下一个中间件
  return next(action);
};
```

### Redux-Logger 中间件

```javascript
const logger = (store) => (next) => (action) => {
  console.log('dispatching', action);
  console.log('prev state', store.getState());
  
  const result = next(action);
  
  console.log('next state', store.getState());
  return result;
};
```

### 异步中间件示例

```javascript
const asyncMiddleware = (store) => (next) => (action) => {
  // 拦截特定的异步 action
  if (action.type === 'FETCH_DATA') {
    // 先 dispatch 一个 loading action
    store.dispatch({ type: 'FETCH_DATA_START' });
    
    // 执行异步操作
    fetch(action.url)
      .then(response => response.json())
      .then(data => {
        store.dispatch({ type: 'FETCH_DATA_SUCCESS', payload: data });
      })
      .catch(error => {
        store.dispatch({ type: 'FETCH_DATA_ERROR', error });
      });
    
    return; // 不继续传递原始 action
  }
  
  // 其他 action 正常传递
  return next(action);
};
```

## 手动实现完整示例

```javascript
// 完整的示例代码
function createStore(reducer, enhancer) {
  // 如果有 enhancer（如 applyMiddleware），先应用它
  if (enhancer) {
    return enhancer(createStore)(reducer);
  }
  
  let state;
  let listeners = [];
  
  const getState = () => state;
  
  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
    return action;
  };
  
  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  };
  
  // 初始化 state
  dispatch({ type: '@@INIT' });
  
  return { getState, dispatch, subscribe };
}

function compose(...funcs) {
  if (funcs.length === 0) return (arg) => arg;
  if (funcs.length === 1) return funcs[0];
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}

function applyMiddleware(...middlewares) {
  return (createStore) => (reducer) => {
    const store = createStore(reducer);
    let dispatch = store.dispatch;
    
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action)
    };
    
    const chain = middlewares.map(middleware => middleware(middlewareAPI));
    dispatch = compose(...chain)(store.dispatch);
    
    return { ...store, dispatch };
  };
}

// 使用示例
const reducer = (state = { count: 0 }, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    default:
      return state;
  }
};

const logger = (store) => (next) => (action) => {
  console.log('dispatch:', action);
  const result = next(action);
  console.log('new state:', store.getState());
  return result;
};

const store = createStore(reducer, applyMiddleware(logger));
store.dispatch({ type: 'INCREMENT' });
```

## 总结

1. **原始 dispatch 传递**：通过 `compose` 函数的从右向左组合，最后一个中间件的 `next` 就是原始的 `store.dispatch`

2. **顺序执行**：中间件采用洋葱模型，调用 `next()` 前的代码从左到右执行，`next()` 后的代码从右到左执行

3. **闭包机制**：每个中间件通过闭包保持对 `next` 的引用，形成调用链

4. **函数式编程**：利用柯里化和函数组合，优雅地实现了中间件机制
