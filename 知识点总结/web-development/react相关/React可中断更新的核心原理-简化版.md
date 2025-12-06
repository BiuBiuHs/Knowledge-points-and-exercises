# React 可中断更新的核心原理（简化版）

## 三个核心问题

### 问题 1：如何知道当前更新到哪个节点了？

**答案：使用全局变量 `workInProgress` 保存当前正在处理的 Fiber 节点**

```javascript
// ReactFiberWorkLoop.js
let workInProgress = null;  // 全局变量，指向当前正在处理的 Fiber 节点

function workLoopConcurrent() {
  // 只要 workInProgress 不为 null，就继续处理
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(unitOfWork) {
  // unitOfWork 就是当前要处理的节点
  const current = unitOfWork.alternate;
  
  // 处理当前节点
  const next = beginWork(current, unitOfWork);
  
  if (next === null) {
    // 没有子节点了，处理兄弟节点或返回父节点
    completeUnitOfWork(unitOfWork);
  } else {
    // 有子节点，继续处理子节点
    workInProgress = next;  // ⭐️ 更新全局变量
  }
}
```

**简单理解：**

- `workInProgress` 就像一个"书签"，标记着当前读到哪一页了
- 每处理完一个节点，就把 `workInProgress` 更新为下一个要处理的节点

---

### 问题 2：中断时如何保存状态？

**答案：不需要特殊保存！因为 `workInProgress` 变量本身就保存了进度**

```javascript
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
  
  // 如果这里 shouldYield() 返回 true（时间片用完）
  // 循环就会中断，但是 workInProgress 变量还在！
  // workInProgress 指向的就是下一个要处理的节点
}
```

**示例流程：**

```
初始状态：
workInProgress = App (根节点)

第一次时间片：
处理 App → workInProgress = Header
处理 Header → workInProgress = Nav
处理 Nav → workInProgress = Content
【时间片用完，中断！】
此时 workInProgress = Content （保存了进度）

用户点击，处理高优先级任务...

第二次时间片：
从 workInProgress = Content 继续
处理 Content → workInProgress = Footer
处理 Footer → workInProgress = null
【完成！】
```

**关键点：**

- `workInProgress` 是 **JavaScript 变量**，不会因为函数返回而消失
- 中断时，`workInProgress` 自动保存了"当前进度"
- 下次调度时，直接从 `workInProgress` 继续

---

### 问题 3：中断后如何继续调度？

**答案：返回一个 continuation 函数，告诉调度器"我还没完成"**

```javascript
// scheduler/src/Scheduler.js
function workLoop(hasTimeRemaining, initialTime) {
  let currentTask = peek(taskQueue);  // 获取当前任务
  
  while (currentTask !== null) {
    const callback = currentTask.callback;
    
    if (typeof callback === 'function') {
      // 执行任务
      const continuationCallback = callback();
      
      if (typeof continuationCallback === 'function') {
        // ⭐️ 返回了 continuation，说明任务没完成
        currentTask.callback = continuationCallback;
        // 不从队列移除，下次继续执行
      } else {
        // 任务完成，从队列移除
        pop(taskQueue);
      }
    }
    
    currentTask = peek(taskQueue);
  }
  
  // 如果还有任务，返回 true，继续调度
  return currentTask !== null;
}
```

**React 的实现：**

```javascript
// ReactFiberWorkLoop.js
function performConcurrentWorkOnRoot(root) {
  // 开始渲染
  renderRootConcurrent(root);
  
  if (workInProgress !== null) {
    // ⭐️ workInProgress 不为 null，说明还没完成
    // 返回自己（continuation），告诉调度器继续调度
    return performConcurrentWorkOnRoot.bind(null, root);
  } else {
    // workInProgress 为 null，说明完成了
    // 提交到 DOM
    commitRoot(root);
    return null;  // 返回 null，告诉调度器任务完成
  }
}
```

---

## 完整流程图

```
【第一次调度】
调度器调用：performConcurrentWorkOnRoot(root)
    ↓
workLoopConcurrent() 开始执行
    ↓
workInProgress = App
    ↓ 处理 App
workInProgress = Header  
    ↓ 处理 Header
workInProgress = Nav
    ↓ 处理 Nav
workInProgress = Content
    ↓
【shouldYield() = true，时间片用完】
退出循环，workInProgress = Content (保存进度)
    ↓
返回 continuation: performConcurrentWorkOnRoot.bind(null, root)
    ↓
调度器：收到 continuation，知道任务未完成
    ↓
【用户点击，高优先级任务...】
    ↓
【第二次调度】
调度器再次调用：performConcurrentWorkOnRoot(root)
    ↓
workLoopConcurrent() 继续执行
    ↓
从 workInProgress = Content 继续
    ↓ 处理 Content
workInProgress = Footer
    ↓ 处理 Footer
workInProgress = null (所有节点处理完)
    ↓
退出循环
    ↓
返回 null（任务完成）
    ↓
调度器：收到 null，知道任务完成，不再调度
```

---

## 核心代码（最精简版）

```javascript
// 1. 全局变量保存当前节点
let workInProgress = null;

// 2. 工作循环
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    // 处理一个节点
    performUnitOfWork(workInProgress);
    // performUnitOfWork 内部会更新 workInProgress 为下一个节点
  }
  // 中断时，workInProgress 自动保存了进度
}

// 3. 执行工作
function performConcurrentWorkOnRoot(root) {
  // 执行工作循环
  workLoopConcurrent();
  
  // 检查是否完成
  if (workInProgress !== null) {
    // 没完成，返回 continuation
    return performConcurrentWorkOnRoot.bind(null, root);
  }
  
  // 完成了，返回 null
  return null;
}

// 4. 调度器处理 continuation
function scheduleWork() {
  const task = {
    callback: performConcurrentWorkOnRoot.bind(null, root)
  };
  
  // 执行任务
  const continuation = task.callback();
  
  if (continuation) {
    // 还没完成，更新 callback，下次继续
    task.callback = continuation;
    scheduleWork();  // 继续调度
  } else {
    // 完成了
    console.log('任务完成');
  }
}
```

---

## 举个生活中的例子

**问题 1：如何知道读到哪了？**

- 答：用书签（`workInProgress` 变量）

**问题 2：如何保存进度？**

- 答：书签夹在书里，不会丢（变量在内存中）

**问题 3：如何继续读？**

- 答：下次打开书，从书签处继续读（调度器调用 continuation）

---

## 总结

| 问题 | 答案 | 实现方式 |
|------|------|----------|
| 如何知道当前进度？ | 全局变量 `workInProgress` | 指向当前处理的 Fiber 节点 |
| 如何保存状态？ | 不需要特殊保存 | `workInProgress` 变量自动保存 |
| 如何继续调度？ | 返回 continuation 函数 | 告诉调度器"我还没完成" |

**关键点：**

1. `workInProgress` 是一个**全局变量**，保存当前节点
2. 中断时，`workInProgress` 不会消失，自动保存进度
3. 通过返回 continuation 函数，让调度器知道任务未完成
4. 下次调度时，从 `workInProgress` 继续执行

这就是 React 可中断更新的核心原理！
