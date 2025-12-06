# MessageChannel 通信原理

## 一、什么是 MessageChannel

`MessageChannel` 是浏览器提供的一个 Web API，用于**创建一个消息通道**，实现异步通信。

### 基本概念

```javascript
const channel = new MessageChannel();

// MessageChannel 创建后，会有两个端口：
channel.port1  // 端口1
channel.port2  // 端口2

// 这两个端口可以互相发送消息
```

**核心特点：**

- 创建后会自动生成 **两个端口** (`port1` 和 `port2`)
- 两个端口之间可以**互相通信**
- 消息传递是**异步**的（宏任务）

---

## 二、MessageChannel 如何通信

### 2.1 基本通信模式

```javascript
// 创建通道
const channel = new MessageChannel();
const port1 = channel.port1;
const port2 = channel.port2;

// port1 监听消息
port1.onmessage = (event) => {
  console.log('port1 收到消息:', event.data);
};

// port2 发送消息给 port1
port2.postMessage('Hello from port2');

// 输出：port1 收到消息: Hello from port2
```

### 2.2 双向通信

```javascript
const channel = new MessageChannel();
const port1 = channel.port1;
const port2 = channel.port2;

// port1 监听并回复
port1.onmessage = (event) => {
  console.log('port1 收到:', event.data);
  port1.postMessage('port1 收到了你的消息');
};

// port2 监听并发送
port2.onmessage = (event) => {
  console.log('port2 收到:', event.data);
};

port2.postMessage('Hello from port2');

// 输出：
// port1 收到: Hello from port2
// port2 收到: port1 收到了你的消息
```

### 2.3 通信流程图

```
创建 MessageChannel
        ↓
    ┌───────┐
    │Channel│
    └───┬───┘
        │
    ┌───┴────┐
    │        │
  port1    port2
    │        │
    │        │ postMessage('hello')
    │ ←──────┤
    │        │
onmessage    │
 触发        │
    │        │
    │ ───────→ postMessage('回复')
    │        │
    │     onmessage
    │      触发
```

---

## 三、MessageChannel 的特性

### 3.1 异步执行（宏任务）

```javascript
console.log('1');

const channel = new MessageChannel();
channel.port1.onmessage = () => {
  console.log('3 - MessageChannel');
};

Promise.resolve().then(() => {
  console.log('2 - Promise 微任务');
});

channel.port2.postMessage('trigger');

console.log('4');

// 输出顺序：
// 1
// 4
// 2 - Promise 微任务
// 3 - MessageChannel
```

**原因：**

- `postMessage` 触发的消息是**宏任务**
- Promise 是**微任务**
- 执行顺序：同步代码 → 微任务 → 宏任务

### 3.2 不会阻塞主线程

```javascript
const channel = new MessageChannel();

channel.port1.onmessage = () => {
  console.log('消息处理');
  // 执行一些耗时操作
};

// 立即返回，不阻塞
channel.port2.postMessage('start');

console.log('继续执行其他代码');

// 输出：
// 继续执行其他代码
// 消息处理
```

### 3.3 可以传递各种数据类型

```javascript
const channel = new MessageChannel();

channel.port1.onmessage = (event) => {
  console.log(event.data);
};

// 发送字符串
channel.port2.postMessage('字符串');

// 发送对象
channel.port2.postMessage({ name: 'React', version: 18 });

// 发送数组
channel.port2.postMessage([1, 2, 3]);

// 发送函数（会被转换为 undefined）
channel.port2.postMessage(() => {});  // 输出: undefined
```

**注意：**

- 函数不能直接传递（会变成 `undefined`）
- 使用**结构化克隆算法**传递数据

---

## 四、React 中如何使用 MessageChannel

### 4.1 React 的使用场景

React 用 MessageChannel 来实现**时间切片调度**：

```javascript
// React Scheduler 的实现（简化版）
const channel = new MessageChannel();
const port1 = channel.port1;
const port2 = channel.port2;

// 监听消息，执行工作
port1.onmessage = performWorkUntilDeadline;

// 调度工作
function schedulePerformWorkUntilDeadline() {
  port2.postMessage(null);  // 触发异步执行
}

// 执行工作直到时间片用尽
function performWorkUntilDeadline() {
  const currentTime = performance.now();
  const deadline = currentTime + 5;  // 5ms 时间片
  
  let hasMoreWork = true;
  
  while (hasMoreWork && performance.now() < deadline) {
    hasMoreWork = doWork();  // 执行一个工作单元
  }
  
  if (hasMoreWork) {
    // 还有工作，继续调度
    schedulePerformWorkUntilDeadline();
  }
}
```

### 4.2 为什么 React 使用 MessageChannel？

**对比其他方案：**

| 方案 | 优点 | 缺点 | React 是否使用 |
|------|------|------|----------------|
| `setTimeout(fn, 0)` | 简单 | 最小延迟 4ms，不够精确 | ❌ |
| `requestIdleCallback` | 浏览器空闲时执行 | Safari 不支持，执行时机不可控 | ❌ |
| `requestAnimationFrame` | 每帧执行一次 | 页面不可见时不执行 | ❌ |
| `MessageChannel` | 执行快速，兼容性好 | 需要手动控制 | ✅ |

**React 选择 MessageChannel 的原因：**

1. **执行速度快**：比 `setTimeout(0)` 快，没有 4ms 延迟
2. **兼容性好**：主流浏览器都支持
3. **可控性强**：可以精确控制执行时机
4. **不依赖浏览器渲染**：页面不可见时也能执行

