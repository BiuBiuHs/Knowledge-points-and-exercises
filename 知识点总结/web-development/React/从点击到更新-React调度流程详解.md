# 从点击到更新 - React 调度流程详解

## 概述

当用户在页面上点击一个按钮时，React 会经历从事件触发、创建更新任务、到调度执行的完整流程。本文详细解析这个过程，以及 React 在不同环境下使用的调度 API。

---

## 完整流程图

```
用户点击按钮
    ↓
1. 原生 DOM 事件触发
    ↓
2. 事件冒泡到 React 根节点
    ↓
3. React 捕获事件，创建合成事件
    ↓
4. 执行事件处理函数 (onClick)
    ↓
5. 调用 setState/useState 更新状态
    ↓
6. 创建 Update 对象
    ↓
7. 将 Update 加入到 Fiber 的 updateQueue
    ↓
8. 调度更新（scheduleUpdateOnFiber）
    ↓
9. Scheduler 介入，创建调度任务
    ↓
10. 根据环境选择调度 API
    ↓
11. 在合适的时机执行更新任务
    ↓
12. Render 阶段（协调）
    ↓
13. Commit 阶段（提交到 DOM）
    ↓
14. 浏览器绘制，用户看到更新
```

---

## 阶段一：事件触发与处理

### 1.1 用户点击触发事件

```javascript
function Counter() {
  const [count, setCount] = useState(0);
  
  const handleClick = () => {
    console.log('1. 事件处理函数执行');
    setCount(count + 1);
    console.log('2. setCount 调用完成');
  };
  
  return <button onClick={handleClick}>Count: {count}</button>;
}

// 点击按钮的流程：
// 1. 用户点击 button 元素
// 2. 原生 click 事件触发
// 3. 事件冒泡到 #root（React 17+）或 document（React 16）
// 4. React 的事件监听器捕获
// 5. React 创建合成事件对象
// 6. React 根据 fiber 树找到 onClick 处理函数
// 7. 执行 handleClick
// 8. 调用 setCount
```

### 1.2 合成事件系统的作用

```javascript
// React 事件系统的内部处理
function dispatchEvent(domEventName, eventSystemFlags, targetContainer, nativeEvent) {
  // 1. 找到触发事件的 fiber 节点
  const targetFiber = getClosestInstanceFromNode(nativeEvent.target);
  
  // 2. 收集事件路径上的所有监听器（捕获和冒泡）
  const listeners = accumulateEventHandlers(targetFiber, domEventName);
  
  // 3. 创建合成事件对象
  const syntheticEvent = createSyntheticEvent(nativeEvent);
  
  // 4. 批量更新模式开启
  batchedUpdates(() => {
    // 5. 执行所有监听器
    listeners.forEach(listener => {
      listener(syntheticEvent);
    });
  });
}
```

**关键点：批量更新（Batched Updates）**

```javascript
// React 在事件处理函数中自动开启批量更新
function handleClick() {
  setCount(count + 1);  // 不会立即触发重新渲染
  setName('Alice');     // 不会立即触发重新渲染
  // 所有状态更新会被收集，事件处理函数结束后统一处理
}
```

---

## 阶段二：创建更新任务

### 2.1 setState/useState 的内部实现

```javascript
// useState 的简化实现
function useState(initialState) {
  const fiber = getCurrentFiber();
  const hook = getCurrentHook();
  
  // dispatchAction 就是 setState 函数
  const dispatch = (action) => {
    console.log('3. dispatch 被调用');
    
    // 创建 update 对象
    const update = {
      lane: getCurrentLane(),        // 优先级
      action: action,                // 新状态或更新函数
      next: null,                    // 下一个 update
      hasEagerState: false,          // 是否已计算新状态
      eagerState: null              // 预计算的状态
    };
    
    console.log('4. Update 对象创建:', update);
    
    // 将 update 加入到 fiber 的更新队列
    enqueueUpdate(fiber, update);
    
    // 调度更新
    scheduleUpdateOnFiber(fiber, lane);
  };
  
  return [hook.state, dispatch];
}
```

