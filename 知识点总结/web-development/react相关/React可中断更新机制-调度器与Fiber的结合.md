# React 可中断更新机制：调度器与 Fiber 的结合

## 一、可中断更新的概念

### 1.1 什么是可中断更新

可中断更新（Interruptible Updates）是指 React 在执行渲染工作时，能够**暂停当前工作**，处理更高优先级的任务（如用户交互），然后再**恢复之前的工作**继续执行。

### 1.2 为什么需要可中断更新

在 React 16 之前，React 使用**递归的方式**进行协调（Reconciliation），这种方式存在以下问题：

1. **阻塞主线程**：一旦开始渲染，必须完成整个组件树的渲染才能响应其他任务
2. **无法中断**：如果渲染过程很长，用户交互会被阻塞，导致页面卡顿
3. **优先级无法区分**：所有更新都是同步的，无法区分紧急程度

### 1.3 可中断更新的优势

- ✅ **提高响应性**：用户交互可以立即响应，不会被长时间渲染阻塞
- ✅ **优先级调度**：高优先级任务可以中断低优先级任务
- ✅ **时间切片**：将大任务分解成小任务，在多个帧中执行
- ✅ **更好的用户体验**：避免页面卡顿，保持流畅的交互

---

## 二、调度器（Scheduler）的作用

### 2.1 调度器的核心职责

调度器是 React 的**任务调度中心**，负责：

1. **任务优先级管理**：为不同类型的更新分配优先级
2. **时间切片控制**：决定每个时间片执行多少工作
3. **任务中断与恢复**：在时间片用尽时中断任务，在下次空闲时恢复
4. **浏览器 API 封装**：封装 `requestIdleCallback`、`MessageChannel` 等 API

### 2.2 优先级系统

React 定义了以下优先级（从高到低）：

```javascript
// scheduler/src/Scheduler.js
const ImmediatePriority = 1;      // 立即执行（同步）
const UserBlockingPriority = 2;  // 用户阻塞（用户交互）
const NormalPriority = 3;         // 正常优先级（默认）
const LowPriority = 4;            // 低优先级
const IdlePriority = 5;           // 空闲优先级
```

### 2.3 调度器的实现原理

#### 2.3.1 任务队列

调度器维护一个**优先队列**，按照任务的过期时间（expirationTime）排序：

```javascript
// 简化的调度器实现
let taskQueue = [];  // 任务队列
let timerQueue = []; // 延迟任务队列

function scheduleCallback(priorityLevel, callback, options) {
  const currentTime = getCurrentTime();
  let expirationTime;
  
  // 根据优先级计算过期时间
  switch (priorityLevel) {
    case ImmediatePriority:
      expirationTime = currentTime;  // 立即执行
      break;
    case UserBlockingPriority:
      expirationTime = currentTime + 250;  // 250ms 后过期
      break;
    case NormalPriority:
      expirationTime = currentTime + 5000;  // 5s 后过期
      break;
    case LowPriority:
      expirationTime = currentTime + 10000;  // 10s 后过期
      break;
    case IdlePriority:
      expirationTime = Infinity;  // 永不过期
      break;
  }
  
  const newTask = {
    id: taskIdCounter++,
    callback,
    priorityLevel,
    startTime: currentTime,
    expirationTime,
    sortIndex: expirationTime,  // 用于排序
  };
  
  // 插入优先队列
  push(taskQueue, newTask);
  
  // 如果没有正在执行的任务，开始调度
  if (!isHostCallbackScheduled && !isPerformingWork) {
    isHostCallbackScheduled = true;
    requestHostCallback(flushWork);
  }
  
  return newTask;
}
```

#### 2.3.2 时间切片控制

调度器通过 `performWorkUntilDeadline` 函数控制每个时间片的执行：

```javascript
// 时间片长度（5ms）
const frameInterval = 5;

function performWorkUntilDeadline() {
  if (scheduledHostCallback !== null) {
    const currentTime = getCurrentTime();
    // 计算截止时间
    deadline = currentTime + frameInterval;
    
    let hasMoreWork = true;
    try {
      // 执行工作，直到截止时间
      hasMoreWork = scheduledHostCallback(hasTimeRemaining, currentTime);
    } finally {
      if (hasMoreWork) {
        // 如果还有工作，继续调度
        schedulePerformWorkUntilDeadline();
      } else {
        isMessageLoopRunning = false;
        scheduledHostCallback = null;
      }
    }
  } else {
    isMessageLoopRunning = false;
  }
}
```

