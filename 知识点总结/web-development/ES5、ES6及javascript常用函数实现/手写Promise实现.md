# AI实现

# 手写 Promise（符合 Promise/A+）

本文实现一个带详细注释的 `MyPromise`，覆盖 Promise/A+ 规范的核心要点：状态管理、异步回调、链式调用、`then` 的穿透机制，同时补充常见的 `catch`、`finally` 以及静态方法。

## 实现代码

```javascript
// 定义三个内部状态常量
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
  constructor(executor) {
    // 初始化内部状态
    this.state = PENDING;
    this.value = undefined;   // 成功结果
    this.reason = undefined;  // 失败原因

    // 用数组存储 then 注册的回调，支持多次调用 then
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    // 定义 resolve 和 reject，并确保只会触发一次
    const resolve = (value) => {
      if (this.state !== PENDING) return;
      // 使用微任务延迟状态切换，保持与原生 Promise 一致的“永远异步”行为
      // 示例：p.then(() => console.log('A')); console.log('B');
      // 输出顺序为 B → A，因为回调被放入微任务，在当前同步逻辑执行完毕后再运行
      queueMicrotask(() => {
        this.state = FULFILLED;
        this.value = value;
        // 队列里存放的是调度函数（外层包装），执行一次即可把真正的回调安排到微任务中
        this.onFulfilledCallbacks.forEach((fn) => fn());
      });
    };

    const reject = (reason) => {
      if (this.state !== PENDING) return;
      // 同样通过微任务异步更新状态，确保 then 中的回调先注册再执行
      // 示例：p.catch(() => console.log('error')); throw new Error();
      // catch 中的回调同样会在同步异常抛出后、微任务阶段被调用
      queueMicrotask(() => {
        this.state = REJECTED;
        this.reason = reason;
        // 同理，触发调度函数即可让 reject 回调在微任务阶段运行
        this.onRejectedCallbacks.forEach((fn) => fn());
      });
    };

    // 立即执行传入的 executor，并捕获同步异常
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    // 处理透传：如果不是函数，创建默认函数保持链式调用
    // 例如：
    // p.then().then(val => console.log(val)) // onFulfilled未传，自动透传value
    // p.catch().catch(err => console.log(err)) // onRejected未传，自动抛出reason
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (reason) => {
            throw reason;
          };

    const promise2 = new MyPromise((resolve, reject) => {
      const processFulfilled = () => {
        try {
          const x = onFulfilled(this.value);
          resolvePromise(promise2, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      };

      const processRejected = () => {
        try {
          const x = onRejected(this.reason);
          resolvePromise(promise2, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      };

      if (this.state === FULFILLED) {
        queueMicrotask(processFulfilled);
      } else if (this.state === REJECTED) {
        queueMicrotask(processRejected);
      } else {
        // 如果仍是 pending，先存储回调，等待状态改变后再执行
        // 使用闭包保持对最新 value/reason 的访问，同时存入包装函数以统一调度逻辑
        // 示例：p.then(() => 'A').then((v) => console.log(v));
        // 第一次 then 注册的包装函数执行后，会在微任务中运行 processFulfilled（打印 'A'）
        this.onFulfilledCallbacks.push(() => queueMicrotask(processFulfilled));
        this.onRejectedCallbacks.push(() => queueMicrotask(processRejected));
      }
    });

    return promise2;
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);  
  }

  finally(onFinally) {
    return this.then(
      (value) => MyPromise.resolve(typeof onFinally === 'function' ? onFinally() : onFinally).then(
        () => value
      ),
      (reason) =>
        MyPromise.resolve(typeof onFinally === 'function' ? onFinally() : onFinally).then(() => {
          throw reason;
        })
    );
  }

  // --- 静态方法实现 ---
  static resolve(value) {
    if (value instanceof MyPromise) {
      return value;
    }
    return new MyPromise((resolve) => resolve(value));
  }

  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason));
  }

  static all(iterable) {
    return new MyPromise((resolve, reject) => {
      const results = [];
      let completed = 0;
      const items = Array.from(iterable);

      if (items.length === 0) {
        resolve([]);
        return;
      }

      items.forEach((item, index) => {
        MyPromise.resolve(item)
          .then((value) => {
            results[index] = value;
            completed += 1;
            if (completed === items.length) {
              resolve(results);
            }
          })
          .catch(reject);
      });
    });
  }

  static race(iterable) {
    return new MyPromise((resolve, reject) => {
      for (const item of iterable) {
        MyPromise.resolve(item).then(resolve, reject);
      }
    });
  }
}

// 按照 Promise/A+ 规范实现的辅助函数：解析 then 返回值 x
function resolvePromise(promise2, x, resolve, reject) {
  // 避免死循环
  if (promise2 === x) {
    reject(new TypeError('Chaining cycle detected for promise'));
    return;
  }

  // 如果 x 是对象或函数，可能是 thenable
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    let called = false;
    try {
      const then = x.then;
      if (typeof then === 'function') {
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        resolve(x);
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(error);
    }
  } else {
    // 普通值直接 resolve
    resolve(x);
  }
}

module.exports = MyPromise;
```