### 2.2 Update 对象结构

```javascript
// Update 对象的完整结构
const update = {
  // 更新的优先级（Lane）
  lane: SyncLane,  // 或 DefaultLane、TransitionLane 等
  
  // 更新的内容
  action: (prevState) => prevState + 1,  // 或直接的值
  
  // 更新链表
  next: null,  // 指向下一个 update
  
  // 优化相关
  hasEagerState: false,  // 是否提前计算了新状态
  eagerState: null,      // 提前计算的状态
  
  // 回调函数（类组件）
  callback: null
};
```

### 2.3 UpdateQueue 结构

```javascript
// Fiber 节点的更新队列
fiber.updateQueue = {
  // 基础状态（上次渲染的状态）
  baseState: 0,
  
  // 第一个 baseUpdate（跳过的低优先级更新）
  firstBaseUpdate: null,
  lastBaseUpdate: null,
  
  // 共享的更新队列（环形链表）
  shared: {
    pending: update  // 最新的 update
  },
  
  // 副作用
  effects: null
};

// pending 是一个环形链表
// update3.next → update1
// update1.next → update2
// update2.next → update3
```

---

## 阶段三：调度更新

### 3.1 scheduleUpdateOnFiber

```javascript
// react-reconciler/src/ReactFiberWorkLoop.js
function scheduleUpdateOnFiber(fiber, lane, eventTime) {
  console.log('5. 开始调度更新');
  
  // 1. 标记 fiber 树的更新 lane
  markUpdateLaneFromFiberToRoot(fiber, lane);
  
  // 2. 检查是否需要同步更新
  if (lane === SyncLane) {
    // 同步更新（如事件中的 setState）
    if (executionContext === NoContext) {
      // 不在 React 的执行上下文中，立即同步执行
      performSyncWorkOnRoot(root);
    } else {
      // 在 React 执行上下文中（如事件处理函数中）
      // 确保在批处理结束后执行
      ensureRootIsScheduled(root, eventTime);
    }
  } else {
    // 并发更新（concurrent mode）
    ensureRootIsScheduled(root, eventTime);
  }
}
```

### 3.2 ensureRootIsScheduled - 调度的核心

```javascript
function ensureRootIsScheduled(root, currentTime) {
  console.log('6. 确保根节点被调度');
  
  // 1. 检查是否有已经调度的任务
  const existingCallbackNode = root.callbackNode;
  
  // 2. 标记饥饿的 lanes（等待太久的低优先级更新）
  markStarvedLanesAsExpired(root, currentTime);
  
  // 3. 获取下一个要处理的 lane（最高优先级）
  const nextLanes = getNextLanes(root);
  
  // 4. 如果没有待处理的更新，取消现有调度
  if (nextLanes === NoLanes) {
    if (existingCallbackNode !== null) {
      cancelCallback(existingCallbackNode);
    }
    root.callbackNode = null;
    return;
  }
  
  // 5. 获取新任务的优先级
  const newCallbackPriority = getHighestPriorityLane(nextLanes);
  
  // 6. 如果优先级相同，复用现有调度
  const existingCallbackPriority = root.callbackPriority;
  if (existingCallbackPriority === newCallbackPriority) {
    return;  // 复用现有的调度任务
  }
  
  // 7. 取消旧的调度，创建新的
  if (existingCallbackNode !== null) {
    cancelCallback(existingCallbackNode);
  }
  
  // 8. 根据优先级调度任务
  let newCallbackNode;
  
  if (newCallbackPriority === SyncLane) {
    // 同步优先级：立即执行
    console.log('7. 同步调度');
    scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root));
    newCallbackNode = null;
  } else {
    // 异步优先级：通过 Scheduler 调度
    console.log('7. 异步调度，进入 Scheduler');
    
    // 将 React 的 lane 转换为 Scheduler 的优先级
    const schedulerPriorityLevel = lanesToSchedulerPriority(newCallbackPriority);
    
    // 调用 Scheduler.scheduleCallback
    newCallbackNode = scheduleCallback(
      schedulerPriorityLevel,
      performConcurrentWorkOnRoot.bind(null, root)
    );
  }
  
  // 9. 保存新的调度任务
  root.callbackNode = newCallbackNode;
  root.callbackPriority = newCallbackPriority;
}
```

