# useState 的最简版：它是 useReducer 的语法糖

## 一句话结论

`useState(init) ≈ useReducer((s, a) => (typeof a === 'function' ? a(s) : a), init)`

## 最小实现（概念演示）

```javascript
// 这里不实现完整渲染系统，只展示等价关系的最小代码
function useReducer(reducer, initialArg) {
  let state = typeof initialArg === 'function' ? initialArg() : initialArg;
  const dispatch = (action) => { state = reducer(state, action); };
  // 返回一个读取函数以便在没有渲染系统时观察状态变化
  return [() => state, dispatch];
}

const baseReducer = (prev, action) => (
  typeof action === 'function' ? action(prev) : action
);

const useState = (initialArg) => useReducer(baseReducer, initialArg);
```

## 用法（仅用于观察）

```javascript
const [getCount, setCount] = useState(0);
setCount(1);            // 设为 1
setCount((c) => c + 1); // 函数式更新 -> 2
console.log(getCount());
```

## 要点

- `setState(value)` 直接把状态设为 `value`。
- `setState(fn)` 使用 `fn(prev)` 计算新状态（函数式更新）。
- 惰性初始化：`useState(() => initValue)` 时，初次会调用函数求初始值。