#### 2.3.3 浏览器 API 封装

React 使用 `MessageChannel` 实现时间切片（而不是直接使用 `requestIdleCallback`）：

```javascript
// 使用 MessageChannel 实现调度
const channel = new MessageChannel();
const port1 = channel.port1;
const port2 = channel.port2;

port1.onmessage = performWorkUntilDeadline;

function schedulePerformWorkUntilDeadline() {
  if (!isMessageLoopRunning) {
    isMessageLoopRunning = true;
    port2.postMessage(null);  // 触发下一个时间片
  }
}
```

**为什么不直接用 `requestIdleCallback`？**

1. **兼容性**：`requestIdleCallback` 在 Safari 中支持不好
2. **控制精度**：`MessageChannel` 提供更精确的时间控制
3. **跨平台**：可以在 Node.js 等非浏览器环境使用

---

## 三、Fiber 的作用

### 3.1 Fiber 的核心职责

Fiber 是 React 的**工作单元**，负责：

1. **工作分解**：将组件树渲染分解成一个个 Fiber 节点
2. **状态保存**：保存每个节点的渲染状态，支持中断和恢复
3. **遍历控制**：通过链表结构实现可中断的深度优先遍历
4. **双缓冲机制**：维护 current 树和 workInProgress 树

### 3.2 Fiber 节点的关键属性

```javascript
// Fiber 节点的关键属性
const fiberNode = {
  // 节点信息
  tag: FunctionComponent,        // 节点类型
  key: 'key',                    // key
  elementType: Component,        // 元素类型
  type: Component,               // 类型
  
  // 树结构（链表）
  return: parentFiber,           // 父节点
  child: firstChildFiber,        // 第一个子节点
  sibling: nextSiblingFiber,     // 下一个兄弟节点
  
  // 状态
  pendingProps: newProps,       // 新的 props
  memoizedProps: oldProps,       // 旧的 props
  memoizedState: oldState,       // 旧的状态
  updateQueue: updateQueue,      // 更新队列
  
  // 副作用
  effectTag: Update,            // 副作用类型
  nextEffect: nextEffectFiber,  // 下一个副作用节点
  
  // 双缓冲
  alternate: alternateFiber,     // 对应的 alternate 节点
  
  // 优先级
  lanes: Lanes,                  // 优先级车道
  childLanes: Lanes,            // 子节点优先级车道
};
```

### 3.3 Fiber 的遍历算法

Fiber 使用**深度优先遍历**，但通过链表结构实现可中断：

```javascript
// 执行单个 Fiber 节点的工作
function performUnitOfWork(unitOfWork) {
  const current = unitOfWork.alternate;
  let next;
  
  // beginWork: 处理当前节点
  next = beginWork(current, unitOfWork, subtreeRenderLanes);
  
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  
  if (next === null) {
    // 如果没有子节点，完成当前节点
    completeUnitOfWork(unitOfWork);
  } else {
    // 返回子节点，继续遍历
    workInProgress = next;
  }
  
  return next;
}

// 完成当前节点的工作
function completeUnitOfWork(unitOfWork) {
  let completedWork = unitOfWork;
  
  do {
    const current = completedWork.alternate;
    const returnFiber = completedWork.return;
    
    // completeWork: 完成当前节点的工作
    const next = completeWork(current, completedWork, subtreeRenderLanes);
    
    // 收集副作用
    if (returnFiber !== null && (returnFiber.flags & Incomplete) === NoFlags) {
      // 将副作用添加到父节点的 effectList
      if (returnFiber.firstEffect === null) {
        returnFiber.firstEffect = completedWork.firstEffect;
      }
      if (completedWork.lastEffect !== null) {
        if (returnFiber.lastEffect !== null) {
          returnFiber.lastEffect.nextEffect = completedWork.firstEffect;
        }
        returnFiber.lastEffect = completedWork.lastEffect;
      }
    }
    
    // 遍历兄弟节点
    const siblingFiber = completedWork.sibling;
    if (siblingFiber !== null) {
      workInProgress = siblingFiber;
      return siblingFiber;
    }
    
    // 没有兄弟节点，返回父节点
    completedWork = returnFiber;
    workInProgress = completedWork;
  } while (completedWork !== null);
  
  return null;
}
```