---

## 阶段四：Scheduler 调度器

### 4.1 Scheduler 的优先级系统

```javascript
// scheduler/src/SchedulerPriorities.js
export const ImmediatePriority = 1;      // 立即执行（过期时间：-1ms）
export const UserBlockingPriority = 2;   // 用户阻塞（过期时间：250ms）
export const NormalPriority = 3;         // 正常优先级（过期时间：5000ms）
export const LowPriority = 4;            // 低优先级（过期时间：10000ms）
export const IdlePriority = 5;           // 空闲优先级（过期时间：∞）

// React Lane 到 Scheduler Priority 的映射
function lanesToSchedulerPriority(lanes) {
  if (includesSyncLane(lanes)) {
    return ImmediatePriority;
  }
  if (includesInputContinuousLane(lanes)) {
    return UserBlockingPriority;
  }
  if (includesDefaultLane(lanes)) {
    return NormalPriority;
  }
  if (includesTransitionLane(lanes)) {
    return LowPriority;
  }
  return IdlePriority;
}
```

### 4.2 scheduleCallback - 创建调度任务

```javascript
// scheduler/src/Scheduler.js
function scheduleCallback(priorityLevel, callback) {
  console.log('8. Scheduler.scheduleCallback 被调用');
  
  const currentTime = getCurrentTime();
  
  // 1. 计算任务的开始时间
  let startTime;
  if (typeof options === 'object' && options !== null) {
    const delay = options.delay;
    if (typeof delay === 'number' && delay > 0) {
      startTime = currentTime + delay;
    } else {
      startTime = currentTime;
    }
  } else {
    startTime = currentTime;
  }
  
  // 2. 根据优先级计算过期时间
  let timeout;
  switch (priorityLevel) {
    case ImmediatePriority:
      timeout = IMMEDIATE_PRIORITY_TIMEOUT;  // -1
      break;
    case UserBlockingPriority:
      timeout = USER_BLOCKING_PRIORITY_TIMEOUT;  // 250ms
      break;
    case IdlePriority:
      timeout = IDLE_PRIORITY_TIMEOUT;  // 1073741823ms (约12天)
      break;
    case LowPriority:
      timeout = LOW_PRIORITY_TIMEOUT;  // 10000ms
      break;
    case NormalPriority:
    default:
      timeout = NORMAL_PRIORITY_TIMEOUT;  // 5000ms
      break;
  }
  
  const expirationTime = startTime + timeout;
  
  // 3. 创建任务对象
  const newTask = {
    id: taskIdCounter++,          // 任务 ID
    callback,                     // 任务回调函数
    priorityLevel,                // 优先级
    startTime,                    // 开始时间
    expirationTime,               // 过期时间
    sortIndex: -1                 // 排序索引
  };
  
  console.log('9. Task 对象创建:', newTask);
  
  // 4. 将任务加入队列
  if (startTime > currentTime) {
    // 延迟任务：加入 timerQueue
    newTask.sortIndex = startTime;
    push(timerQueue, newTask);
    
    // 如果 taskQueue 为空，且这是最早的延迟任务
    if (peek(taskQueue) === null && newTask === peek(timerQueue)) {
      // 启动定时器
      requestHostTimeout(handleTimeout, startTime - currentTime);
    }
  } else {
    // 立即任务：加入 taskQueue
    newTask.sortIndex = expirationTime;
    push(taskQueue, newTask);
    
    console.log('10. 任务加入 taskQueue');
    
    // 如果没有正在执行的工作，开始调度
    if (!isHostCallbackScheduled && !isPerformingWork) {
      isHostCallbackScheduled = true;
      requestHostCallback(flushWork);
    }
  }
  
  return newTask;
}
```

