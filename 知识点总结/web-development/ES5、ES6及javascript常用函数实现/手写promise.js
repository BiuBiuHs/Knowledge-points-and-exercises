// 实现一个符合 Promise 标准的 Promise 类可以让你更好地理解 Promise 的内部机制。以下是一个简洁且通俗易通的实现，关键部分带有注释解释。

// ### 实现 Promise

class MyPromise {
	constructor(executor) {
		this.state = "pending"; // 初始状态为 pending
		this.value = undefined; // 成功的值
		this.reason = undefined; // 失败的原因
		this.onFulfilledCallbacks = []; // 成功回调队列
		this.onRejectedCallbacks = []; // 失败回调队列

		// 立即执行 executor 函数
		try {
			executor(this.resolve.bind(this), this.reject.bind(this));
		} catch (error) {
			this.reject(error);
		}
	}

	// 成功的处理函数
	resolve(value) {
		if (this.state === "pending") {
			this.state = "fulfilled";
			this.value = value;
			this.onFulfilledCallbacks.forEach((fn) => fn());
		}
	}

	// 失败的处理函数
	reject(reason) {
		if (this.state === "pending") {
			this.state = "rejected";
			this.reason = reason;
			this.onRejectedCallbacks.forEach((fn) => fn());
		}
	}

	// then 方法
	then(onFulfilled, onRejected) {
		onFulfilled =
			typeof onFulfilled === "function" ? onFulfilled : (value) => value;
		onRejected =
			typeof onRejected === "function"
				? onRejected
				: (reason) => {
						throw reason;
				  };

		let promise2 = new MyPromise((resolve, reject) => {
			if (this.state === "fulfilled") {
				setTimeout(() => {
					try {
						let x = onFulfilled(this.value);
						this.resolvePromise(promise2, x, resolve, reject);
					} catch (error) {
						reject(error);
					}
				});
			}

			if (this.state === "rejected") {
				setTimeout(() => {
					try {
						let x = onRejected(this.reason);
						this.resolvePromise(promise2, x, resolve, reject);
					} catch (error) {
						reject(error);
					}
				});
			}

			if (this.state === "pending") {
				this.onFulfilledCallbacks.push(() => {
					setTimeout(() => {
						try {
							let x = onFulfilled(this.value);
							this.resolvePromise(promise2, x, resolve, reject);
						} catch (error) {
							reject(error);
						}
					});
				});

				this.onRejectedCallbacks.push(() => {
					setTimeout(() => {
						try {
							let x = onRejected(this.reason);
							this.resolvePromise(promise2, x, resolve, reject);
						} catch (error) {
							reject(error);
						}
					});
				});
			}
		});

		return promise2;
	}
	resolvePromise(promise2, x, resolve, reject) {
		// 检查是否存在循环引用
		if (promise2 === x) {
			return reject(
				new TypeError("Chaining cycle detected for promise #<Promise>")
			);
		}

		// 用于防止多次调用 resolve 或 reject
		let called;

		if (x instanceof MyPromise) {
			// 如果 x 是一个 MyPromise 实例
			if (x.state === "pending") {
				// 如果 x 的状态是 pending
				x.then(
					(y) => this.resolvePromise(promise2, y, resolve, reject), // 递归调用 resolvePromise
					(reason) => reject(reason) // 直接 reject
				);
			} else {
				// 如果 x 的状态是 fulfilled 或 rejected
				x.then(resolve, reject); // 直接 resolve 或 reject
			}
		} else if (
			x !== null &&
			(typeof x === "object" || typeof x === "function")
		) {
			// 如果 x 是一个对象或函数
			try {
				let then = x.then; // 获取 x 的 then 方法
				if (typeof then === "function") {
					// 如果 then 是一个函数
					then.call(
						x,
						(y) => {
							if (called) return; // 检查是否已经调用过
							called = true; // 标记已调用
							this.resolvePromise(promise2, y, resolve, reject); // 递归调用 resolvePromise
						},
						(reason) => {
							if (called) return; // 检查是否已经调用过
							called = true; // 标记已调用
							reject(reason); // 直接 reject
						}
					);
				} else {
					// 如果 then 不是函数
					resolve(x); // 直接 resolve
				}
			} catch (error) {
				if (called) return; // 检查是否已经调用过
				called = true; // 标记已调用
				reject(error); // 直接 reject
			}
		} else {
			// 如果 x 是基本类型或 null
			resolve(x); // 直接 resolve
		}
	}
}

// 测试代码
const promise = new MyPromise((resolve, reject) => {
	setTimeout(() => {
		resolve("成功");
	}, 1000);
});

promise
	.then(
		(value) => {
			console.log(value); // 输出: 成功
			return new MyPromise((resolve, reject) => {
				setTimeout(() => {
					resolve("第二个成功");
				}, 1000);
			});
		},
		(reason) => {
			console.log(reason);
		}
	)
	.then(
		(value) => {
			console.log(value); // 输出: 第二个成功
		},
		(reason) => {
			console.log(reason);
		}
	);

// ### 关键部分解释

// 1. **构造函数**：
//    - `this.state`：初始状态为 `pending`。
//    - `this.value` 和 `this.reason`：分别存储成功和失败的结果。
//    - `this.onFulfilledCallbacks` 和 `this.onRejectedCallbacks`：分别存储成功和失败的回调函数队列。
//    - `executor` 函数立即执行，并传入 `resolve` 和 `reject` 方法。

// 2. **`resolve` 方法**：
//    - 只有在 `pending` 状态下才能改变状态为 `fulfilled`。
//    - 将 `value` 赋值给 `this.value`。
//    - 执行所有成功回调。

// 3. **`reject` 方法**：
//    - 只有在 `pending` 状态下才能改变状态为 `rejected`。
//    - 将 `reason` 赋值给 `this.reason`。
//    - 执行所有失败回调。

// 4. **`then` 方法**：
//    - `onFulfilled` 和 `onRejected` 是可选的回调函数，如果未提供则使用默认函数。
//    - 创建一个新的 `MyPromise` 实例 `promise2`。
//    - 根据 `this.state` 的不同状态执行相应的回调，并将结果传递给 `resolvePromise` 方法。
//    - 如果状态为 `pending`，将回调函数添加到队列中，等待状态改变时执行。

// 5. **`resolvePromise` 方法**：
//    - 处理 `promise2` 的 `resolve`，确保 `x` 是一个 `MyPromise` 实例。
//    - 检查 `x` 是否与 `promise2` 相同，防止循环引用。
//    - 如果 `x` 是 `MyPromise` 实例，递归调用 `resolvePromise`。
//    - 如果 `x` 是对象或函数，尝试调用其 `then` 方法。
//    - 否则，直接 `resolve`。

// 通过以上实现，你可以创建一个符合 Promise 标准的 Promise 类，并在关键部分添加了注释以帮助理解。
