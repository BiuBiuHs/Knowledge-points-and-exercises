# Web Worker 通信原理

## 一、什么是 Web Worker

Web Worker 是浏览器提供的一个 API，用于在**后台线程**中运行 JavaScript 代码，不会阻塞主线程。

### 1.1 核心特点

- 🔄 **独立线程**：在单独的线程中运行，不阻塞主线程
- 🚫 **无法访问 DOM**：不能操作 DOM、window 对象
- 💬 **通过消息通信**：与主线程通过 `postMessage` 通信
- 📦 **数据复制**：数据传递是复制，不是共享（除了 Transferable 对象）

---

## 二、Web Worker 如何通信

### 2.1 基本通信方式

#### 主线程代码

```javascript
// 创建 Worker
const worker = new Worker('worker.js');

// 监听 Worker 发来的消息
worker.onmessage = (event) => {
  console.log('主线程收到:', event.data);
};

// 向 Worker 发送消息
worker.postMessage('Hello Worker');

// 错误处理
worker.onerror = (error) => {
  console.error('Worker 错误:', error);
};
```

#### Worker 文件 (worker.js)

```javascript
// 监听主线程发来的消息
self.onmessage = (event) => {
  console.log('Worker 收到:', event.data);
  
  // 向主线程发送消息
  self.postMessage('Hello Main Thread');
};
```

### 2.2 通信流程图

```
主线程                        Worker 线程
  │                              │
  │ worker.postMessage('hello')  │
  ├──────────────────────────────→
  │                              │
  │                    处理消息  │
  │                              │
  │  self.postMessage('reply')   │
  ←──────────────────────────────┤
  │                              │
worker.onmessage 触发           │
```

---

## 三、Web Worker 的三种通信方式

### 3.1 方式一：基本的 postMessage（数据复制）

```javascript
// 主线程
const worker = new Worker('worker.js');

const data = {
  name: 'React',
  version: 18,
  items: [1, 2, 3, 4, 5]
};

// 发送数据（会被复制）
worker.postMessage(data);

// 修改原始数据不影响 Worker 中的数据
data.name = 'Vue';  // Worker 中的 data.name 还是 'React'

// worker.js
self.onmessage = (event) => {
  const data = event.data;  // 这是一个副本
  console.log(data.name);   // 'React'
  
  // 修改不会影响主线程
  data.name = 'Angular';
};
```

**特点：**

- ✅ 简单易用
- ❌ 数据被复制，大数据量时性能差
- ❌ 内存占用翻倍

### 3.2 方式二：Transferable Objects（转移所有权）

```javascript
// 主线程
const worker = new Worker('worker.js');

// 创建一个大的 ArrayBuffer
const buffer = new ArrayBuffer(1024 * 1024 * 10);  // 10MB
console.log('转移前:', buffer.byteLength);  // 10485760

// 转移所有权给 Worker（第二个参数是要转移的对象数组）
worker.postMessage({ buffer }, [buffer]);

console.log('转移后:', buffer.byteLength);  // 0（所有权已转移）
// 主线程无法再访问这个 buffer

// worker.js
self.onmessage = (event) => {
  const buffer = event.data.buffer;
  console.log('Worker 收到:', buffer.byteLength);  // 10485760
  
  // Worker 现在拥有这个 buffer 的所有权
  // 可以直接操作，不需要复制
};
```

**可转移的对象类型：**

- `ArrayBuffer`
- `MessagePort`
- `ImageBitmap`
- `OffscreenCanvas`

**特点：**

- ✅ 零复制，性能高
- ✅ 内存占用不增加
- ❌ 转移后原线程无法访问

### 3.3 方式三：SharedArrayBuffer（共享内存）

```javascript
// 主线程
const worker = new Worker('worker.js');

// 创建共享内存
const sharedBuffer = new SharedArrayBuffer(1024);
const sharedArray = new Int32Array(sharedBuffer);

// 初始化数据
sharedArray[0] = 100;

// 发送共享内存（不会被复制，两边共享）
worker.postMessage({ sharedBuffer });

// 主线程可以继续访问和修改
setTimeout(() => {
  console.log('主线程读取:', sharedArray[0]);  // Worker 可能已经修改了
}, 1000);

// worker.js
self.onmessage = (event) => {
  const sharedBuffer = event.data.sharedBuffer;
  const sharedArray = new Int32Array(sharedBuffer);
  
  // 读取主线程设置的值
  console.log('Worker 读取:', sharedArray[0]);  // 100
  
  // 修改共享内存（主线程可以看到）
  sharedArray[0] = 200;
};
```

**特点：**

- ✅ 真正的共享内存
- ✅ 性能最高
- ⚠️ 需要处理并发问题
- ⚠️ 浏览器兼容性较差

---

## 四、使用 MessageChannel 增强 Worker 通信

### 4.1 为什么要用 MessageChannel？