---

## 阶段五：选择调度 API（核心）

### 5.1 不同环境下的调度 API

```javascript
// scheduler/src/forks/Scheduler.js

let schedulePerformWorkUntilDeadline;

// 根据环境选择合适的调度 API
if (typeof localSetImmediate === 'function') {
  // ========== Node.js 环境 ==========
  // 使用 setImmediate（最优）
  schedulePerformWorkUntilDeadline = () => {
    localSetImmediate(performWorkUntilDeadline);
  };
  
} else if (typeof MessageChannel !== 'undefined') {
  // ========== 浏览器环境（现代浏览器）==========
  // 使用 MessageChannel（React 的首选方案）
  
  const channel = new MessageChannel();
  const port = channel.port2;
  
  channel.port1.onmessage = performWorkUntilDeadline;
  
  schedulePerformWorkUntilDeadline = () => {
    console.log('11. 使用 MessageChannel.postMessage 调度');
    port.postMessage(null);
  };
  
} else {
  // ========== 降级方案 ==========
  // 使用 setTimeout（最后的选择）
  schedulePerformWorkUntilDeadline = () => {
    console.log('11. 使用 setTimeout 调度（降级）');
    localSetTimeout(performWorkUntilDeadline, 0);
  };
}
```

### 5.2 为什么选择这些 API？

#### MessageChannel (浏览器首选)

```javascript
// MessageChannel 的优势

// 1. 宏任务，优先级比 setTimeout 高
// 2. 不会被节流（setTimeout 有最小 4ms 限制）
// 3. 性能更好
// 4. 可以在下一个事件循环立即执行

const channel = new MessageChannel();
const port1 = channel.port1;
const port2 = channel.port2;

port1.onmessage = () => {
  console.log('执行任务');
};

// 触发任务
port2.postMessage(null);  // 下一个宏任务立即执行

// 对比 setTimeout
setTimeout(() => {
  console.log('执行任务');
}, 0);  // 至少延迟 4ms（浏览器限制）
```

#### setImmediate (Node.js 首选)

```javascript
// Node.js 环境的 setImmediate

// 优势：
// 1. 专门为 I/O 之后的回调设计
// 2. 比 setTimeout(fn, 0) 更快
// 3. 比 process.nextTick 优先级低（不会阻塞 I/O）

setImmediate(() => {
  console.log('setImmediate');
});

setTimeout(() => {
  console.log('setTimeout');
}, 0);

// 输出顺序不确定，但 setImmediate 通常更快
```

#### setTimeout (降级方案)

```javascript
// 为什么 setTimeout 是最后的选择？

// 1. 有最小延迟限制（4ms）
// 2. 会被浏览器节流（嵌套调用超过 5 次后延迟 4ms）
// 3. 在后台标签页可能延迟更久（1000ms）
// 4. 性能较差

setTimeout(() => {
  console.log('任务执行');
}, 0);  // 实际延迟至少 4ms
```

### 5.3 为什么不用 requestIdleCallback？

```javascript
// React 不使用 requestIdleCallback 的原因

// ❌ requestIdleCallback 的问题：

// 1. 浏览器兼容性差
if (typeof requestIdleCallback !== 'function') {
  // Safari、IE 不支持
}

// 2. 执行时机不可控
requestIdleCallback((deadline) => {
  // 只在浏览器空闲时执行
  // 可能很久都不执行（浏览器一直忙）
  // 高优先级任务可能延迟很久
});

// 3. 帧率限制
// requestIdleCallback 只在 60fps 的间隙执行
// 如果一帧没执行完，下一帧才执行
// 不适合需要快速响应的任务

// 4. 不支持优先级
// 所有任务都是空闲时执行，无法区分优先级

// ✅ React 的解决方案：
// 使用 MessageChannel + 自己的时间切片
// - 可控的执行时机
// - 支持优先级
// - 跨平台兼容
// - 更好的性能
```

