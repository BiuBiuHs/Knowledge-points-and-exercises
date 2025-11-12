# Redux 中间件原理

## 中间件的基本结构

Redux 中间件的标准格式是一个三层柯里化函数：

```javascript
// 中间件是一个三层柯里化函数
const middleware = (store) => (next) => (action) => {
  // store: 第一层参数，接收 store 对象（包含 getState 和 dispatch 方法）
  // next: 第二层参数，接收下一个中间件或原始 dispatch 函数
  // action: 第三层参数，接收要分发的 action 对象
  // 中间件逻辑：在这里可以拦截、修改、记录 action，或执行副作用
  return next(action); // 调用 next 将 action 传递给下一个中间件或原始 dispatch
};
```

- 第一层：接收 `store` 对象（包含 `getState` 和 `dispatch`）
- 第二层：接收 `next` 函数（指向下一个中间件或原始 dispatch）
- 第三层：接收 `action` 对象，执行中间件逻辑

## applyMiddleware 的实现原理

Redux 的 `applyMiddleware` 源码简化版本：

```javascript
// applyMiddleware 是一个高阶函数，接收多个中间件作为参数
function applyMiddleware(...middlewares) {
  // 返回一个 enhancer 函数，接收 createStore 作为参数
  return (createStore) => (reducer, preloadedState) => {
    // 1. 创建原始的 store：先调用原始的 createStore 创建基础 store
    const store = createStore(reducer, preloadedState);
    
    // 2. 保存原始的 dispatch：保存未增强的原始 dispatch 函数
    let dispatch = store.dispatch;
    
    // 3. 准备传递给中间件的 store API：创建一个受限的 store 对象
    const middlewareAPI = {
      getState: store.getState, // 直接引用 store 的 getState 方法
      dispatch: (action) => dispatch(action) // 使用闭包引用最终的 dispatch（此时 dispatch 还未被增强）
    };
    
    // 4. 给每个中间件注入 middlewareAPI，得到第二层函数
    // map 遍历所有中间件，调用每个中间件的第一层函数（传入 middlewareAPI）
    // 此时每个中间件已经可以访问 getState 和 dispatch，返回的是 (next) => (action) => {} 形式的函数
    const chain = middlewares.map(middleware => middleware(middlewareAPI));
    
    // 5. 使用 compose 组合所有中间件，并传入原始 dispatch
    // compose 从右向左组合函数，将 chain 中的函数组合成一个函数链
    // 最后传入 store.dispatch 作为最内层（最右边）的 next 参数
    // 这一步是关键：将 store.dispatch 传递给最后一个中间件
    dispatch = compose(...chain)(store.dispatch);
    
    // 6. 返回增强后的 store：保留原始 store 的所有属性，但用增强后的 dispatch 替换原始 dispatch
    return {
      ...store, // 展开原始 store 的所有属性（getState, subscribe 等）
      dispatch // 返回的是增强后的 dispatch，替换了原始的 dispatch
    };
  };
}
```

## compose 函数的实现

`compose` 函数是实现中间件链式调用的核心：

```javascript
// compose 函数用于组合多个函数，实现函数链式调用
function compose(...funcs) {
  // 如果没有函数，返回一个恒等函数（直接返回参数）
  if (funcs.length === 0) {
    return (arg) => arg; // 返回一个函数，接收 arg 并直接返回 arg
  }

  // 如果只有一个函数，直接返回该函数
  if (funcs.length === 1) {
    return funcs[0]; // 直接返回唯一的函数
  }

  // 关键：从右向左组合函数
  // reduce 的执行顺序：从左到右遍历数组
  // 但组合的结果是从右到左执行
  // 例如：compose(f, g, h) 返回 (...args) => f(g(h(...args)))
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
  // a: 累积的函数（已组合的部分）
  // b: 当前遍历的函数
  // (...args) => a(b(...args)): 返回一个新函数，先执行 b，再将结果传给 a
}
```

## 执行流程详解

假设我们有三个中间件：

