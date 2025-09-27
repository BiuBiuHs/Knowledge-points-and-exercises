# React Suspense 的实现原理（简要）

## 目标与能力

- **数据未就绪时优雅降级**：展示 `fallback`，等数据准备好后再渲染真实 UI。
- **并发友好**：配合 Concurrent Rendering 与 `startTransition/useTransition` 控制优先级与中断恢复。
- **SSR 流式输出/选择性水合**：分块传输，边界就绪即“揭示”，客户端按需水合。

## 核心机制一览

1. 组件在渲染（render）阶段访问数据时，若数据未就绪，会**抛出一个 Promise**（或包含 Promise 的特殊对象）。
2. 渲染树向上查找最近的 `<Suspense fallback={...}>` 边界，该边界会捕获这次“挂起”（suspend）。
3. 边界显示 `fallback`。当 Promise 解决（resolve/reject）后，调度器会**重试**边界内部的渲染。
4. 若启用并发模式（React 18 默认开启并发能力），重试可以被中断、合并，配合 `startTransition` 降低交互抖动。

> 直观理解：Suspense 就像“数据就绪的断点”。未就绪就显示备用内容；就绪后恢复原路线继续渲染。

## 数据加载与“抛 Promise”

常见做法是用一个“资源包装器”在 `read()` 时抛 Promise：

```javascript
// 迷你资源包装器：未就绪 -> 抛 promise；失败 -> 抛 error；就绪 -> 返回数据
function wrap(promise) {
  let status = 'pending';
  let result;
  const suspender = promise.then(
    (v) => { status = 'success'; result = v; },
    (e) => { status = 'error'; result = e; }
  );
  return {
    read() {
      if (status === 'pending') throw suspender;
      if (status === 'error') throw result;
      return result;
    }
  };
}

const userResource = wrap(fetch('/api/user').then(r => r.json()));

function User() {
  const user = userResource.read(); // 未就绪会抛 Promise，被上层 Suspense 捕获
  return <div>{user.name}</div>;
}

export default function App() {
  return (
    <React.Suspense fallback={<span>加载中…</span>}>
      <User />
    </React.Suspense>
  );
}
```

要点：

- 抛出的 Promise 会被调度器记录；当其 settle 后，React 触发相应边界的重渲染。
- 抛 Error 同样可被 Error Boundary 捕获（或向上继续传播）。

## 渲染与调度（Fiber + 并发）

- React 将 UI 拆为 Fiber 单元进行可中断的渲染。遇到挂起：
  - 当前分支标记为“挂起”，向上最近的 Suspense 边界显示 `fallback`。
  - 边界会注册一个重试逻辑，等待 Promise 解决后重新尝试该分支。
- 与 `startTransition` 协作：
  - `startTransition` 内的更新被标记为“过渡”（低优先级），可被用户输入等高优先级更新中断。
  - 当数据就绪再合并渲染，可显著减少“打字-卡顿-抖动”。

```javascript
import { startTransition, useTransition } from 'react';

function SearchBox() {
  const [query, setQuery] = React.useState('');
  const [isPending, start] = useTransition();

  function onChange(e) {
    const next = e.target.value;
    setQuery(next); // 立即更新输入框（高优先级）
    start(() => {
      // 低优先级：触发列表数据拉取与渲染，期间可显示 fallback/骨架
      // setListState(...)
    });
  }

  return (
    <>
      <input value={query} onChange={onChange} />
      {isPending && <span>查询中…</span>}
      <React.Suspense fallback={<div>列表加载中…</div>}>
        {/* <Results query={query} /> */}
      </React.Suspense>
    </>
  );
}
```

## 重试、传播与多个边界

- 同一层可有多个 Suspense。每个边界独立显示/隐藏自己的 `fallback`。
- “级联加载”时，内层边界先就绪会先揭示，不影响外层。
- 可用 `SuspenseList` 控制揭示顺序（如 `revealOrder="forwards"`）。

```jsx
<SuspenseList revealOrder="forwards">
  <Suspense fallback={<Sk1/>}><A/></Suspense>
  <Suspense fallback={<Sk2/>}><B/></Suspense>
  <Suspense fallback={<Sk3/>}><C/></Suspense>
</SuspenseList>
```

## SSR：流式与选择性水合

- 服务器端：将每个 Suspense 边界作为“切片”流式发送，先发 `fallback`，数据就绪后再发真实内容块（“揭示”）。
- 客户端：按需水合（Selective Hydration）。用户交互或网络完成会提升对应边界的水合优先级，缩短可交互时间。

常见形态（以 Node 端为例）：

```javascript
import { renderToPipeableStream } from 'react-dom/server';

function handle(req, res) {
  const { pipe } = renderToPipeableStream(<App/>, {
    bootstrapScripts: ['/client.js'],
    onShellReady() { res.statusCode = 200; pipe(res); },
    onError(err) { console.error(err); }
  });
}
```

## 常见模式

- 资源缓存：对相同请求去重与复用 Promise，防止重复挂起（可结合 `cache`/全局 Map）。
- 骨架屏：`fallback` 使用占位骨架，避免布局抖动。
- 过渡交互：输入/导航包裹在 `startTransition`，感知 `isPending` 做细节提示。

## 限制与注意

- Suspense 只是“数据就绪的控制流”，不负责具体的数据获取与缓存策略。
- 只有在 render 期间读取数据且“未就绪时抛 Promise”才能被 Suspense 捕获。
- 不建议在事件回调里直接抛 Promise；应将读取放到组件渲染路径中。

## 总结

- 本质：在 render 中读取数据 -> 未就绪时“抛 Promise” -> 最近 Suspense 边界捕获并显示 `fallback` -> Promise 解决后重试渲染。
- 价值：配合并发调度与过渡更新，实现更平滑的加载体验和更快的可交互时间；在 SSR 侧实现流式揭示与选择性水合。