---

## 阶段六：任务执行

### 6.1 requestHostCallback

```javascript
// scheduler/src/forks/Scheduler.js
function requestHostCallback(callback) {
  console.log('12. requestHostCallback 被调用');
  
  scheduledHostCallback = callback;
  
  if (!isMessageLoopRunning) {
    isMessageLoopRunning = true;
    // 调用选定的调度 API
    schedulePerformWorkUntilDeadline();
  }
}
```

### 6.2 performWorkUntilDeadline - 执行任务

```javascript
const performWorkUntilDeadline = () => {
  console.log('13. performWorkUntilDeadline 开始执行');
  
  if (scheduledHostCallback !== null) {
    const currentTime = getCurrentTime();
    
    // 设置截止时间（时间切片：5ms）
    deadline = currentTime + yieldInterval;
    
    const hasTimeRemaining = true;
    let hasMoreWork = true;
    
    try {
      // 执行任务，可能返回是否还有更多工作
      hasMoreWork = scheduledHostCallback(hasTimeRemaining, currentTime);
    } finally {
      if (hasMoreWork) {
        // 还有更多工作，继续调度
        console.log('14. 还有更多工作，继续调度');
        schedulePerformWorkUntilDeadline();
      } else {
        // 工作完成
        console.log('14. 工作完成');
        isMessageLoopRunning = false;
        scheduledHostCallback = null;
      }
    }
  } else {
    isMessageLoopRunning = false;
  }
  
  needsPaint = false;
};
```

### 6.3 flushWork - 处理任务队列

```javascript
function flushWork(hasTimeRemaining, initialTime) {
  console.log('15. flushWork 开始处理任务队列');
  
  isHostCallbackScheduled = false;
  
  // 取消超时检查
  if (isHostTimeoutScheduled) {
    isHostTimeoutScheduled = false;
    cancelHostTimeout();
  }
  
  isPerformingWork = true;
  const previousPriorityLevel = currentPriorityLevel;
  
  try {
    // 处理所有任务
    return workLoop(hasTimeRemaining, initialTime);
  } finally {
    currentTask = null;
    currentPriorityLevel = previousPriorityLevel;
    isPerformingWork = false;
  }
}
```

### 6.4 workLoop - 工作循环

```javascript
function workLoop(hasTimeRemaining, initialTime) {
  let currentTime = initialTime;
  
  // 1. 将到期的延迟任务移到 taskQueue
  advanceTimers(currentTime);
  
  // 2. 获取第一个任务
  currentTask = peek(taskQueue);
  
  console.log('16. workLoop 开始处理任务');
  
  while (currentTask !== null) {
    // 3. 检查是否需要让出控制权
    if (
      currentTask.expirationTime > currentTime &&
      (!hasTimeRemaining || shouldYieldToHost())
    ) {
      // 时间片用完，让出控制权
      console.log('17. 时间片用完，让出控制权');
      break;
    }
    
    const callback = currentTask.callback;
    
    if (typeof callback === 'function') {
      currentTask.callback = null;
      currentPriorityLevel = currentTask.priorityLevel;
      
      const didUserCallbackTimeout = currentTask.expirationTime <= currentTime;
      
      console.log('18. 执行任务回调');
      
      // 4. 执行任务回调（performConcurrentWorkOnRoot）
      const continuationCallback = callback(didUserCallbackTimeout);
      
      currentTime = getCurrentTime();
      
      if (typeof continuationCallback === 'function') {
        // 任务还没完成，继续
        currentTask.callback = continuationCallback;
      } else {
        // 任务完成，从队列中移除
        if (currentTask === peek(taskQueue)) {
          pop(taskQueue);
        }
      }
      
      advanceTimers(currentTime);
    } else {
      pop(taskQueue);
    }
    
    // 5. 获取下一个任务
    currentTask = peek(taskQueue);
  }
  
  // 6. 返回是否还有更多工作
  if (currentTask !== null) {
    return true;  // 还有任务
  } else {
    // 检查延迟任务
    const firstTimer = peek(timerQueue);
    if (firstTimer !== null) {
      requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
    }
    return false;  // 没有任务了
  }
}
```