```javascript
// logger1 中间件：第一层函数接收 store
const logger1 = (store) => (next) => (action) => {
  // store: 接收 store 对象，可以访问 getState 和 dispatch
  // next: 接收下一个中间件或原始 dispatch 函数
  // action: 接收要分发的 action 对象
  console.log('logger1 开始', action); // 在调用 next 前执行，记录 action
  const result = next(action); // 调用 next，将 action 传递给下一个中间件，并保存返回值
  console.log('logger1 结束'); // 在 next 返回后执行，记录结束
  return result; // 返回 next 的结果，保持链式调用的返回值传递
};

// logger2 中间件：结构与 logger1 相同
const logger2 = (store) => (next) => (action) => {
  // store: 接收 store 对象
  // next: 接收下一个中间件（logger3）或原始 dispatch
  // action: 接收要分发的 action 对象
  console.log('logger2 开始', action); // 在调用 next 前执行
  const result = next(action); // 调用 next，传递给 logger3
  console.log('logger2 结束'); // 在 next 返回后执行
  return result; // 返回结果
};

// logger3 中间件：最后一个中间件
const logger3 = (store) => (next) => (action) => {
  // store: 接收 store 对象
  // next: 接收原始 dispatch 函数（因为它是最后一个中间件）
  // action: 接收要分发的 action 对象
  console.log('logger3 开始', action); // 在调用 next 前执行
  const result = next(action); // 调用原始 dispatch，真正执行 reducer
  console.log('logger3 结束'); // 在 dispatch 返回后执行
  return result; // 返回 dispatch 的结果
};

// 应用中间件：将三个中间件传递给 applyMiddleware
const store = createStore(
  reducer, // reducer 函数，用于更新 state
  applyMiddleware(logger1, logger2, logger3) // 按顺序应用三个中间件
);
```

### 步骤分解

#### 1. 注入 store API

```javascript
// middlewares.map(middleware => middleware(middlewareAPI))
// map 遍历中间件数组，对每个中间件调用第一层函数，传入 middlewareAPI
const chain = [
  logger1(middlewareAPI), // 调用 logger1 的第一层，返回 (next) => (action) => {...} 形式的函数
  logger2(middlewareAPI), // 调用 logger2 的第一层，返回 (next) => (action) => {...} 形式的函数
  logger3(middlewareAPI)  // 调用 logger3 的第一层，返回 (next) => (action) => {...} 形式的函数
];
// chain 数组中的每个元素都是第二层函数，等待接收 next 参数
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
// 从右向左展开：compose 从右向左组合，所以先处理最右边的中间件
// logger3(store.dispatch) 返回：logger3 的第二层函数被调用，传入原始 dispatch 作为 next
const fn3 = (action) => {
  // action: 接收要分发的 action 对象
  console.log('logger3 开始', action); // 执行 logger3 的前置逻辑
  const result = store.dispatch(action); // next 是原始的 dispatch，真正执行 reducer 更新 state
  console.log('logger3 结束'); // 执行 logger3 的后置逻辑
  return result; // 返回 dispatch 的结果
};

// logger2(fn3) 返回：logger2 的第二层函数被调用，传入 fn3 作为 next
const fn2 = (action) => {
  // action: 接收要分发的 action 对象
  console.log('logger2 开始', action); // 执行 logger2 的前置逻辑
  const result = fn3(action); // next 是 logger3 包装后的函数，调用它会触发 logger3 和原始 dispatch
  console.log('logger2 结束'); // 执行 logger2 的后置逻辑
  return result; // 返回 fn3 的结果
};

// logger1(fn2) 返回：logger1 的第二层函数被调用，传入 fn2 作为 next
const fn1 = (action) => {
  // action: 接收要分发的 action 对象
  console.log('logger1 开始', action); // 执行 logger1 的前置逻辑
  const result = fn2(action); // next 是 logger2 包装后的函数，调用它会触发整个链
  console.log('logger1 结束'); // 执行 logger1 的后置逻辑
  return result; // 返回 fn2 的结果
};

// 最终 dispatch = fn1：增强后的 dispatch 就是 fn1，调用它会按顺序执行所有中间件
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
// Redux-Thunk 中间件：允许 dispatch 函数类型的 action
const thunk = (store) => (next) => (action) => {
  // store: 接收 store 对象，包含 getState 和 dispatch 方法
  // next: 接收下一个中间件或原始 dispatch 函数
  // action: 接收要分发的 action（可能是对象或函数）
  
  // 如果 action 是函数，调用它并传入 dispatch 和 getState
  // 这样可以在 action creator 中执行异步操作或条件分发
  if (typeof action === 'function') {
    return action(store.dispatch, store.getState); // 调用函数 action，传入 dispatch 和 getState，返回函数的结果
  }
  
  // 否则传递给下一个中间件：如果 action 是普通对象，正常传递给下一个中间件
  return next(action); // 调用 next，将 action 传递给下一个中间件
};
```

