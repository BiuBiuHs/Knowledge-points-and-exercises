//chatbox 基于api生成的 promise相关方法实现
好的，下面是如何实现 `Promise.all`、`Promise.race` 和 `Promise.allSettled` 这些常用的 `Promise` 方法。我们将逐一实现这些方法，并解释每个方法的逻辑。

### 1. `Promise.all`

`Promise.all` 接受一个 `Promise` 对象的数组，当所有 `Promise` 都成功时返回一个包含所有结果的数组，如果任何一个 `Promise` 失败，则返回第一个失败的 `Promise` 的错误。

```javascript
function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let resolvedCount = 0;
    const totalPromises = promises.length;

    promises.forEach((promise, index) => {
      promise.then(
        (value) => {
          results[index] = value;
          resolvedCount++;
          if (resolvedCount === totalPromises) {
            resolve(results);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  });
}
```

### 2. `Promise.race`

`Promise.race` 接受一个 `Promise` 对象的数组，返回第一个完成（无论是成功还是失败）的 `Promise` 的结果或错误。

```javascript
function myPromiseRace(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach((promise) => {
      promise.then(
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

### 3. `Promise.allSettled`

`Promise.allSettled` 接受一个 `Promise` 对象的数组，当所有 `Promise` 都完成（无论是成功还是失败）时返回一个包含所有 `Promise` 结果或错误的数组。

```javascript
function myPromiseAllSettled(promises) {
  return new Promise((resolve) => {
    const results = [];
    let settledCount = 0;
    const totalPromises = promises.length;

    promises.forEach((promise, index) => {
      promise.then(
        (value) => {
          results[index] = { status: 'fulfilled', value };
        },
        (error) => {
          results[index] = { status: 'rejected', reason: error };
        }
      ).then(() => {
        settledCount++;
        if (settledCount === totalPromises) {
          resolve(results);
        }
      });
    });
  });
}
```

### 使用示例

```javascript
const promise1 = Promise.resolve(1);
const promise2 = Promise.resolve(2);
const promise3 = new Promise((resolve, reject) => setTimeout(() => reject('Error'), 1000));

const promises = [promise1, promise2, promise3];

// 使用 myPromiseAll
myPromiseAll(promises)
  .then((results) => console.log('All results:', results))
  .catch((error) => console.error('All error:', error));

// 使用 myPromiseRace
myPromiseRace(promises)
  .then((result) => console.log('Race result:', result))
  .catch((error) => console.error('Race error:', error));

// 使用 myPromiseAllSettled
myPromiseAllSettled(promises)
  .then((results) => console.log('AllSettled results:', results))
  .catch((error) => console.error('AllSettled error:', error));
```

### 解释

* **`myPromiseAll`**：
  * 创建一个 `Promise`，并初始化一个 `results` 数组和 `resolvedCount` 计数器。
  * 遍历每个 `Promise`，使用 `then` 方法处理成功和失败的情况。
  * 如果所有 `Promise` 都成功，调用 `resolve` 并返回 `results` 数组。
  * 如果任何一个 `Promise` 失败，调用 `reject` 并返回错误。

* **`myPromiseRace`**：
  * 创建一个 `Promise`。
  * 遍历每个 `Promise`，使用 `then` 方法处理成功和失败的情况。
  * 第一个完成的 `Promise` 会调用 `resolve` 或 `reject`，并返回结果或错误。

* **`myPromiseAllSettled`**：
  * 创建一个 `Promise`，并初始化一个 `results` 数组和 `settledCount` 计数器。
  * 遍历每个 `Promise`，使用 `then` 方法处理成功和失败的情况。
  * 无论成功还是失败，都记录结果。
  * 当所有 `Promise` 都完成时，调用 `resolve` 并返回 `results` 数组。

希望这些实现和解释对你有帮助！如果你有更多问题，请随时提问。

### promise.finally

```javascript
    Promise.prototype.finally = function (callback) {
        return this.then(
          (value) => {
            return Promise.resolve(callback()).then(() => {
                return value;
            });
        },
         (err) => {
            return Promise.resolve(callback()).then(() => {
                throw err;
            });
        });
    }
        
```