基本的 `postMessage` 只能实现主线程和 Worker 之间的通信，如果需要：

- 多个组件与同一个 Worker 通信
- 多个 Worker 之间通信
- 更灵活的通信模式

就需要使用 MessageChannel。

### 4.2 主线程通过 MessageChannel 与 Worker 通信

```javascript
// 主线程
const worker = new Worker('worker.js');

// 创建消息通道
const channel = new MessageChannel();

// 主线程监听 port1
channel.port1.onmessage = (event) => {
  console.log('主线程通过 channel 收到:', event.data);
};

// 将 port2 发送给 Worker（转移所有权）
worker.postMessage(
  { port: channel.port2 },
  [channel.port2]  // 转移 port2 的所有权
);

// 通过 channel.port1 发送消息
channel.port1.postMessage('Hello from Main Thread via Channel');

// worker.js
self.onmessage = (event) => {
  const port = event.data.port;
  
  // Worker 监听 port
  port.onmessage = (event) => {
    console.log('Worker 通过 channel 收到:', event.data);
    
    // 回复消息
    port.postMessage('Hello from Worker via Channel');
  };
};
```

### 4.3 两个 Worker 之间通信

```javascript
// 主线程
const worker1 = new Worker('worker1.js');
const worker2 = new Worker('worker2.js');

// 创建消息通道
const channel = new MessageChannel();

// 将 port1 发送给 worker1
worker1.postMessage({ port: channel.port1 }, [channel.port1]);

// 将 port2 发送给 worker2
worker2.postMessage({ port: channel.port2 }, [channel.port2]);

// 现在 worker1 和 worker2 可以直接通信，不经过主线程

// worker1.js
self.onmessage = (event) => {
  const port = event.data.port;
  
  // 发送消息给 worker2
  port.postMessage('Hello from Worker1');
  
  // 监听 worker2 的消息
  port.onmessage = (event) => {
    console.log('Worker1 收到:', event.data);
  };
};

// worker2.js
self.onmessage = (event) => {
  const port = event.data.port;
  
  // 监听 worker1 的消息
  port.onmessage = (event) => {
    console.log('Worker2 收到:', event.data);
    
    // 回复 worker1
    port.postMessage('Hello from Worker2');
  };
};
```

### 4.4 通信模式对比

```
方式 1: 基本 postMessage
主线程 ←→ Worker

方式 2: MessageChannel
主线程 ←→ Worker
  ↓         ↓
port1  ←→  port2

方式 3: 多 Worker 通信
Worker1 ←→ Worker2
   ↓           ↓
 port1  ←→  port2
   
主线程（不参与通信）
```

---

## 五、Web Worker 的应用场景

### 5.1 大量计算

```javascript
// 主线程
const worker = new Worker('calculate.js');

worker.onmessage = (event) => {
  console.log('计算结果:', event.data);
};

// 发送大量数据进行计算
worker.postMessage({ numbers: Array(1000000).fill(0).map((_, i) => i) });

// calculate.js
self.onmessage = (event) => {
  const numbers = event.data.numbers;
  
  // 执行耗时计算（不会阻塞主线程）
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  const avg = sum / numbers.length;
  
  self.postMessage({ sum, avg });
};
```

### 5.2 数据处理

```javascript
// 主线程
const worker = new Worker('dataProcessor.js');

worker.onmessage = (event) => {
  const processedData = event.data;
  updateUI(processedData);
};

// 发送大量数据进行处理
fetch('/api/large-data')
  .then(res => res.json())
  .then(data => {
    worker.postMessage({ data });
  });

// dataProcessor.js
self.onmessage = (event) => {
  const data = event.data.data;
  
  // 数据清洗、转换、过滤等
  const processed = data
    .filter(item => item.isValid)
    .map(item => ({
      ...item,
      processed: true,
      timestamp: Date.now()
    }))
    .sort((a, b) => b.value - a.value);
  
  self.postMessage(processed);
};
```

### 5.3 实时数据处理

```javascript
// 主线程
const worker = new Worker('realtime.js');

// 监听 WebSocket 数据
const ws = new WebSocket('wss://api.example.com');

ws.onmessage = (event) => {
  // 将数据发送给 Worker 处理
  worker.postMessage({ data: event.data });
};

worker.onmessage = (event) => {
  // 更新 UI
  updateChart(event.data);
};

// realtime.js
self.onmessage = (event) => {
  const rawData = event.data.data;
  
  // 实时数据处理
  const processed = processRealTimeData(rawData);
  
  self.postMessage(processed);
};
```

---

## 六、Web Worker vs MessageChannel

### 6.1 对比表格

| 特性 | Web Worker | MessageChannel |
|------|-----------|----------------|
| **用途** | 多线程执行 | 消息通道 |
| **运行环境** | 独立线程 | 当前线程 |
| **能否访问 DOM** | ❌ 不能 | ✅ 能 |
| **阻塞主线程** | ❌ 不阻塞 | ✅ 会阻塞（如果回调耗时） |
| **通信方式** | postMessage | postMessage |
| **应用场景** | 耗时计算、大数据处理 | 异步调度、消息传递 |