### 3.4 双缓冲机制

React 维护两棵 Fiber 树：

- **current 树**：当前屏幕上显示的树
- **workInProgress 树**：正在构建的新树

```javascript
// 双缓冲切换
function commitRoot(root) {
  const finishedWork = root.finishedWork;
  
  // 提交副作用到 DOM
  commitMutationEffects(root, finishedWork);
  
  // 切换 current 指针
  root.current = finishedWork;
  
  // 清理
  root.finishedWork = null;
}
```

**优势：**

- 可以随时丢弃 workInProgress 树，不会影响 current 树
- 支持并发更新，多个更新可以同时进行
- 支持 Suspense 等高级特性

---

## 四、调度器与 Fiber 的结合

### 4.1 整体工作流程

```
用户操作/状态更新
    ↓
调度器（Scheduler）
    ↓ 分配优先级，加入任务队列
    ↓
requestHostCallback
    ↓ 使用 MessageChannel 调度
    ↓
performWorkUntilDeadline
    ↓ 时间切片控制
    ↓
workLoopConcurrent / workLoopSync
    ↓ 调用 Fiber 工作循环
    ↓
performUnitOfWork
    ↓ 处理单个 Fiber 节点
    ↓
beginWork → completeWork
    ↓ 构建 workInProgress 树
    ↓
时间片用尽？
    ├─ 是 → 中断，保存当前状态，等待下次调度
    └─ 否 → 继续处理下一个 Fiber 节点
    ↓
所有节点处理完成？
    ├─ 是 → commitRoot（提交到 DOM）
    └─ 否 → 继续循环
```

### 4.2 关键代码实现

#### 4.2.1 工作循环

```javascript
// ReactFiberWorkLoop.js
function workLoopConcurrent() {
  // 在并发模式下，可以中断
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}

function workLoopSync() {
  // 同步模式，不可中断
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

function shouldYield() {
  // 检查是否应该让出控制权
  const timeElapsed = getCurrentTime() - startTime;
  if (timeElapsed < frameInterval) {
    // 时间片未用完，继续执行
    return false;
  }
  // 时间片用尽，需要让出控制权
  if (enableIsInputPending) {
    // 检查是否有用户输入等待处理
    if (needsPaint || isInputPending()) {
      return true;
    }
  }
  return true;
}
```

#### 4.2.2 调度器调用 Fiber 工作循环

```javascript
// scheduler/src/Scheduler.js
function flushWork(hasTimeRemaining, initialTime) {
  isHostCallbackScheduled = false;
  
  if (enableProfiling) {
    markSchedulerUnsuspended(initialTime);
  }
  
  try {
    return workLoop(hasTimeRemaining, initialTime);
  } finally {
    // 清理工作
  }
}

function workLoop(hasTimeRemaining, initialTime) {
  let currentTime = initialTime;
  advanceTimers(currentTime);
  currentTask = peek(taskQueue);
  
  while (currentTask !== null) {
    if (currentTask.expirationTime > currentTime && (!hasTimeRemaining || shouldYieldToHost())) {
      // 任务未过期，且时间片用尽，中断
      break;
    }
    
    const callback = currentTask.callback;
    if (typeof callback === 'function') {
      currentTask.callback = null;
      currentPriorityLevel = currentTask.priorityLevel;
      const didUserCallbackTimeout = currentTask.expirationTime <= currentTime;
      
      // 执行回调（这里会调用 React 的 renderRoot）
      const continuationCallback = callback(didUserCallbackTimeout);
      currentTime = getCurrentTime();
      
      if (typeof continuationCallback === 'function') {
        // 任务未完成，保存 continuation
        currentTask.callback = continuationCallback;
      } else {
        // 任务完成
        if (currentTask === peek(taskQueue)) {
          pop(taskQueue);
        }
      }
      advanceTimers(currentTime);
    } else {
      pop(taskQueue);
    }
    currentTask = peek(taskQueue);
  }
  
  // 如果还有任务，返回 true，表示需要继续调度
  if (currentTask !== null) {
    return true;
  } else {
    return false;
  }
}
```

