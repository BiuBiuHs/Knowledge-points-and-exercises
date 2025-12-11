
### 1. `Promise.all`

`Promise.all` 接受一个可迭代对象（通常是数组），可以包含 Promise 对象、普通值、或 Thenable 对象。当所有项都成功时返回一个包含所有结果的数组，如果任何一个失败，则返回第一个失败的错误。

```javascript
function myPromiseAll(iterable) {
  return new Promise((resolve, reject) => {
    // 转换为数组（支持任何可迭代对象）
    const promises = Array.from(iterable);
    const results = [];
    let resolvedCount = 0;
    const totalPromises = promises.length;

    // 处理空数组的情况
    if (totalPromises === 0) {
      resolve(results);
      return;
    }

    promises.forEach((promiseItem, index) => {
      // 关键：使用 Promise.resolve 包裹，支持普通值、Promise、Thenable
      Promise.resolve(promiseItem).then(
        (value) => {
          results[index] = value;
          resolvedCount++;
          if (resolvedCount === totalPromises) {
            resolve(results);
          }
        },
        (error) => {
          // 只要有一个失败就立即 reject
          reject(error);
        }
      );
    });
  });
}
```

**为什么需要 `Promise.resolve()` 包裹？**

- 支持普通值：`[1, 2, 3]` → 自动转换为 Promise
- 支持 Promise：已经是 Promise 的直接返回
- 支持 Thenable：有 then 方法的对象会被正确处理
- 统一接口：确保后续可以安全调用 `.then()`

### 2. `Promise.race`

`Promise.race` 接受一个可迭代对象，返回第一个完成（无论是成功还是失败）的项的结果或错误。

```javascript
function myPromiseRace(iterable) {
  return new Promise((resolve, reject) => {
    // 转换为数组
    const promises = Array.from(iterable);
    
    // 空数组永远不会 resolve 或 reject（符合规范）
    if (promises.length === 0) {
      return;
    }

    promises.forEach((promiseItem) => {
      // 使用 Promise.resolve 包裹，支持普通值
      Promise.resolve(promiseItem).then(
        (value) => {
          resolve(value);
        },
        (error) => {
          reject(error);
        }
      );
    });
  });
}
```

**注意：**

- 空数组情况下，返回的 Promise 会一直处于 pending 状态（符合规范）
- 第一个完成的会触发 resolve 或 reject，后续的会被忽略（Promise 状态一旦改变就不可变）

### 3. `Promise.allSettled`

`Promise.allSettled` 接受一个可迭代对象，当所有项都完成（无论是成功还是失败）时返回一个包含所有结果的数组。每个结果都是一个对象，包含 `status` 和 `value/reason`。

```javascript
function myPromiseAllSettled(iterable) {
  return new Promise((resolve) => {
    // 转换为数组
    const promises = Array.from(iterable);
    const results = [];
    let settledCount = 0;
    const totalPromises = promises.length;

    // 处理空数组
    if (totalPromises === 0) {
      resolve(results);
      return;
    }

    promises.forEach((promiseItem, index) => {
      // 使用 Promise.resolve 包裹
      Promise.resolve(promiseItem).then(
        (value) => {
          results[index] = { status: 'fulfilled', value };
          settledCount++;
          if (settledCount === totalPromises) {
            resolve(results);
          }
        },
        (reason) => {
          results[index] = { status: 'rejected', reason };
          settledCount++;
          if (settledCount === totalPromises) {
            resolve(results);
          }
        }
      );
    });
  });
}
```

**特点：**

- 永远不会 reject（总是 resolve）
- 返回格式：`{ status: 'fulfilled', value }` 或 `{ status: 'rejected', reason }`
- 等待所有项都完成，无论成功还是失败

### 使用示例