### 6.2 组合使用

```javascript
// Web Worker 内部使用 MessageChannel 进行任务调度

// worker.js
const channel = new MessageChannel();

// 监听主线程任务
self.onmessage = (event) => {
  const task = event.data;
  
  // 将任务放入 channel 进行调度
  channel.port2.postMessage(task);
};

// 通过 channel 执行任务（时间切片）
channel.port1.onmessage = (event) => {
  const task = event.data;
  const startTime = performance.now();
  
  // 执行 5ms 的任务
  while (shouldContinue && performance.now() - startTime < 5) {
    processTask(task);
  }
  
  if (taskNotComplete) {
    // 继续调度
    channel.port2.postMessage(task);
  } else {
    // 任务完成，通知主线程
    self.postMessage({ result: task.result });
  }
};
```

---

## 七、React 为什么不用 Web Worker？

### 7.1 原因分析

**1. 无法访问 DOM**

```javascript
// Worker 中不能这样做：
document.getElementById('root');  // ❌ 报错
document.createElement('div');    // ❌ 报错
```

React 需要操作 DOM，所以不能在 Worker 中运行主要逻辑。

**2. 通信开销**

```javascript
// 每次更新都需要通信
主线程: 状态变化 → Worker
Worker: 计算 VirtualDOM → 主线程
主线程: 更新真实 DOM
```

频繁通信的开销可能大于直接计算。

**3. 调试困难**

- Worker 中的错误难以调试
- 无法使用 React DevTools

**4. 复杂度增加**

- 需要维护主线程和 Worker 的状态同步
- 增加代码复杂度

### 7.2 React 的选择

React 选择在**主线程**使用：

- ✅ **时间切片**（通过 MessageChannel）
- ✅ **优先级调度**（通过 Scheduler）
- ✅ **可中断更新**（通过 Fiber）

这样可以：

- 直接访问 DOM
- 无通信开销
- 保持简单性

### 7.3 什么时候用 Web Worker？

适合用 Web Worker 的场景：

- ✅ 纯计算任务（不涉及 DOM）
- ✅ 大数据处理
- ✅ 图像/音视频处理
- ✅ 加密/解密
- ✅ 复杂算法

不适合用 Web Worker 的场景：

- ❌ 需要频繁操作 DOM
- ❌ 需要频繁与主线程通信
- ❌ 简单计算（通信开销大于计算开销）

---

## 八、完整示例：图片处理

```javascript
// 主线程
const worker = new Worker('imageProcessor.js');

// 加载图片
const img = new Image();
img.src = 'photo.jpg';

img.onload = () => {
  // 获取图片数据
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  // 发送给 Worker 处理（转移所有权，提高性能）
  worker.postMessage(
    {
      imageData: imageData.data.buffer,
      width: canvas.width,
      height: canvas.height
    },
    [imageData.data.buffer]  // 转移 ArrayBuffer
  );
};

// 接收处理结果
worker.onmessage = (event) => {
  const { buffer, width, height } = event.data;
  
  // 显示处理后的图片
  const canvas = document.getElementById('output');
  const ctx = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;
  
  const imageData = new ImageData(
    new Uint8ClampedArray(buffer),
    width,
    height
  );
  ctx.putImageData(imageData, 0, 0);
};

// imageProcessor.js
self.onmessage = (event) => {
  const { imageData, width, height } = event.data;
  const data = new Uint8ClampedArray(imageData);
  
  // 图片处理：灰度化
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg;      // R
    data[i + 1] = avg;  // G
    data[i + 2] = avg;  // B
    // data[i + 3] 是 alpha，不变
  }
  
  // 返回处理结果（转移所有权）
  self.postMessage(
    {
      buffer: data.buffer,
      width,
      height
    },
    [data.buffer]
  );
};
```

---

## 九、总结

### Web Worker 的核心特点

1. **独立线程**：不阻塞主线程
2. **消息通信**：通过 postMessage 通信
3. **无法访问 DOM**：只能做纯计算
4. **数据传递方式**：
   - 复制（默认）
   - 转移（Transferable）
   - 共享（SharedArrayBuffer）

### MessageChannel 的作用

- 提供灵活的消息通道
- 支持多对多通信
- 可以在 Worker 之间传递

### React 的选择

- ✅ 主线程 + MessageChannel + 时间切片
- ❌ 不用 Web Worker（因为需要操作 DOM）

### 简单记忆

```
Web Worker = 雇佣的工人，在另一个房间干活
MessageChannel = 对讲机，用于通信

React = 自己干活 + 对讲机调度（不雇工人）
适合用 Worker = 搬砖、算账（纯体力/脑力活）
不适合用 Worker = 装修房子（需要直接操作 DOM）
```
