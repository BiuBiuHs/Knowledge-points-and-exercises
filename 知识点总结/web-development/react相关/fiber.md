React Fiber 是 React 16 中引入的新的核心算法，它的主要目标是提高 React 应用的性能和响应性，特别是在处理大型复杂应用时。以下是 React Fiber 的主要特点和工作原理：

1. 基本概念

- Fiber 是一种重新实现的堆栈，专门用于 React 组件
- 每个 Fiber 节点对应一个 React 元素，保存了该组件的类型、DOM节点和子节点等信息

2. 主要目标

- 能够把渲染工作分割成小块，并将其分散到多个帧中
- 能够暂停、中止或重用渲染工作
- 能够为不同类型的更新分配优先级
- 支持新的并发模式（Concurrent Mode）

3. 工作原理

a) 工作单元

- Fiber 将渲染工作分解成多个小单元
- 每个单元完成后，React 检查是否有更高优先级的工作需要处理

b) 双缓冲

- 维护两棵树：current 树（当前屏幕上显示的内容）和 workInProgress 树（正在构建的新树）
- 完成更新后，workInProgress 树变成新的 current 树

c) 优先级调度

- 不同类型的更新被赋予不同的优先级
- 高优先级的更新可以中断低优先级的更新

4. 生命周期变化

- 引入了新的生命周期方法，如 getDerivedStateFromProps 和 getSnapshotBeforeUpdate
- 废弃了一些可能导致问题的生命周期方法，如 componentWillMount

5. 渲染阶段

a) Render 阶段

- 可以被中断
- 构建 Fiber 树，计算变更

b) Commit 阶段

- 不可中断
- 将变更应用到 DOM

6. 优势

- 提高应用的响应性，减少卡顿
- 更好地支持动画和手势
- 更灵活的错误处理和异步渲染

7. Fiber 架构的关键特性

- 增量渲染：能够将渲染工作分割成多个块
- 暂停、中止或重用工作：能够根据需要管理渲染过程
- 为不同类型的更新分配优先级
- 并发性：多个更新可以同时进行

8. 示例（伪代码）

```javascript
function performUnitOfWork(fiber) {
  // 执行当前 fiber 节点的工作
  // ...

  // 返回下一个要处理的 fiber 节点
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.return;
  }
}
```

9. 注意事项

- 一些生命周期方法可能被多次调用，需要注意副作用
- 在 Concurrent 模式下，渲染可能会被中断和重新开始
- 需要注意处理旧版生命周期方法的兼容性问题

React Fiber 是一个复杂的主题，它深刻地改变了 React 的内部工作方式。理解 Fiber 有助于开发者更好地优化 React 应用，特别是在处理大规模、复杂的交互时。

### fiber的具体属性

Fiber 节点是 React 内部用来表示组件的数据结构，它包含了许多重要的属性。以下是 Fiber 节点的主要属性：

1. 标识相关
   - tag: 标识 Fiber 节点类型（如函数组件、类组件、原生元素等）
   - key: 用于 Diff 算法的 key
   - elementType: 元素类型（如 div、span、组件函数等）
   - type: 与 elementType 类似，但可能会被修改（如 React.memo 包裹的组件）

2. 结构相关
   - return: 指向父 Fiber 节点
   - child: 指向第一个子 Fiber 节点
   - sibling: 指向下一个兄弟 Fiber 节点
   - index: 在兄弟节点中的索引

3. 状态相关
   - pendingProps: 新的 props
   - memoizedProps: 上一次渲染时的 props
   - updateQueue: 状态更新队列
   - memoizedState: 上一次渲染时的 state

4. 副作用相关
   - effectTag: 表示节点需要执行的副作用类型（如更新、删除、添加等）
   - nextEffect: 指向下一个有副作用的 Fiber 节点
   - firstEffect: 指向第一个有副作用的子 Fiber 节点
   - lastEffect: 指向最后一个有副作用的子 Fiber 节点

5. 替换相关
   - alternate: 指向内存中的另一个 Fiber 节点（用于双缓冲）

6. 调度相关
   - lanes: 表示更新的优先级
   - childLanes: 子树中更新的优先级

7. 渲染输出
   - stateNode: 保存对组件实例、DOM 节点等的引用

8. 调试信息
   - _debugID: 用于开发工具的调试 ID
   - _debugSource: 源代码位置信息
   - _debugOwner: 创建该 Fiber 的组件

9. 工作进度
   - progressedChild: 部分完成的新树
   - progressedPrimaryChild: 主树上部分完成的新树

10. 时间信息
    - actualStartTime: 本次渲染开始时间
    - actualDuration: 本次渲染的实际时间
    - selfBaseDuration: 不包含子组件的渲染时间
    - treeBaseDuration: 整个子树的渲染时间

11. 上下文
    - contextDependencies: 上下文依赖

这些属性使 Fiber 能够：

- 追踪组件树结构
- 管理组件的状态和属性
- 控制渲染过程和调度
- 处理副作用
- 支持时间分片和优先级调度
- 实现增量渲染
- 支持调试和性能分析

理解这些属性有助于深入了解 React 的内部工作机制，特别是在需要调试复杂问题或优化性能时。但在日常开发中，我们通常不需要直接操作这些属性，而是通过 React 提供的 API 来间接使用它们。
