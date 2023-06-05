const PROMISE_STATUS_PENDING = "pending";
const PROMISE_STATUS_FULFILLED = "fulfilled";
const PROMISE_STATUS_REJECTED = "rejected";

// help fun
function execFunctionWithCatchError(execFun, value, resolve, reject) {
  try {
    const result = execFun(value);
    resolve(result);
  } catch (error) {
    reject(error);
  }
}

class MyPromise {
  constructor(executor) {
    this.status = PROMISE_STATUS_PENDING; // 记录promise状态
    this.value = undefined; // resolve返回值
    this.reason = undefined; // reject返回值
    this.onFulfilledFns = []; // 存放成功回调
    this.onRejectedFns = []; // 存放失败回调

    const resolve = value => {
      if (this.status === PROMISE_STATUS_PENDING) {
        queueMicrotask(() => {
          if (this.status !== PROMISE_STATUS_PENDING) return;
          this.status = PROMISE_STATUS_FULFILLED;
          this.value = value;
          this.onFulfilledFns.forEach(fn => {
            fn(this.value);
          });
        });
      }
    };
    const reject = reason => {
      if (this.status === PROMISE_STATUS_PENDING) {
        queueMicrotask(() => {
          if (this.status !== PROMISE_STATUS_PENDING) return;
          this.status = PROMISE_STATUS_REJECTED;
          this.reason = reason;
          this.onRejectedFns.forEach(fn => {
            fn(this.reason);
          });
        });
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled =
      onFulfilled ||
      (value => {
        return value;
      });

    onRejected =
      onRejected ||
      (err => {
        throw err;
      });

    return new MyPromise((resolve, reject) => {
      // 1、 when operate then, status have confirmed
      if (this.status === PROMISE_STATUS_FULFILLED && onFulfilled) {
        execFunctionWithCatchError(onFulfilled, this.value, resolve, reject);
      }
      if (this.status === PROMISE_STATUS_REJECTED && onRejected) {
        execFunctionWithCatchError(onRejected, this.reason, resolve, reject);
      }

      if (this.status === PROMISE_STATUS_PENDING) {
        // this.onFulfilledFns.push(onFulfilled);
        if (onFulfilled) {
          this.onFulfilledFns.push(() => {
            execFunctionWithCatchError(onFulfilled, this.value, resolve, reject);
          });
        }

        // this.onRejectedFns.push(onRejected);
        if (onRejected) {
          this.onRejectedFns.push(() => {
            execFunctionWithCatchError(onRejected, this.reason, resolve, reject);
          });
        }
      }
    });
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  finally(onFinally) {
    this.then(
      () => {
        onFinally();
      },
      () => {
        onFinally();
      }
    );
  }

  static resolve(value) {
    return new MyPromise(resolve => resolve(value));
  }

  static reject(reason) {
    return new MyPromise((resolve, reject) => reject(reason));
  }

  static all(promises) {
    return new MyPromise((resolve, reject) => {
      const values = [];
      promises.forEach(promise => {
        promise.then(
          res => {
            values.push(res);
            if (values.length === promises.length) {
              resolve(values);
            }
          },
          err => {
            reject(err);
          }
        );
      });
    });
  }

  static allSettled(promises) {
    return new MyPromise(resolve => {
      const results = [];
      promises.forEach(promise => {
        promise.then(
          res => {
            results.push({ status: PROMISE_STATUS_FULFILLED, value: res });
            if (results.length === promises.length) {
              resolve(results);
            }
          },
          err => {
            results.push({ status: PROMISE_STATUS_REJECTED, value: err });
            if (results.length === promises.length) {
              resolve(results);
            }
          }
        );
      });
    });
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      promises.forEach(promise => {
        promise.then(
          res => {
            resolve(res);
          },
          err => {
            reject(err);
          }
        );
      });
    });
  }

  static any(promises) {
    return new MyPromise((resolve, reject) => {
      const reasons = [];
      promises.forEach(promise => {
        promise.then(
          res => {
            resolve(res);
          },
          err => {
            reasons.push(err);
            if (reasons.length === promise.length) {
              // reject(new AggreagateError(reasons));
              reject(reasons);
            }
          }
        );
      });
    });
  }
}

const p1 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    console.log("--- 1 ---");
    resolve(111);
  });
}).then(res => {
  console.log("p1 res :>> ", res);
});

const p2 = new MyPromise((resolve, reject) => {
  console.log("--- 2 ---");
  resolve(222);
});

const p3 = new MyPromise((resolve, reject) => {
  console.log("--- 3 ---");
  resolve(333);
});

const p4 = new MyPromise((resolve, reject) => {
  console.log("--- 4 ---");
  reject(444);
});

MyPromise.all([p2, p3]).then(res => {
  console.log("p2&p3 res :>> ", res);
});

MyPromise.all([p2, p4])
  .then(res => {
    console.log("p2&p4 res :>> ", res);
  })
  .catch(err => {
    console.log("err :>> ", err);
  });

// --- 2 ---
// --- 3 ---
// --- 4 ---
// p2&p3 res :>>  [ 222, 333 ]
// err :>>  444
// --- 1 ---
// p1 res :>>  111