#### 4.2.3 React 调用调度器

```javascript
// ReactFiberWorkLoop.js
function scheduleUpdateOnFiber(fiber, lane, eventTime) {
  // 标记根节点需要更新
  const root = markUpdateLaneFromFiberToRoot(fiber, lane);
  if (root === null) {
    return null;
  }
  
  // 标记根节点有更新
  markRootUpdated(root, lane, eventTime);
  
  // 调度更新
  if (lane === SyncLane) {
    // 同步更新
    if (
      (executionContext & LegacyUnbatchedContext) !== NoContext &&
      (executionContext & (RenderContext | CommitContext)) === NoContext
    ) {
      // 立即执行
      performSyncWorkOnRoot(root);
    } else {
      // 调度同步更新
      ensureRootIsScheduled(root, eventTime);
      schedulePendingInteractions(root, lane);
    }
  } else {
    // 并发更新
    ensureRootIsScheduled(root, eventTime);
    schedulePendingInteractions(root, lane);
  }
  
  return root;
}

function ensureRootIsScheduled(root, currentTime) {
  const existingCallbackNode = root.callbackNode;
  
  // 检查是否有过期任务
  markStarvedLanesAsExpired(root, currentTime);
  
  // 获取下一个优先级
  const nextLanes = getNextLanes(
    root,
    root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes,
  );
  
  const newCallbackPriority = getHighestPriorityLane(nextLanes);
  const existingCallbackPriority = root.callbackPriority;
  
  if (
    existingCallbackPriority === newCallbackPriority &&
    existingCallbackNode !== null
  ) {
    // 优先级相同，不需要重新调度
    return;
  }
  
  // 取消之前的调度
  if (existingCallbackNode != null) {
    cancelCallback(existingCallbackNode);
  }
  
  // 调度新的更新
  let newCallbackNode;
  if (newCallbackPriority === SyncLane) {
    // 同步更新
    if (root.tag === LegacyRoot) {
      scheduleLegacySyncCallback(performSyncWorkOnRoot.bind(null, root));
    } else {
      scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root));
    }
    newCallbackNode = null;
  } else {
    // 并发更新
    let schedulerPriorityLevel;
    switch (lanesToEventPriority(nextLanes)) {
      case DiscreteEventPriority:
        schedulerPriorityLevel = ImmediateSchedulerPriority;
        break;
      case ContinuousEventPriority:
        schedulerPriorityLevel = UserBlockingSchedulerPriority;
        break;
      case DefaultEventPriority:
        schedulerPriorityLevel = NormalSchedulerPriority;
        break;
      case IdleEventPriority:
        schedulerPriorityLevel = IdleSchedulerPriority;
        break;
      default:
        schedulerPriorityLevel = NormalSchedulerPriority;
        break;
    }
    
    // 调用调度器
    newCallbackNode = scheduleCallback(
      schedulerPriorityLevel,
      performConcurrentWorkOnRoot.bind(null, root),
    );
  }
  
  root.callbackNode = newCallbackNode;
  root.callbackPriority = newCallbackPriority;
}
```

### 4.3 中断与恢复的完整流程

#### 场景：低优先级更新被高优先级更新中断

```javascript
// 1. 低优先级更新开始
scheduleCallback(NormalPriority, () => {
  // 开始渲染大量组件
  renderRoot(root, NormalLanes);
});

// 2. 在渲染过程中，用户点击按钮
button.onclick = () => {
  // 触发高优先级更新
  scheduleCallback(UserBlockingPriority, () => {
    // 中断低优先级更新，开始高优先级更新
    renderRoot(root, UserBlockingLanes);
  });
};

// 3. 高优先级更新完成后，恢复低优先级更新
scheduleCallback(NormalPriority, () => {
  // 从上次中断的地方继续
  renderRoot(root, NormalLanes);
});
```

#### 代码实现

