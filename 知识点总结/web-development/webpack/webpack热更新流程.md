# Webpack 热更新（HMR）流程详解

以下描述基于典型的 `webpack-dev-server`（WDS）与 HMR 插件的组合。当你在开发过程中修改某个模块文件，Webpack 的热更新会经历一条清晰的链路。

## 1. 文件变更与重新编译
- **文件监视**：Webpack 通过 `chokidar` 等文件系统监听器捕获到源码文件的修改。
- **重新编译受影响模块**：Webpack 触发增量编译，仅对发生变动的模块及其依赖图进行重新构建，生成新的编译结果（包含新的模块哈希和依赖关系）。
- **生成 Hot Update Artifacts**：编译阶段除了常规的 bundle 之外，还会生成专门用于热更新的补丁文件：
  - `*.hot-update.json`：描述哪些 chunk 发生变化以及新的哈希值。
  - `*.hot-update.js`：包含更新后的模块代码。

## 2. 通知浏览器（WDS 与 HMR 通道）
- **Dev Server 推送消息**：`webpack-dev-server` 使用 WebSocket（早期可选 SSE）与浏览器保持长连接。
- **发送更新信号**：增量编译完成后，Dev Server 通过该连接向浏览器推送一条消息，内容包含需要更新的模块或 chunk 的哈希。

## 3. 浏览器端接收并拉取补丁
- **HMR Runtime 监听消息**：在开发时，Webpack 会把一段运行时代码（`webpack/hot/dev-server` 等）注入到 bundle 中，负责处理与 Dev Server 的通信。
- **请求 Hot Update 文件**：Runtime 收到新的哈希后，会发起 HTTP 请求拉取对应的 `*.hot-update.json` 和 `*.hot-update.js`。
- **更新模块缓存**：补丁文件加载完成后，Webpack Runtime 会将更新后的模块代码替换到模块缓存（`__webpack_require__.c`）中。

## 4. 模块热替换逻辑
- **调用 `module.hot.accept` 回调**：
  - 如果变更的模块（或其上游）注册了 `module.hot.accept`，Webpack Runtime 会执行指定的回调函数，实现局部刷新。
  - 回调内部通常会重新执行渲染逻辑、触发状态更新等。
- **向上冒泡**：
  - 若当前模块未处理热替换请求，Runtime 会沿着依赖图继续向父级模块冒泡，查找可以接受更新的模块。
- **回退策略**：
  - 如果一路冒泡到入口文件仍无人接受更新，Runtime 会退化为整页刷新（触发 `window.location.reload()`）。

## 5. 状态保持与副作用处理
- **React/Vue 等框架集成**：框架层通常提供对应的 HMR 适配逻辑（如 React Refresh、Vue HMR API），在回调中注入状态同步与组件替换策略。
- **副作用清理**：在 `module.hot.dispose` 中可以注册清理函数，确保下次重新执行模块代码前释放旧的副作用（事件监听、定时器等）。

## 流程示意
```
文件修改 → Webpack 监听到变更 → 增量编译生成 hot-update
      ↓                            ↑
 WDS 推送更新哈希 ── WebSocket ── 浏览器 HMR Runtime
      ↓                            ↑
  浏览器拉取补丁 → 替换模块 → 执行 accept 回调或整页刷新
```

## 相关配置摘要
```javascript
// webpack.config.js (开发环境)
module.exports = {
  mode: 'development',
  devServer: {
    hot: true, // 启用 HMR
    client: {
      overlay: true,
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // Webpack 5 虽可省略，但显式声明更直观
  ],
};
```

## 关键点回顾
- HMR 的核心是 **增量编译 + Runtime 模块替换**，通过 WebSocket 通知浏览器拉取补丁。
- `module.hot.accept` 与 `module.hot.dispose` 让你决定模块如何被替换、如何清理副作用。
- 若补丁无法被局部接受，Webpack 会自动退化为全量刷新，保证开发体验的连续性。

