### promise.all 实现

#### 1.0 简单实现
```
    Promise.all = function(promises) {
    let results = [];
    return new Promise(function(resolve) {
        promises.forEach(function(val) {
        // 按顺序执行每一个Promise操作
        val.then(function(res) {
            results.push(res);
        });
        });
        resolve(results);
    });
    }
```

#### 1.0 版本存在的问题
* 一、Promise.all传递的参数可能不是Promise类型，可能不存在then方法。
* 二、如果中间发生错误，应该直接返回错误，不执行后面操作。

```
    Promise.prototype.all = function(promises) {
        let results = [];
        let promiseCount = 0;
        let promisesLength = promises.length;
        return new Promise(function(resolve, reject) {
            for (let val of promises) {
            Promise.resolve(val).then(function(res) {
                promiseCount++;
                // results.push(res);
                results[i] = res;
                // 当所有函数都正确执行了，resolve输出所有返回结果。
                if (promiseCount === promisesLength) {
                return resolve(results);
                }
            }, function(err) {
                return reject(err);
            });
            }
        });
    };
```

### promise.race 

```
    promise.prototype.race = function (promiseArr) {

        return new Promise((resolve,reject) => {
            promiseArr.forEach(item => {
                item.then(value => {
                    resolve(value)
                },err=>{
                    reject(err)
                })
            })
        })
    }
```


### promise.finally

```
    Promise.prototype.finally = function (callback) {
        return this.then((value) => {
            return Promise.resolve(callback()).then(() => {
                return value;
            });
        }, (err) => {
            return Promise.resolve(callback()).then(() => {
                throw err;
            });
        });
    }
        
```

### promise.allsettle

```

function allSettled(promises) {
  if (promises.length === 0) return Promise.resolve([])
  
  const _promises = promises.map(
    item => item instanceof Promise ? item : Promise.resolve(item)
    )
  
  return new Promise((resolve, reject) => {
    const result = []
    let unSettledPromiseCount = _promises.length
    
    _promises.forEach((promise, index) => {
      promise.then((value) => {
        result[index] = {
          status: 'fulfilled',
          value
        }
        
        unSettledPromiseCount -= 1
        // resolve after all are settled
        if (unSettledPromiseCount === 0) {
          resolve(result)
        }
      }, (reason) => {
        result[index] = {
          status: 'rejected',
          reason
        }
        
        unSettledPromiseCount -= 1
        // resolve after all are settled
        if (unSettledPromiseCount === 0) {
          resolve(result)
        }
      })
    })
  })
}
```