## 为什么需要 `resolvePromise`

- Promise/A+ 规范要求：`then` 的返回值必须通过一套统一的解析流程，确保兼容各种“类 Promise”对象（thenable）。
- `resolvePromise` 的职责就是根据返回值 `x` 的类型决定后续动作：
  - 如果 `x` 是普通值，直接 `resolve(x)`。
  - 如果 `x` 是对象/函数且拥有 `then` 方法，则把它当作“潜在的 Promise”，调用其 `then`，并递归解析其返回结果。
  - 如果解析过程中抛出异常，需要捕获并 `reject`，同时避免多次调用（通过 `called` 标记）。
- 通过这层解析，可以让 `MyPromise` 与任何遵循 Promise/A+ 的实现无缝互相链式调用，避免死循环或状态卡住。

## 使用示例

```javascript
const MyPromise = require('./MyPromise'); // 按需调整路径

const delay = (value, ms, shouldReject = false) =>
  new MyPromise((resolve, reject) => {
    setTimeout(() => {
      shouldReject ? reject(value) : resolve(value);
    }, ms);
  });

delay('first', 200)
  .then((res) => {
    console.log(res); // first
    return delay('second', 100);
  })
  .then((res) => {
    console.log(res); // second
    return 'third';
  })
  .finally(() => console.log('done'))
  .catch((err) => console.error('捕获错误:', err));
```

## 链式调用三次 `then` 的状态变化

```javascript
const p = new MyPromise((resolve) => resolve(1));

const p1 = p.then((v) => v + 1);
// p：pending → fulfilled（只发生一次）
// p1：创建时为 pending，回调执行后 resolve → fulfilled

const p2 = p1.then((v) => v * 2);
// p1：保持 fulfilled，不会再变
// p2：pending → fulfilled（回调返回 4）

const p3 = p2.then((v) => {
  console.log(v); // 4
  return v - 3;
});
// p2：保持 fulfilled
// p3：pending → fulfilled（回调返回 1）

p3.then((v) => console.log(v)); // 最终打印 1

// 结论：
// - 原始 Promise 只会经历一次 pending → fulfilled/rejected。
// - 每次 then 都会派生出全新的 Promise（p1/p2/p3），它们初始为 pending。
// - 对应回调执行完成后，派生 Promise 才会从 pending 变为 fulfilled 或 rejected。
// - 如果中间某个回调抛错或返回 reject，只有该派生 Promise 进入 rejected，其他已 settled 的状态不会受影响。
```

## 核心要点总结

- Promise 内部状态一旦改变就不可逆，同时触发回调队列。
- `then` 必须返回一个新的 Promise，并遵循 Promise/A+ 的 `resolvePromise` 处理流程。
- 使用微任务（`queueMicrotask`）确保回调异步执行，与原生 Promise 行为一致。
- 通过 `module.hot.accept` 等机制可以接入现代框架的 HMR（此处为延伸理解）。
