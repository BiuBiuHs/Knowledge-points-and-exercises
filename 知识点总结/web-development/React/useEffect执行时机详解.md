# React useEffect 执行时机详解

## 核心概念

`useEffect` 是 React 中用于处理副作用（side effects）的 Hook，它的执行时机是理解 React 函数组件生命周期的关键。

### 基本语法

```javascript
useEffect(() => {
  // 副作用代码
  
  return () => {
    // 清理函数（可选）
  };
}, [dependencies]);  // 依赖项数组
```

## 1. 执行时机总览

### 关键时间点

```
组件渲染流程：
1. 执行函数组件体 → 计算 JSX
2. React 更新 DOM
3. 浏览器绘制页面（用户可见）
4. 执行 useEffect 回调 ← useEffect 在这里执行
```

**核心记忆：useEffect 在浏览器完成绘制之后异步执行**

## 2. 详细执行时机

### 完整的生命周期流程

```
┌─────────────────────────────────────────────────────┐
│ 1. 组件函数执行（render）                              │
│    - 计算 state、props                               │
│    - 执行组件函数体                                   │
│    - 返回 JSX                                        │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ 2. React 协调（Reconciliation）                      │
│    - 对比新旧虚拟 DOM                                │
│    - 计算需要更新的部分                               │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ 3. React 提交（Commit）                              │
│    - 更新真实 DOM                                    │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ 4. 浏览器绘制（Paint）                                │
│    - 浏览器渲染页面                                   │
│    - 用户可以看到变化                                 │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ 5. useEffect 执行（异步，不阻塞渲染）                  │
│    - 执行上一次的清理函数（如果有）                     │
│    - 执行当前的 effect 回调                          │
└─────────────────────────────────────────────────────┘
```

### 时间轴示例

```javascript
function MyComponent() {
  console.log('1. 组件渲染');
  
  useEffect(() => {
    console.log('4. useEffect 执行');
    
    return () => {
      console.log('清理函数（下次 effect 执行前或组件卸载时）');
    };
  });
  
  console.log('2. 组件渲染完成，返回 JSX');
  
  return <div>Hello</div>;
}

// 输出顺序：
// 1. 组件渲染
// 2. 组件渲染完成，返回 JSX
// 3. （DOM 更新）
// 4. useEffect 执行
```

## 3. 不同依赖项的执行时机

### 情况1：无依赖项数组（每次渲染都执行）

```javascript
useEffect(() => {
  console.log('每次渲染后都执行');
});

// 执行时机：
// - 组件首次挂载后
// - 每次组件更新后
// - 总是在浏览器绘制后执行
```

**示例：**

```javascript
function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    console.log(`Count 变化了: ${count}`);
    // 每次 count 变化都会执行
  });  // ⚠️ 没有依赖项数组
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}

// 点击按钮时的执行顺序：
// 1. setCount 触发重新渲染
// 2. 组件函数执行，count = 1
// 3. DOM 更新
// 4. 浏览器绘制
// 5. useEffect 执行，输出 "Count 变化了: 1"
```

### 情况2：空依赖项数组（仅首次执行）

```javascript
useEffect(() => {
  console.log('仅在组件挂载后执行一次');
  
  return () => {
    console.log('仅在组件卸载时执行');
  };
}, []);  // ← 空数组

// 执行时机：
// - 组件首次挂载后执行一次
// - 清理函数在组件卸载时执行
// - 类似于 componentDidMount + componentWillUnmount
```

**示例：**

```javascript
function DataFetcher() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    console.log('组件挂载，开始获取数据');
    
    fetch('/api/data')
      .then(res => res.json())
      .then(data => setData(data));
    
    return () => {
      console.log('组件卸载，清理工作');
    };
  }, []);  // ← 空依赖项，只执行一次
  
  return <div>{data ? JSON.stringify(data) : 'Loading...'}</div>;
}
```

### 情况3：有依赖项（依赖项变化时执行）

```javascript
useEffect(() => {
  console.log('当 dep1 或 dep2 变化时执行');
}, [dep1, dep2]);  // ← 有依赖项

// 执行时机：
// - 组件首次挂载后
// - dep1 或 dep2 变化后
// - 不变化则不执行
```

**示例：**