### 6.5 shouldYieldToHost - 时间切片

```javascript
function shouldYieldToHost() {
  const currentTime = getCurrentTime();
  
  // 判断是否超过时间切片（默认 5ms）
  if (currentTime >= deadline) {
    // 检查是否需要绘制
    if (needsPaint || scheduling.isInputPending()) {
      // 需要绘制或有用户输入，让出控制权
      return true;
    }
    
    // 时间用完，但可以继续执行
    // 因为没有更高优先级的工作
    return currentTime >= maxYieldInterval;  // 超过 300ms 强制让出
  }
  
  // 时间切片还没用完
  return false;
}
```

---

## 阶段七：Render 和 Commit

### 7.1 performConcurrentWorkOnRoot

```javascript
function performConcurrentWorkOnRoot(root, didTimeout) {
  console.log('19. performConcurrentWorkOnRoot 开始');
  
  // 1. Render 阶段（可中断）
  let exitStatus = renderRootConcurrent(root, lanes);
  
  if (exitStatus !== RootInProgress) {
    // Render 完成
    if (exitStatus === RootCompleted) {
      // 2. Commit 阶段（不可中断）
      console.log('20. Render 完成，进入 Commit 阶段');
      const finishedWork = root.current.alternate;
      root.finishedWork = finishedWork;
      root.finishedLanes = lanes;
      
      commitRoot(root);
      console.log('21. Commit 完成');
    }
  }
  
  // 3. 确保根节点被调度（可能还有其他更新）
  ensureRootIsScheduled(root, now());
  
  // 4. 返回是否还有工作
  return getContinuationForRoot(root, originalCallbackNode);
}
```

---

## 完整时间线示例

```javascript
// 用户点击按钮的完整时间线

时间 0ms: 
  - 用户点击按钮
  - 原生 click 事件触发

时间 0.1ms:
  - 事件冒泡到 #root
  - React 捕获事件
  - 创建合成事件对象

时间 0.2ms:
  - 执行 onClick 处理函数
  - 调用 setCount(count + 1)
  - 创建 Update 对象
  - 加入 updateQueue

时间 0.3ms:
  - scheduleUpdateOnFiber
  - ensureRootIsScheduled
  - scheduleCallback

时间 0.4ms:
  - 创建 Task 对象
  - 加入 taskQueue
  - requestHostCallback

时间 0.5ms:
  - 调用 MessageChannel.postMessage
  - （浏览器环境）

时间 1ms:
  - performWorkUntilDeadline 执行
  - flushWork 开始
  - workLoop 处理任务队列

时间 1-6ms:
  - performConcurrentWorkOnRoot
  - Render 阶段（协调）
  - 构建 Fiber 树

时间 6-8ms:
  - Commit 阶段
  - 更新真实 DOM

时间 8ms+:
  - 浏览器绘制
  - 用户看到界面更新
```

---

## 不同场景下的调度策略

### 场景 1：同步更新（Legacy Mode）

```javascript
// 用户点击按钮（Legacy Mode）
function handleClick() {
  setCount(count + 1);  // 同步更新
}

// 流程：
// 1. setState
// 2. scheduleUpdateOnFiber (SyncLane)
// 3. performSyncWorkOnRoot （立即同步执行）
// 4. renderRootSync （不可中断）
// 5. commitRoot
// 6. 界面更新
```

### 场景 2：并发更新（Concurrent Mode）