### 4.3 完整的 React Scheduler 示例

```javascript
// 模拟 React Scheduler
let scheduledHostCallback = null;
let isMessageLoopRunning = false;
const frameInterval = 5;  // 5ms 时间片

// 创建 MessageChannel
const channel = new MessageChannel();
const port1 = channel.port1;
const port2 = channel.port2;

// 监听消息
port1.onmessage = () => {
  if (scheduledHostCallback !== null) {
    const currentTime = performance.now();
    const deadline = currentTime + frameInterval;
    
    let hasMoreWork = true;
    
    try {
      // 执行回调，直到时间片用尽
      hasMoreWork = scheduledHostCallback(currentTime, deadline);
    } finally {
      if (hasMoreWork) {
        // 还有工作，继续调度
        schedulePerformWorkUntilDeadline();
      } else {
        // 工作完成
        isMessageLoopRunning = false;
        scheduledHostCallback = null;
      }
    }
  } else {
    isMessageLoopRunning = false;
  }
};

// 调度函数
function schedulePerformWorkUntilDeadline() {
  if (!isMessageLoopRunning) {
    isMessageLoopRunning = true;
    port2.postMessage(null);  // 触发异步执行
  }
}

// 调度回调
function scheduleCallback(callback) {
  scheduledHostCallback = callback;
  schedulePerformWorkUntilDeadline();
}

// 使用示例
let workIndex = 0;
const totalWork = 100;

function doWork(currentTime, deadline) {
  // 执行工作，直到时间片用尽
  while (workIndex < totalWork && performance.now() < deadline) {
    console.log(`处理工作 ${workIndex}`);
    workIndex++;
    
    // 模拟耗时操作
    let sum = 0;
    for (let i = 0; i < 1000000; i++) {
      sum += i;
    }
  }
  
  // 返回是否还有工作
  return workIndex < totalWork;
}

// 开始调度
scheduleCallback(doWork);
```

---

## 五、MessageChannel vs 其他异步 API

### 5.1 对比表格

| 特性 | MessageChannel | setTimeout | setImmediate | requestIdleCallback |
|------|----------------|------------|--------------|---------------------|
| 执行时机 | 下一个事件循环 | 最小 4ms 后 | 下一个事件循环 | 浏览器空闲时 |
| 浏览器支持 | ✅ 好 | ✅ 好 | ❌ Node.js only | ⚠️ Safari 不支持 |
| 精确度 | ✅ 高 | ❌ 低 | ✅ 高 | ⚠️ 不确定 |
| React 使用 | ✅ | ❌ | ❌ | ❌ |

### 5.2 代码对比

```javascript
// 1. MessageChannel - 快速执行
const channel = new MessageChannel();
channel.port1.onmessage = () => console.log('MessageChannel');
channel.port2.postMessage(null);

// 2. setTimeout - 最小延迟 4ms
setTimeout(() => console.log('setTimeout 0'), 0);

// 3. Promise - 微任务，最快
Promise.resolve().then(() => console.log('Promise'));

console.log('同步代码');

// 输出顺序：
// 同步代码
// Promise (微任务最先)
// MessageChannel (宏任务，比 setTimeout 快)
// setTimeout 0 (最慢，有 4ms 延迟)
```

---

## 六、实际应用场景

### 6.1 任务分片

```javascript
// 将大任务分片执行，避免阻塞主线程
function performLargeTask(tasks) {
  const channel = new MessageChannel();
  let index = 0;
  
  channel.port1.onmessage = () => {
    const startTime = performance.now();
    
    // 执行 5ms 的工作
    while (index < tasks.length && performance.now() - startTime < 5) {
      tasks[index]();
      index++;
    }
    
    if (index < tasks.length) {
      // 还有任务，继续调度
      channel.port2.postMessage(null);
    } else {
      console.log('所有任务完成');
    }
  };
  
  // 开始执行
  channel.port2.postMessage(null);
}

// 使用
const tasks = Array(1000).fill(null).map((_, i) => () => {
  console.log(`任务 ${i}`);
});

performLargeTask(tasks);
```

### 6.2 Web Worker 通信

```javascript
// 主线程
const worker = new Worker('worker.js');
const channel = new MessageChannel();

// 将 port2 发送给 Worker
worker.postMessage({ port: channel.port2 }, [channel.port2]);

// 主线程通过 port1 通信
channel.port1.onmessage = (event) => {
  console.log('主线程收到:', event.data);
};

channel.port1.postMessage('Hello Worker');

// worker.js
self.onmessage = (event) => {
  const port = event.data.port;
  
  port.onmessage = (event) => {
    console.log('Worker 收到:', event.data);
    port.postMessage('Hello Main Thread');
  };
};
```

---

## 七、总结

### MessageChannel 的核心特点

1. **创建双向通道**：自动生成 port1 和 port2
2. **异步通信**：消息传递是异步的（宏任务）
3. **不阻塞主线程**：适合实现时间切片
4. **执行速度快**：比 setTimeout 快，没有 4ms 延迟

### React 为什么用它

- ✅ 速度快，精确度高
- ✅ 兼容性好
- ✅ 可以精确控制执行时机
- ✅ 适合实现时间切片调度

### 简单记忆

```
MessageChannel = 两个对讲机 (port1 和 port2)
- port2 喊话 → port1 听到 (异步)
- port1 喊话 → port2 听到 (异步)
- 用于实现异步通信和任务调度
```
