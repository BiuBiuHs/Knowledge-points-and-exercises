### promise.all 实现

#### 1.0 简单实现
>> 彼此相互依赖，其中任何一个被 reject ，其它都失去了实际价值
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
            promises.forEach((item,index)=>{
              Promise.resolve(val).then(function(res) {
                promiseCount++;
                //直接使用index 保证顺序
                results[i] = res;
                // 当所有函数都正确执行了，resolve输出所有返回结果。
                if (promiseCount === promisesLength) {
                return resolve(results);
                }
            }, function(err) {
                return reject(err);
            });
            }
            ) 
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

>> 彼此不依赖，其中任何一个被 reject ，对其它都没有影响
>> 期望知道每个 promise 的执行结果


```

function allSettled(promises) {
  if (promises.length === 0) return Promise.resolve([])
  
  const _promises = promises.map(
    item => item instanceof Promise ? item : Promise.resolve(item)
    )
  
  return new Promise((resolve, reject) => {
    const result = []
    //使用变量记录所有的promise的个数 
    let unSettledPromiseCount = _promises.length
    
    _promises.forEach((promise, index) => {
      promise.then((value) => {
        result[index] = {
          status: 'fulfilled',
          value
        }
        
        //每次某个promise状态变化 将个数减少 
        unSettledPromiseCount -= 1
        // 没有promise 可以执行后 将结果数组返回 
        if (unSettledPromiseCount === 0) {
          resolve(result)
        }
      }, (reason) => {
        result[index] = {
          status: 'rejected',
          reason
        }
         //每次某个promise状态变化 将个数减少 
        unSettledPromiseCount -= 1
        // 没有promise 可以执行后 将结果数组返回 
        if (unSettledPromiseCount === 0) {
          resolve(result)
        }
      })
    })
  })
}
```

promiseAllsetteld 简写

```
  MyPromise.allSettled = function(values) {
    let promises = [].slice.call(values)
    return new MyPromise((resolve, reject) => {
      let result = [], count = 0
      promises.forEach(promise => {
        MyPromise.resolve(promise).then(value=>{
          result.push({status: 'fulfilled', value})
        }).catch(err=>{
          result.push({status: 'rejected', value: err})
        }).finally(()=>{
          if(++count === promise.length) {
            resolve(result)
          }
        })
      })
    })
  }

```