```javascript
function SearchComponent() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    console.log(`搜索关键词变化: ${keyword}`);
    
    if (keyword) {
      fetch(`/api/search?q=${keyword}`)
        .then(res => res.json())
        .then(data => setResults(data));
    }
  }, [keyword]);  // ← 仅当 keyword 变化时执行
  
  return (
    <div>
      <input 
        value={keyword} 
        onChange={e => setKeyword(e.target.value)} 
      />
      <ul>
        {results.map(item => <li key={item.id}>{item.name}</li>)}
      </ul>
    </div>
  );
}
```

## 4. 执行顺序对比

### 多个 useEffect 的执行顺序

```javascript
function MultiEffectComponent() {
  console.log('1. 组件渲染');
  
  useEffect(() => {
    console.log('4. Effect 1 执行');
  });
  
  useEffect(() => {
    console.log('5. Effect 2 执行');
  });
  
  useEffect(() => {
    console.log('6. Effect 3 执行');
  });
  
  console.log('2. 组件渲染完成');
  
  return <div>3. JSX 返回</div>;
}

// 输出顺序：
// 1. 组件渲染
// 2. 组件渲染完成
// 3. JSX 返回（实际不输出，DOM 更新）
// 4. Effect 1 执行
// 5. Effect 2 执行
// 6. Effect 3 执行

// ✅ useEffect 按照定义顺序依次执行
```

### 父子组件的执行顺序

```javascript
function Parent() {
  console.log('1. Parent 渲染');
  
  useEffect(() => {
    console.log('5. Parent effect');
  });
  
  return <Child />;
}

function Child() {
  console.log('2. Child 渲染');
  
  useEffect(() => {
    console.log('4. Child effect');
  });
  
  return <div>Child</div>;
}

// 输出顺序：
// 1. Parent 渲染
// 2. Child 渲染
// 3. （DOM 更新：先子后父）
// 4. Child effect（子组件的 effect 先执行）
// 5. Parent effect（父组件的 effect 后执行）

// ✅ 渲染顺序：从父到子
// ✅ Effect 执行顺序：从子到父
```

## 5. useEffect vs useLayoutEffect

### 执行时机对比

```
useEffect（异步，不阻塞渲染）:
  渲染 → DOM 更新 → 浏览器绘制 → useEffect 执行
                    ↑ 用户可见
  
useLayoutEffect（同步，阻塞渲染）:
  渲染 → DOM 更新 → useLayoutEffect 执行 → 浏览器绘制
                                          ↑ 用户可见
```

**示例对比：**

```javascript
// useEffect - 可能会看到闪烁
function WithUseEffect() {
  const [position, setPosition] = useState(0);
  
  useEffect(() => {
    // 这里修改 DOM 可能会看到闪烁
    // 因为浏览器已经绘制了一次
    setPosition(100);
  }, []);
  
  return <div style={{ left: position }}>Box</div>;
  // 执行流程：
  // 1. 渲染 position=0
  // 2. DOM 更新为 left: 0
  // 3. 浏览器绘制（用户看到 left: 0）← 闪烁！
  // 4. useEffect 执行，setPosition(100)
  // 5. 重新渲染，left: 100
}

// useLayoutEffect - 不会闪烁
function WithUseLayoutEffect() {
  const [position, setPosition] = useState(0);
  
  useLayoutEffect(() => {
    // 在浏览器绘制前执行
    setPosition(100);
  }, []);
  
  return <div style={{ left: position }}>Box</div>;
  // 执行流程：
  // 1. 渲染 position=0
  // 2. DOM 更新为 left: 0
  // 3. useLayoutEffect 执行，setPosition(100)
  // 4. 重新渲染，left: 100
  // 5. 浏览器绘制（用户直接看到 left: 100）← 无闪烁！
}
```

**使用建议：**

- ✅ 大多数情况用 `useEffect`（不阻塞渲染，性能更好）
- ✅ 需要同步修改 DOM 避免闪烁时用 `useLayoutEffect`
- ✅ 测量 DOM 尺寸/位置时用 `useLayoutEffect`

## 6. 清理函数的执行时机

### 清理函数何时执行？

```javascript
useEffect(() => {
  console.log('Effect 执行');
  
  return () => {
    console.log('清理函数执行');
  };
}, [dep]);
```

**执行时机：**

1. **组件卸载时**
2. **依赖项变化，重新执行 effect 之前**
3. **不是在每次渲染后都执行，只在需要清理时执行**

### 详细示例

