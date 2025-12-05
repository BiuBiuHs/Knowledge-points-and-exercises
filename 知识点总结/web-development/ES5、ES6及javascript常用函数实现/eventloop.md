# 浏览器与 Node.js 事件循环详解

## 一、浏览器中的事件循环（Event Loop）

### 1.1 基本概念

浏览器的事件循环是 JavaScript 引擎处理异步操作的核心机制。它基于**单线程**模型，通过事件循环来实现非阻塞的异步操作。

### 1.2 执行机制

浏览器事件循环的执行顺序：

1. **执行同步代码**
   - 首先执行所有同步代码，直到调用栈清空

2. **执行微任务（Microtasks）**
   - 清空微任务队列中的所有任务
   - 微任务包括：
     - `Promise.then()`, `Promise.catch()`, `Promise.finally()` 回调
     - `queueMicrotask()` 回调
     - `MutationObserver` 回调
     - `async/await` 中的代码（本质是 Promise）

3. **执行宏任务（Macrotasks/Tasks）**
   - 执行一个宏任务
   - 宏任务包括：
     - `setTimeout`, `setInterval` 回调
     - `setImmediate`（非标准，仅部分浏览器支持）
     - I/O 操作回调
     - `postMessage` 消息
     - `MessageChannel` 消息
     - UI 渲染（浏览器自动执行）

4. **重复步骤 2 和 3**
   - 执行完一个宏任务后，再次检查并清空微任务队列
   - 然后再执行下一个宏任务
   - 这个过程不断重复，形成事件循环

### 1.3 执行顺序示例

```javascript
console.log('1'); // 同步代码

setTimeout(() => {
    console.log('2'); // 宏任务
    Promise.resolve().then(() => {
        console.log('3'); // 微任务（在宏任务内部）
    });
}, 0);

Promise.resolve().then(() => {
    console.log('4'); // 微任务
});

console.log('5'); // 同步代码

// 输出顺序：1, 5, 4, 2, 3
```

**执行过程：**

1. 执行同步代码，打印 '1' 和 '5'
2. 遇到 `setTimeout`，将其回调放入宏任务队列
3. 遇到 `Promise.resolve().then()`，将其回调放入微任务队列
4. 同步代码执行完毕，检查微任务队列，执行 Promise 回调，打印 '4'
5. 微任务队列清空后，执行下一个宏任务（setTimeout 回调），打印 '2'
6. 在 setTimeout 回调中遇到 Promise，将其回调放入微任务队列
7. 宏任务执行完毕，检查微任务队列，执行 Promise 回调，打印 '3'

### 1.4 requestAnimationFrame 的特殊性

`requestAnimationFrame` 的回调执行时机比较特殊，它会在**浏览器下一次重绘之前**执行，通常在每个事件循环的末尾，但在渲染之前。

```javascript
console.log('1');

setTimeout(() => {
    console.log('2');
}, 0);

requestAnimationFrame(() => {
    console.log('3');
});

Promise.resolve().then(() => {
    console.log('4');
});

console.log('5');

// 输出顺序：1, 5, 4, 3, 2
// 或者：    1, 5, 4, 2, 3（取决于浏览器实现）
```

### 1.5 浏览器事件循环的特点

- **单线程执行**：JavaScript 代码在单线程中执行
- **微任务优先**：微任务队列会在每个宏任务执行后立即清空
- **UI 渲染时机**：UI 渲染通常发生在宏任务之间
- **任务队列分离**：宏任务和微任务使用不同的队列

---

## 二、Node.js 中的事件循环

### 2.1 基本概念

Node.js 的事件循环基于 **libuv** 库实现，它是一个多阶段的循环，专门为 I/O 密集型操作优化。Node.js 的事件循环比浏览器更加复杂和细致。

### 2.2 事件循环的六个阶段

Node.js 的事件循环分为以下六个阶段，每个阶段都有一个回调队列：

#### 阶段 1：定时器（Timers）

- 执行 `setTimeout()` 和 `setInterval()` 的回调
- 检查是否有到期的定时器，执行其回调

#### 阶段 2：待定回调（Pending Callbacks）

- 执行延迟到下一个循环迭代的 I/O 回调
- 处理一些系统级的回调（如 TCP 错误）

#### 阶段 3：空闲、准备（Idle, Prepare）

- 仅系统内部使用
- 为下一个循环迭代做准备

#### 阶段 4：轮询（Poll）

- **最重要的阶段**
- 检索新的 I/O 事件
- 执行与 I/O 相关的回调（文件读取、网络请求等）
- 如果轮询队列为空：
  - 如果有 `setImmediate` 回调，则进入检查阶段
  - 如果没有，则等待新的回调添加到轮询队列

#### 阶段 5：检查（Check）

- 执行 `setImmediate()` 的回调

#### 阶段 6：关闭的回调函数（Close Callbacks）

- 执行一些关闭的回调
- 例如：`socket.on('close', ...)`