```javascript
// 用户输入（Concurrent Mode）
function handleInput(e) {
  // startTransition 标记为低优先级更新
  startTransition(() => {
    setSearchResults(search(e.target.value));
  });
}

// 流程：
// 1. setState (TransitionLane)
// 2. scheduleUpdateOnFiber
// 3. scheduleCallback (LowPriority)
// 4. MessageChannel 调度
// 5. performConcurrentWorkOnRoot （可中断）
// 6. 时间切片执行
// 7. commitRoot
```

### 场景 3：紧急更新打断低优先级更新

```javascript
// 时间线：
时间 0ms: 开始处理低优先级更新（搜索结果）
时间 2ms: 用户点击按钮（高优先级）
  → 打断当前更新
  → 优先处理点击事件
  → 完成后继续处理搜索结果
```

---

## 环境检测与 API 选择流程图

```
开始调度
    ↓
┌─────────────────────────────┐
│ 检查是否是 Node.js 环境      │
│ typeof setImmediate         │
└─────────────────────────────┘
    │ Yes          │ No
    ↓              ↓
使用 setImmediate   检查 MessageChannel
    ↓              ↓
               ┌─────────────────────────────┐
               │ typeof MessageChannel       │
               └─────────────────────────────┘
                   │ Yes          │ No
                   ↓              ↓
           使用 MessageChannel   使用 setTimeout
           （浏览器首选）        （降级方案）
                   ↓              ↓
               port.postMessage   setTimeout(fn, 0)
```

---

## 关键常量和配置

```javascript
// 时间切片配置
const yieldInterval = 5;  // 每个时间切片 5ms
const maxYieldInterval = 300;  // 最大连续执行时间 300ms

// 优先级超时时间
const IMMEDIATE_PRIORITY_TIMEOUT = -1;          // 立即
const USER_BLOCKING_PRIORITY_TIMEOUT = 250;     // 250ms
const NORMAL_PRIORITY_TIMEOUT = 5000;           // 5秒
const LOW_PRIORITY_TIMEOUT = 10000;             // 10秒
const IDLE_PRIORITY_TIMEOUT = maxSigned31BitInt;// 约 12 天

// Lanes（React 18 的优先级系统）
const SyncLane = 0b0000000000000000000000000000001;
const InputContinuousLane = 0b0000000000000000000000000000100;
const DefaultLane = 0b0000000000000000000000000010000;
const TransitionLane = 0b0000000000000000000001000000000;
const IdleLane = 0b0100000000000000000000000000000;
```

---

## 总结

### 核心流程

```
点击事件
  → 合成事件处理
  → setState 创建 Update
  → scheduleUpdateOnFiber
  → ensureRootIsScheduled
  → Scheduler.scheduleCallback
  → 选择调度 API (MessageChannel/setImmediate/setTimeout)
  → performWorkUntilDeadline
  → workLoop 时间切片执行
  → performConcurrentWorkOnRoot
  → Render 阶段（协调）
  → Commit 阶段（提交）
  → 浏览器绘制
```

### 不同环境的调度 API

| 环境 | 首选 API | 原因 | 降级方案 |
|------|---------|------|---------|
| **浏览器** | MessageChannel | 宏任务、无节流、性能好 | setTimeout |
| **Node.js** | setImmediate | 专为异步回调设计 | setTimeout |
| **旧浏览器** | setTimeout | 兼容性最好 | - |

### 为什么不用 requestIdleCallback？

1. ❌ 浏览器兼容性差
2. ❌ 执行时机不可控（可能很久不执行）
3. ❌ 不支持优先级
4. ❌ 帧率限制

### React 自定义调度的优势

1. ✅ 跨平台兼容
2. ✅ 支持优先级调度
3. ✅ 可中断和恢复
4. ✅ 时间切片（5ms）
5. ✅ 更精确的控制

---

**参考资料：**

- [React Scheduler 源码](https://github.com/facebook/react/tree/main/packages/scheduler)
- [MessageChannel API](https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel)
- [React 18 并发特性](https://react.dev/blog/2022/03/29/react-v18)