```javascript
function Timer() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    console.log(`设置定时器，count = ${count}`);
    
    const timer = setInterval(() => {
      console.log('定时器触发');
      setCount(c => c + 1);
    }, 1000);
    
    return () => {
      console.log(`清理定时器，count = ${count}`);
      clearInterval(timer);
    };
  }, [count]);  // count 变化时重新执行
  
  return <div>Count: {count}</div>;
}

// 执行流程：
// 首次渲染：
//   1. 组件渲染，count = 0
//   2. "设置定时器，count = 0"
//
// 1秒后，定时器触发：
//   1. setCount，count = 1
//   2. 组件重新渲染
//   3. "清理定时器，count = 0" ← 执行旧的清理函数
//   4. "设置定时器，count = 1" ← 执行新的 effect
//
// 组件卸载：
//   1. "清理定时器，count = N"
```

### 清理函数的常见用途

```javascript
// 1. 清理定时器
useEffect(() => {
  const timer = setTimeout(() => {}, 1000);
  return () => clearTimeout(timer);
}, []);

// 2. 取消订阅
useEffect(() => {
  const subscription = eventEmitter.subscribe(event => {});
  return () => subscription.unsubscribe();
}, []);

// 3. 取消网络请求
useEffect(() => {
  const controller = new AbortController();
  
  fetch('/api/data', { signal: controller.signal })
    .then(res => res.json())
    .then(setData);
  
  return () => controller.abort();  // 组件卸载时取消请求
}, []);

// 4. 移除事件监听
useEffect(() => {
  const handleResize = () => {};
  window.addEventListener('resize', handleResize);
  
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

## 7. 常见陷阱与误区

### 误区1：以为 useEffect 在渲染期间执行

```javascript
// ❌ 错误理解
function BadComponent() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    setData('loaded');  // 这不会阻塞首次渲染
  }, []);
  
  // 首次渲染时 data 仍然是 null
  return <div>{data || 'Loading...'}</div>;
}

// ✅ 正确理解
// 1. 首次渲染：data = null，显示 "Loading..."
// 2. DOM 更新，浏览器绘制
// 3. useEffect 执行，setData('loaded')
// 4. 第二次渲染：data = 'loaded'，显示 "loaded"
```

### 误区2：在 useEffect 中直接修改 state 导致无限循环

```javascript
// ❌ 错误：无限循环
function BadComponent() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    setCount(count + 1);  // 没有依赖项数组，每次渲染都执行
  });  // ← 危险！
  
  // 无限循环：
  // 渲染 → useEffect 执行 → setCount → 重新渲染 → useEffect 执行 → ...
}

// ✅ 正确：添加依赖项或条件
function GoodComponent() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (count < 10) {
      setCount(count + 1);
    }
  }, [count]);  // ← 有依赖项，且有退出条件
}
```

### 误区3：依赖项不完整

```javascript
// ❌ 错误：缺少依赖项
function BadComponent() {
  const [count, setCount] = useState(0);
  const [multiplier, setMultiplier] = useState(2);
  
  useEffect(() => {
    console.log(count * multiplier);
  }, [count]);  // ← 缺少 multiplier
  
  // multiplier 变化时不会重新执行
}

// ✅ 正确：包含所有依赖
function GoodComponent() {
  const [count, setCount] = useState(0);
  const [multiplier, setMultiplier] = useState(2);
  
  useEffect(() => {
    console.log(count * multiplier);
  }, [count, multiplier]);  // ← 完整的依赖项
}

// 💡 使用 ESLint 插件 eslint-plugin-react-hooks 自动检查
```

### 误区4：过度使用 useEffect

```javascript
// ❌ 不需要 useEffect 的场景
function BadComponent({ price, quantity }) {
  const [total, setTotal] = useState(0);
  
  useEffect(() => {
    setTotal(price * quantity);  // 多余的 effect
  }, [price, quantity]);
  
  return <div>Total: {total}</div>;
}