### Redux-Logger 中间件

```javascript
// Redux-Logger 中间件：记录每次 dispatch 的 action 和 state 变化
const logger = (store) => (next) => (action) => {
  // store: 接收 store 对象，可以访问 getState 方法
  // next: 接收下一个中间件或原始 dispatch 函数
  // action: 接收要分发的 action 对象
  
  console.log('dispatching', action); // 记录正在分发的 action
  console.log('prev state', store.getState()); // 记录分发前的 state（通过 store.getState() 获取）
  
  const result = next(action); // 调用 next，将 action 传递给下一个中间件，执行 reducer 更新 state
  
  console.log('next state', store.getState()); // 记录分发后的 state（state 已更新）
  return result; // 返回 next 的结果
};
```

### 异步中间件示例

```javascript
// 异步中间件示例：处理异步 action，自动管理 loading、success、error 状态
const asyncMiddleware = (store) => (next) => (action) => {
  // store: 接收 store 对象，可以访问 dispatch 和 getState 方法
  // next: 接收下一个中间件或原始 dispatch 函数
  // action: 接收要分发的 action 对象
  
  // 拦截特定的异步 action：检查 action 类型是否为 FETCH_DATA
  if (action.type === 'FETCH_DATA') {
    // 先 dispatch 一个 loading action：通知应用开始加载数据
    store.dispatch({ type: 'FETCH_DATA_START' }); // 使用 store.dispatch 分发新的 action（会经过所有中间件）
    
    // 执行异步操作：发起网络请求
    fetch(action.url) // 使用 action.url 作为请求地址
      .then(response => response.json()) // 将响应转换为 JSON
      .then(data => {
        // 请求成功：分发成功 action，携带数据
        store.dispatch({ type: 'FETCH_DATA_SUCCESS', payload: data }); // 分发成功 action
      })
      .catch(error => {
        // 请求失败：分发错误 action，携带错误信息
        store.dispatch({ type: 'FETCH_DATA_ERROR', error }); // 分发错误 action
      });
    
    return; // 不继续传递原始 action：因为已经处理了，不需要传递给 reducer
  }
  
  // 其他 action 正常传递：如果不是 FETCH_DATA 类型，正常传递给下一个中间件
  return next(action); // 调用 next，将 action 传递给下一个中间件
};
```

## 手动实现完整示例