### 2.3 微任务队列

在每个阶段之间，Node.js 会检查并执行微任务队列：

1. **nextTick 队列**（优先级最高）
   - `process.nextTick()` 的回调
   - 优先级高于所有其他微任务

2. **Promise 微任务队列**
   - `Promise.then()`, `Promise.catch()`, `Promise.finally()` 回调
   - `async/await` 中的代码

**执行顺序：**

- 在每个阶段结束后，先执行所有 `nextTick` 队列中的回调
- 然后执行所有 Promise 微任务队列中的回调
- 然后才进入下一个阶段

### 2.4 Node.js 事件循环执行顺序示例

```javascript
console.log('1'); // 同步代码

setTimeout(() => {
    console.log('2'); // 定时器阶段
    process.nextTick(() => {
        console.log('3'); // nextTick（在定时器回调内部）
    });
}, 0);

setImmediate(() => {
    console.log('4'); // 检查阶段
});

process.nextTick(() => {
    console.log('5'); // nextTick（优先级最高）
});

Promise.resolve().then(() => {
    console.log('6'); // Promise 微任务
});

console.log('7'); // 同步代码

// 输出顺序：1, 7, 5, 6, 2, 3, 4
```

**执行过程：**

1. 执行同步代码，打印 '1' 和 '7'
2. 遇到 `setTimeout`，将其回调放入定时器队列
3. 遇到 `setImmediate`，将其回调放入检查队列
4. 遇到 `process.nextTick`，将其回调放入 nextTick 队列
5. 遇到 `Promise.resolve().then()`，将其回调放入 Promise 微任务队列
6. 同步代码执行完毕，先执行 nextTick 队列，打印 '5'
7. 执行 Promise 微任务队列，打印 '6'
8. 进入事件循环的定时器阶段，执行 setTimeout 回调，打印 '2'
9. 在 setTimeout 回调中遇到 `process.nextTick`，将其回调放入 nextTick 队列
10. 定时器阶段结束，执行 nextTick 队列，打印 '3'
11. 继续事件循环，进入检查阶段，执行 setImmediate 回调，打印 '4'

### 2.5 setTimeout 和 setImmediate 的执行顺序

`setTimeout` 和 `setImmediate` 的执行顺序可能不确定，取决于当前事件循环的状态：

```javascript
// 情况 1：在主模块中
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));

// 输出顺序不确定，可能是：
// timeout, immediate
// 或者：immediate, timeout
```

```javascript
// 情况 2：在 I/O 回调中
const fs = require('fs');

fs.readFile(__filename, () => {
    setTimeout(() => console.log('timeout'), 0);
    setImmediate(() => console.log('immediate'));
});

// 输出顺序确定：immediate, timeout
// 因为 I/O 回调在轮询阶段执行，执行完后进入检查阶段
```

### 2.6 Node.js 事件循环的特点

- **多阶段循环**：分为六个明确的阶段
- **nextTick 优先级最高**：`process.nextTick` 的优先级高于所有其他异步操作
- **I/O 密集型优化**：专门为处理大量 I/O 操作设计
- **阶段间微任务检查**：每个阶段结束后都会检查微任务队列

---

## 三、浏览器与 Node.js 事件循环的主要区别

### 3.1 架构差异

| 特性 | 浏览器 | Node.js |
|------|--------|---------|
| **实现基础** | 浏览器引擎（如 V8 + Web APIs） | libuv 库 |
| **循环结构** | 简单的宏任务/微任务模型 | 六个阶段的复杂循环 |
| **主要用途** | 处理用户交互、DOM 操作 | 处理 I/O 操作、网络请求 |

### 3.2 任务队列差异

#### 浏览器

- **宏任务队列**：`setTimeout`, `setInterval`, I/O, UI 渲染等
- **微任务队列**：`Promise`, `MutationObserver`, `queueMicrotask`

#### Node.js

- **六个阶段队列**：Timers, Pending Callbacks, Idle/Prepare, Poll, Check, Close Callbacks
- **nextTick 队列**：`process.nextTick`（优先级最高）
- **Promise 微任务队列**：`Promise.then()` 等

### 3.3 特殊 API 差异

| API | 浏览器 | Node.js |
|-----|--------|---------|
| `setTimeout` | ✅ 支持 | ✅ 支持 |
| `setInterval` | ✅ 支持 | ✅ 支持 |
| `setImmediate` | ❌ 不支持（部分浏览器非标准） | ✅ 支持 |
| `process.nextTick` | ❌ 不支持 | ✅ 支持 |
| `requestAnimationFrame` | ✅ 支持 | ❌ 不支持 |
| `MutationObserver` | ✅ 支持 | ❌ 不支持 |

### 3.4 执行顺序差异

#### 浏览器执行顺序

```text
同步代码 → 微任务（全部清空）→ 宏任务（一个）→ 微任务（全部清空）→ 宏任务（一个）→ ...
```

#### Node.js 执行顺序