```javascript
// ReactFiberWorkLoop.js
function performConcurrentWorkOnRoot(root, didTimeout) {
  if (didTimeout) {
    // 任务过期，需要同步执行
    const lanes = getNextLanes(root, root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes);
    if (lanes !== NoLanes) {
      const exitStatus = renderRootSync(root, lanes);
      if (exitStatus !== RootInProgress) {
        const finishedWork = root.current.alternate;
        root.finishedWork = finishedWork;
        finishConcurrentRender(root, exitStatus, lanes);
      }
    }
    return null;
  }
  
  // 并发渲染
  let exitStatus = renderRootConcurrent(root, lanes);
  
  if (exitStatus !== RootInProgress) {
    // 渲染完成
    const finishedWork = root.current.alternate;
    root.finishedWork = finishedWork;
    finishConcurrentRender(root, exitStatus, lanes);
  }
  
  // 如果还有工作，返回 continuation
  if (root.callbackNode === originalCallbackNode) {
    return performConcurrentWorkOnRoot.bind(null, root);
  }
  return null;
}

function renderRootConcurrent(root, lanes) {
  do {
    try {
      workLoopConcurrent();
      break;
    } catch (thrownValue) {
      handleError(root, thrownValue);
    }
  } while (true);
  
  if (workInProgress !== null) {
    // 工作未完成，返回 RootInProgress
    return RootInProgress;
  } else {
    // 工作完成
    return RootCompleted;
  }
}
```

---

## 五、实际应用示例

### 5.1 示例：大量列表渲染

```jsx
function LargeList({ items }) {
  return (
    <div>
      {items.map(item => (
        <ListItem key={item.id} data={item} />
      ))}
    </div>
  );
}

// 当 items 有 10000 个元素时
// 1. React 会将渲染分解成多个 Fiber 节点
// 2. 调度器控制每个时间片处理一部分节点
// 3. 如果用户滚动，高优先级的滚动更新会中断列表渲染
// 4. 滚动完成后，继续渲染剩余的列表项
```

### 5.2 示例：用户交互中断后台更新

```jsx
function App() {
  const [count, setCount] = useState(0);
  const [heavyData, setHeavyData] = useState(null);
  
  // 低优先级更新：加载大量数据
  useEffect(() => {
    fetch('/api/heavy-data')
      .then(res => res.json())
      .then(data => {
        // 触发低优先级更新
        startTransition(() => {
          setHeavyData(data);
        });
      });
  }, []);
  
  // 高优先级更新：用户点击
  const handleClick = () => {
    setCount(c => c + 1);  // 同步更新，高优先级
  };
  
  return (
    <div>
      <button onClick={handleClick}>Count: {count}</button>
      {heavyData && <HeavyComponent data={heavyData} />}
    </div>
  );
}
```

**执行流程：**

1. `setHeavyData` 触发低优先级更新，开始渲染 `HeavyComponent`
2. 用户点击按钮，`setCount` 触发高优先级更新
3. **调度器中断**低优先级更新，优先处理高优先级更新
4. 高优先级更新完成，`count` 立即更新
5. 低优先级更新恢复，继续渲染 `HeavyComponent`

---

## 六、总结

### 6.1 调度器与 Fiber 的分工

| 组件 | 职责 | 关键特性 |
|------|------|----------|
| **调度器（Scheduler）** | 任务调度和时间控制 | 优先级管理、时间切片、中断控制 |
| **Fiber** | 工作单元和状态管理 | 工作分解、状态保存、遍历控制 |

### 6.2 可中断更新的实现要点

1. **调度器提供时间控制**
   - 通过 `MessageChannel` 实现时间切片
   - 每个时间片约 5ms
   - 时间片用尽时中断任务

2. **Fiber 提供状态保存**
   - 每个 Fiber 节点保存渲染状态
   - 通过链表结构支持可中断遍历
   - 双缓冲机制保证一致性

3. **两者结合实现可中断更新**
   - 调度器控制**何时**执行和中断
   - Fiber 控制**如何**执行和恢复
   - 通过优先级系统协调两者

### 6.3 关键优势

- ✅ **响应性**：用户交互不会被长时间渲染阻塞
- ✅ **优先级**：高优先级任务可以中断低优先级任务
- ✅ **性能**：时间切片避免长时间阻塞主线程
- ✅ **用户体验**：页面保持流畅，减少卡顿

### 6.4 核心思想

React 的可中断更新机制体现了**协作式多任务**的思想：

- 不是抢占式的（不会强制中断）
- 是协作式的（主动让出控制权）
- 通过时间切片和优先级实现协作

这种设计使得 React 能够在保持高性能的同时，提供流畅的用户体验。