```javascript
// 测试数据
const promise1 = Promise.resolve(1);
const promise2 = Promise.resolve(2);
const promise3 = new Promise((resolve, reject) => setTimeout(() => reject('Error'), 1000));

// 测试 myPromiseAll - 支持普通值和 Promise
myPromiseAll([promise1, promise2, 3, 'hello'])
  .then((results) => console.log('All results:', results))
  // 输出: All results: [1, 2, 3, 'hello']
  .catch((error) => console.error('All error:', error));

// 测试失败情况
myPromiseAll([promise1, promise2, promise3])
  .then((results) => console.log('All results:', results))
  .catch((error) => console.error('All error:', error));
  // 输出: All error: Error

// 测试空数组
myPromiseAll([])
  .then((results) => console.log('Empty array:', results));
  // 输出: Empty array: []

// 测试 myPromiseRace - 返回最快完成的
myPromiseRace([promise1, promise2, promise3])
  .then((result) => console.log('Race result:', result))
  // 输出: Race result: 1
  .catch((error) => console.error('Race error:', error));

// 测试 myPromiseRace - 支持普通值
myPromiseRace([1, 2, 3])
  .then((result) => console.log('Race with values:', result));
  // 输出: Race with values: 1

// 测试 myPromiseAllSettled - 所有结果都返回
myPromiseAllSettled([promise1, promise2, promise3])
  .then((results) => console.log('AllSettled results:', results));
  // 输出: AllSettled results: [
  //   { status: 'fulfilled', value: 1 },
  //   { status: 'fulfilled', value: 2 },
  //   { status: 'rejected', reason: 'Error' }
  // ]

// 测试 myPromiseAllSettled - 混合普通值和 Promise
myPromiseAllSettled([1, Promise.resolve(2), Promise.reject('err'), 4])
  .then((results) => console.log('AllSettled mixed:', results));
  // 输出: AllSettled mixed: [
  //   { status: 'fulfilled', value: 1 },
  //   { status: 'fulfilled', value: 2 },
  //   { status: 'rejected', reason: 'err' },
  //   { status: 'fulfilled', value: 4 }
  // ]
```

### 核心要点解释

#### **`myPromiseAll`**

- **`Promise.resolve()` 包裹的必要性：**
  - 支持普通值（数字、字符串）自动转换为 fulfilled 的 Promise
  - 支持已有的 Promise 对象直接返回
  - 支持 Thenable 对象（有 then 方法）
  - 统一接口，确保可以安全调用 `.then()`
  
- **执行逻辑：**
  - 使用 `results[index]` 保证结果顺序与输入顺序一致
  - 用计数器 `resolvedCount` 判断是否所有项都完成
  - 任何一个失败就立即 reject，不等待其他
  - 空数组立即 resolve 为空数组

#### **`myPromiseRace`**

- **特点：**
  - 返回第一个完成的结果（无论成功或失败）
  - Promise 状态不可变：第一个完成后，后续的完成会被忽略
  - 空数组返回永远 pending 的 Promise（符合规范）
  
- **应用场景：**
  - 超时控制：`Promise.race([fetchData(), timeout(5000)])`
  - 多源数据请求，取最快的

#### **`myPromiseAllSettled`**

- **与 `Promise.all` 的区别：**
  - 永远不会 reject，总是 resolve
  - 等待所有项完成（无论成功失败）
  - 返回统一格式的结果对象
  
- **应用场景：**
  - 需要知道每个请求的具体结果（成功或失败）
  - 批量操作，不希望因某个失败而中断

#### **为什么需要 `Promise.resolve()` 包裹？**

```javascript
// 问题示例：不使用 Promise.resolve
function badPromiseAll(arr) {
  return new Promise((resolve, reject) => {
    arr.forEach((item) => {
      item.then(...);  // ❌ 如果 item 是普通值会报错
    });
  });
}

badPromiseAll([1, 2, 3]);  // TypeError: item.then is not a function

// 正确做法：使用 Promise.resolve
function goodPromiseAll(arr) {
  return new Promise((resolve, reject) => {
    arr.forEach((item) => {
      Promise.resolve(item).then(...);  // ✅ 支持任何类型
    });
  });
}

goodPromiseAll([1, 2, 3]);  // ✅ 正常工作
```

### 4. `Promise.any`（ES2021）

`Promise.any` 接受一个可迭代对象，返回第一个成功的结果。如果所有都失败，则返回一个 AggregateError。

```javascript
function myPromiseAny(iterable) {
  return new Promise((resolve, reject) => {
    const promises = Array.from(iterable);
    const errors = [];
    let rejectedCount = 0;
    const totalPromises = promises.length;

    // 空数组立即 reject
    if (totalPromises === 0) {
      reject(new AggregateError([], 'All promises were rejected'));
      return;
    }

    promises.forEach((promiseItem, index) => {
      Promise.resolve(promiseItem).then(
        (value) => {
          // 只要有一个成功就 resolve
          resolve(value);
        },
        (error) => {
          errors[index] = error;
          rejectedCount++;
          // 所有都失败才 reject
          if (rejectedCount === totalPromises) {
            reject(new AggregateError(errors, 'All promises were rejected'));
          }
        }
      );
    });
  });
}
```