```text
同步代码 → nextTick → Promise 微任务 → 
Timers 阶段 → nextTick → Promise 微任务 → 
Pending Callbacks 阶段 → nextTick → Promise 微任务 → 
Poll 阶段 → nextTick → Promise 微任务 → 
Check 阶段 → nextTick → Promise 微任务 → 
Close Callbacks 阶段 → nextTick → Promise 微任务 → 
（循环）
```

### 3.5 微任务优先级差异

#### 浏览器

- 所有微任务优先级相同
- 按照入队顺序执行

#### Node.js

- `process.nextTick` 优先级最高
- 然后是 Promise 微任务
- 执行顺序：nextTick → Promise 微任务

### 3.6 对比示例

```javascript
// 浏览器环境
console.log('1');

setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
queueMicrotask(() => console.log('4'));

console.log('5');

// 浏览器输出：1, 5, 3, 4, 2
// 微任务按入队顺序执行
```

```javascript
// Node.js 环境
console.log('1');

setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
process.nextTick(() => console.log('4'));

console.log('5');

// Node.js 输出：1, 5, 4, 3, 2
// nextTick 优先级高于 Promise
```

### 3.7 I/O 处理差异

#### 浏览器

- I/O 操作（如 `fetch`, `XMLHttpRequest`）由浏览器 API 处理
- 回调放入宏任务队列

#### Node.js

- I/O 操作在**轮询（Poll）阶段**处理
- 使用事件驱动模型，高效处理大量并发 I/O

### 3.8 渲染相关差异

#### 浏览器

- 有 UI 渲染机制
- `requestAnimationFrame` 在渲染前执行
- 需要考虑渲染性能优化

#### Node.js

- 无 UI 渲染
- 专注于服务器端逻辑
- 不需要考虑渲染相关的问题

---

## 四、实际应用场景

### 4.1 浏览器中的最佳实践

```javascript
// 使用微任务确保 DOM 更新后执行
button.addEventListener('click', () => {
    // 修改 DOM
    element.textContent = 'Updated';
    
    // 使用微任务确保在 DOM 更新后执行
    Promise.resolve().then(() => {
        console.log('DOM updated:', element.textContent);
    });
});

// 使用 requestAnimationFrame 优化动画
function animate() {
    // 更新动画状态
    updateAnimation();
    
    // 请求下一帧
    requestAnimationFrame(animate);
}
animate();
```

### 4.2 Node.js 中的最佳实践

```javascript
// 使用 process.nextTick 确保回调在事件循环继续之前执行
function asyncOperation(callback) {
    // 确保回调在当前阶段结束后、下一阶段开始前执行
    process.nextTick(callback);
}

// 使用 setImmediate 在 I/O 回调后执行
fs.readFile('file.txt', () => {
    // I/O 操作完成
    
    setImmediate(() => {
        // 在下一个事件循环迭代的检查阶段执行
        console.log('I/O completed');
    });
});
```

---

## 五、常见面试题

### 5.1 题目 1：执行顺序判断

```javascript
console.log('1');

setTimeout(() => {
    console.log('2');
    Promise.resolve().then(() => console.log('3'));
}, 0);

Promise.resolve().then(() => {
    console.log('4');
    setTimeout(() => console.log('5'), 0);
});

console.log('6');

// 浏览器输出：1, 6, 4, 2, 3, 5
// Node.js 输出：1, 6, 4, 2, 3, 5（相同）
```

### 5.2 题目 2：nextTick vs Promise

```javascript
// Node.js 环境
Promise.resolve().then(() => console.log('Promise'));
process.nextTick(() => console.log('nextTick'));

// 输出：nextTick, Promise
// nextTick 优先级更高
```

### 5.3 题目 3：setTimeout vs setImmediate

```javascript
// Node.js 环境 - 在主模块中
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));

// 输出顺序不确定，取决于事件循环的当前状态
```

```javascript
// Node.js 环境 - 在 I/O 回调中
const fs = require('fs');
fs.readFile(__filename, () => {
    setTimeout(() => console.log('timeout'), 0);
    setImmediate(() => console.log('immediate'));
});

// 输出：immediate, timeout（确定）
```

---

## 六、总结

### 浏览器事件循环

- 简单的宏任务/微任务模型
- 微任务在宏任务之间清空
- 有 UI 渲染机制
- 适合处理用户交互和 DOM 操作

### Node.js 事件循环

- 六个阶段的复杂循环
- `process.nextTick` 优先级最高
- 专门优化 I/O 操作
- 适合处理服务器端高并发场景

### 核心区别

1. **结构复杂度**：Node.js 更复杂，有明确的阶段划分
2. **微任务优先级**：Node.js 有 `nextTick` 这个特殊的高优先级队列
3. **I/O 处理**：Node.js 在轮询阶段专门处理 I/O
4. **特殊 API**：两者支持的异步 API 不同

理解这些差异对于编写跨平台代码和优化性能非常重要。