```javascript
// 完整的示例代码：实现一个简化版的 Redux

// createStore 函数：创建 Redux store
function createStore(reducer, enhancer) {
  // 如果有 enhancer（如 applyMiddleware），先应用它
  // enhancer 是一个高阶函数，接收 createStore 并返回增强后的 createStore
  if (enhancer) {
    return enhancer(createStore)(reducer); // 调用 enhancer，传入 createStore 和 reducer
  }
  
  let state; // 存储应用的 state
  let listeners = []; // 存储所有订阅的监听器函数
  
  // getState：获取当前 state
  const getState = () => state; // 返回当前的 state
  
  // dispatch：分发 action，更新 state
  const dispatch = (action) => {
    state = reducer(state, action); // 调用 reducer，传入当前 state 和 action，得到新的 state
    listeners.forEach(listener => listener()); // 通知所有监听器 state 已更新
    return action; // 返回 action（符合 Redux 规范）
  };
  
  // subscribe：订阅 state 变化
  const subscribe = (listener) => {
    listeners.push(listener); // 将监听器添加到 listeners 数组
    return () => {
      // 返回取消订阅的函数
      listeners = listeners.filter(l => l !== listener); // 从 listeners 中移除该监听器
    };
  };
  
  // 初始化 state：分发一个特殊的 action，让 reducer 返回初始 state
  dispatch({ type: '@@INIT' }); // 使用特殊的 action type，触发 reducer 的默认分支
  
  // 返回 store 对象：包含 getState、dispatch、subscribe 三个方法
  return { getState, dispatch, subscribe };
}

// compose 函数：组合多个函数，实现函数链式调用
function compose(...funcs) {
  // 如果没有函数，返回恒等函数
  if (funcs.length === 0) return (arg) => arg; // 返回一个直接返回参数的函数
  // 如果只有一个函数，直接返回
  if (funcs.length === 1) return funcs[0]; // 返回唯一的函数
  // 从右向左组合函数：compose(f, g, h) => (...args) => f(g(h(...args)))
  return funcs.reduce((a, b) => (...args) => a(b(...args))); // 使用 reduce 组合函数
}

// applyMiddleware 函数：应用中间件增强 store
function applyMiddleware(...middlewares) {
  // 返回 enhancer 函数：接收 createStore 作为参数
  return (createStore) => (reducer) => {
    // 创建原始 store：先调用原始的 createStore
    const store = createStore(reducer);
    // 保存原始 dispatch：用于传递给最后一个中间件
    let dispatch = store.dispatch;
    
    // 创建 middlewareAPI：提供给中间件的受限 store API
    const middlewareAPI = {
      getState: store.getState, // 直接引用 store 的 getState
      dispatch: (action) => dispatch(action) // 使用闭包引用最终的 dispatch（此时还未增强）
    };
    
    // 创建中间件链：对每个中间件调用第一层函数，传入 middlewareAPI
    const chain = middlewares.map(middleware => middleware(middlewareAPI));
    // 组合中间件：使用 compose 从右向左组合，传入原始 dispatch 作为最内层的 next
    dispatch = compose(...chain)(store.dispatch);
    
    // 返回增强后的 store：保留原始 store 的属性，但用增强后的 dispatch 替换
    return { ...store, dispatch }; // 展开 store 的所有属性，覆盖 dispatch
  };
}

// 使用示例

// reducer：定义 state 的更新逻辑
const reducer = (state = { count: 0 }, action) => {
  // state: 当前 state，默认值为 { count: 0 }
  // action: 分发的 action 对象
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 }; // 返回新的 state，count 加 1
    default:
      return state; // 默认返回当前 state
  }
};

// logger 中间件：记录每次 dispatch
const logger = (store) => (next) => (action) => {
  // store: 接收 store 对象
  // next: 接收下一个中间件或原始 dispatch
  // action: 接收要分发的 action
  console.log('dispatch:', action); // 记录 action
  const result = next(action); // 调用 next，执行 reducer
  console.log('new state:', store.getState()); // 记录更新后的 state
  return result; // 返回结果
};

// 创建 store：使用 applyMiddleware 应用 logger 中间件
const store = createStore(reducer, applyMiddleware(logger));
// 分发 action：触发 reducer 更新 state，经过 logger 中间件记录
store.dispatch({ type: 'INCREMENT' });
```

## 总结

1. **原始 dispatch 传递**：通过 `compose` 函数的从右向左组合，最后一个中间件的 `next` 就是原始的 `store.dispatch`

2. **顺序执行**：中间件采用洋葱模型，调用 `next()` 前的代码从左到右执行，`next()` 后的代码从右到左执行

3. **闭包机制**：每个中间件通过闭包保持对 `next` 的引用，形成调用链

4. **函数式编程**：利用柯里化和函数组合，优雅地实现了中间件机制