**特点：**

- 与 `Promise.race` 相反：只关注第一个成功的
- 所有都失败才 reject
- 返回 AggregateError（包含所有错误）

**使用示例：**

```javascript
myPromiseAny([
  Promise.reject('错误1'),
  Promise.resolve('成功'),
  Promise.reject('错误2')
])
  .then(result => console.log(result))  // 输出: 成功
  .catch(err => console.error(err));

myPromiseAny([
  Promise.reject('错误1'),
  Promise.reject('错误2')
])
  .catch(err => {
    console.log(err.errors);  // ['错误1', '错误2']
  });
```

### 5. `Promise.prototype.finally`

`finally` 方法在 Promise 结束时执行（无论成功或失败），不接收任何参数，也不改变 Promise 的结果。

```javascript
Promise.prototype.myFinally = function (callback) {
  return this.then(
    (value) => {
      // 执行 callback，等待其完成（如果是 Promise）
      return Promise.resolve(callback()).then(() => {
        // 返回原始的 value，不改变结果
        return value;
      });
    },
    (reason) => {
      // 执行 callback，等待其完成（如果是 Promise）
      return Promise.resolve(callback()).then(() => {
        // 重新抛出原始错误，不改变结果
        throw reason;
      });
    }
  );
};
```

**特点：**

- 无论成功失败都会执行
- 不接收参数（因为不知道是成功还是失败）
- 不改变 Promise 的结果值
- 如果 callback 返回 Promise，会等待其完成

**使用示例：**

```javascript
Promise.resolve('成功')
  .myFinally(() => {
    console.log('清理工作');
    // 可以返回 Promise 进行异步清理
    return new Promise(resolve => setTimeout(resolve, 1000));
  })
  .then(value => console.log(value));  // 输出: 成功

// 常见应用：关闭 loading
fetch('/api/data')
  .then(res => res.json())
  .catch(err => console.error(err))
  .finally(() => {
    hideLoading();  // 无论成功失败都关闭 loading
  });
```

### 6. 对比总结

| 方法 | 成功条件 | 失败条件 | 返回值 | 是否等待全部 |
|------|---------|---------|--------|------------|
| `Promise.all` | 全部成功 | 任一失败 | 成功结果数组 | 是（失败时提前结束） |
| `Promise.race` | 任一完成 | 任一失败 | 第一个的结果 | 否 |
| `Promise.any` | 任一成功 | 全部失败 | 第一个成功的结果 | 是（成功时提前结束） |
| `Promise.allSettled` | 总是成功 | 不会失败 | 所有结果对象数组 | 是 |

### 7. 完整测试代码

```javascript
// 创建测试用的 Promise
const delay = (ms, value, shouldReject = false) => 
  new Promise((resolve, reject) => 
    setTimeout(() => shouldReject ? reject(value) : resolve(value), ms)
  );

// 测试所有方法
async function runTests() {
  console.log('=== 测试 Promise.all ===');
  try {
    const result1 = await myPromiseAll([1, 2, 3]);
    console.log('普通值:', result1);  // [1, 2, 3]
    
    const result2 = await myPromiseAll([
      delay(100, 'a'),
      delay(50, 'b'),
      delay(150, 'c')
    ]);
    console.log('全部成功:', result2);  // ['a', 'b', 'c']
  } catch (err) {
    console.error('失败:', err);
  }

  console.log('\n=== 测试 Promise.race ===');
  const result3 = await myPromiseRace([
    delay(100, 'slow'),
    delay(50, 'fast'),
    delay(150, 'slower')
  ]);
  console.log('最快的:', result3);  // 'fast'

  console.log('\n=== 测试 Promise.any ===');
  try {
    const result4 = await myPromiseAny([
      delay(100, 'err1', true),
      delay(50, 'success'),
      delay(150, 'err2', true)
    ]);
    console.log('第一个成功:', result4);  // 'success'
  } catch (err) {
    console.error('全部失败:', err);
  }

  console.log('\n=== 测试 Promise.allSettled ===');
  const result5 = await myPromiseAllSettled([
    delay(100, 'ok'),
    delay(50, 'err', true),
    2
  ]);
  console.log('所有结果:', result5);
  // [
  //   { status: 'fulfilled', value: 'ok' },
  //   { status: 'rejected', reason: 'err' },
  //   { status: 'fulfilled', value: 2 }
  // ]
}

// runTests();
```