// ✅ 直接计算即可
function GoodComponent({ price, quantity }) {
  const total = price * quantity;  // 直接计算，不需要 effect
  
  return <div>Total: {total}</div>;
}
```

## 8. 实际应用场景

### 场景1：数据获取

```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });
  }, [userId]);  // userId 变化时重新获取
  
  if (loading) return <div>Loading...</div>;
  return <div>{user.name}</div>;
}
```

### 场景2：订阅外部数据源

```javascript
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    // 订阅消息
    const unsubscribe = chatAPI.subscribe(roomId, message => {
      setMessages(msgs => [...msgs, message]);
    });
    
    // 清理：取消订阅
    return () => unsubscribe();
  }, [roomId]);  // roomId 变化时重新订阅
  
  return (
    <ul>
      {messages.map(msg => <li key={msg.id}>{msg.text}</li>)}
    </ul>
  );
}
```

### 场景3：DOM 操作

```javascript
function AutoFocusInput() {
  const inputRef = useRef(null);
  
  useEffect(() => {
    // DOM 渲染完成后聚焦
    inputRef.current?.focus();
  }, []);  // 仅首次挂载后执行
  
  return <input ref={inputRef} />;
}
```

### 场景4：同步到外部系统

```javascript
function DocumentTitle({ title }) {
  useEffect(() => {
    // 同步到浏览器标题
    document.title = title;
  }, [title]);  // title 变化时更新
  
  return <div>Page content</div>;
}
```

## 9. 性能优化

### 避免不必要的 effect 执行

```javascript
// ❌ 不好：对象/数组依赖每次都是新的
function BadComponent({ config }) {
  useEffect(() => {
    doSomething(config);
  }, [config]);  // config 是对象，每次渲染都是新的引用
  
  // 即使 config 内容没变，effect 也会执行
}

// ✅ 好：使用 useMemo 缓存
function GoodComponent({ config }) {
  const memoizedConfig = useMemo(() => config, [
    config.key1,
    config.key2
  ]);
  
  useEffect(() => {
    doSomething(memoizedConfig);
  }, [memoizedConfig]);
}

// ✅ 更好：只依赖具体的值
function BetterComponent({ config }) {
  useEffect(() => {
    doSomething(config);
  }, [config.key1, config.key2]);  // 只依赖需要的属性
}
```

## 10. 调试技巧

### 使用 console.log 追踪执行

```javascript
function DebugComponent({ prop1, prop2 }) {
  console.log('🔵 组件渲染', { prop1, prop2 });
  
  useEffect(() => {
    console.log('🟢 Effect 执行', { prop1, prop2 });
    
    return () => {
      console.log('🔴 清理函数执行', { prop1, prop2 });
    };
  }, [prop1, prop2]);
  
  console.log('🔵 组件渲染完成');
  
  return <div>Debug Component</div>;
}

// 通过日志颜色和内容了解执行流程
```

### 使用 React DevTools Profiler

```javascript
// 在 React DevTools 中可以看到：
// - 组件渲染次数
// - 渲染原因
// - Effect 执行次数
```

## 11. 总结

### 核心要点

1. **执行时机**：
   - ✅ useEffect 在浏览器绘制**之后**异步执行
   - ✅ 不阻塞页面渲染
   - ✅ 用户先看到页面，后执行副作用

2. **依赖项数组**：
   - 无依赖项：每次渲染后执行
   - 空数组 `[]`：仅首次挂载后执行
   - 有依赖 `[dep]`：依赖变化时执行

3. **清理函数**：
   - 依赖项变化时，先执行清理，再执行新 effect
   - 组件卸载时执行清理

4. **执行顺序**：
   - 多个 effect：按定义顺序执行
   - 父子组件：子组件 effect 先执行

5. **最佳实践**：
   - 使用 ESLint 插件检查依赖项
   - 避免在 effect 中直接修改 state 导致无限循环
   - 不是所有逻辑都需要 effect，能直接计算就不用 effect
   - 需要同步 DOM 操作用 useLayoutEffect

### 快速参考

| 场景 | 依赖项 | 执行时机 |
|------|--------|---------|
| 每次渲染后 | 无 | 每次组件更新后 |
| 仅挂载时 | `[]` | 组件挂载后一次 |
| 特定值变化 | `[dep]` | dep 变化时 |
| DOM 操作 | 视情况 | 首次或依赖变化 |
| 订阅/定时器 | 视情况 | 需要清理函数 |

### 记忆口诀

```
渲染 DOM 先，Effect 后
依赖变化才执行
清理先行新再来
子先父后要记牢
```

---

**相关文档：**

- [React Hooks 官方文档](https://react.dev/reference/react/useEffect)
- [useLayoutEffect 详解](https://react.dev/reference/react/useLayoutEffect)
- [React 生命周期对照表](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)
