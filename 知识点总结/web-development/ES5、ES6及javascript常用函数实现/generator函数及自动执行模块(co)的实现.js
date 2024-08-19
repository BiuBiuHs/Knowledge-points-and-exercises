// Generator函数简介
// Generator 函数是一个状态机，封装了多个内部状态。执行 Generator 函数会返回一个遍历器对象，可以依次遍历 Generator 函数内部的每一个状态，但是只有调用next方法才会遍历下一个内部状态，所以其实提供了一种可以暂停执行的函数。yield表达式就是暂停标志。
function* helloWorldGenerator() {
	yield 'hello'
	yield 'world'
	return 'ending'
}

var hw = helloWorldGenerator()
// 调用及运行结果：
hw.next() // { value: 'hello', done: false }
hw.next() // { value: 'world', done: false }
hw.next() // { value: 'ending', done: true }
hw.next() // { value: undefined, done: true }
// 缺点: 每次都要自己手动调用next()
// 优点： 函数能够暂停执行

// 实现一个generator函数自动执行器函数  也就是 co模块
function co(generatorFunction) {
	return new Promise((resolve, reject) => {
		const generator = generatorFunction()

		function step(nextResult) {
			if (nextResult.done) {
				return resolve(nextResult.value)
			}

			Promise.resolve(nextResult.value)
				.then((result) => step(generator.next(result)))
				.catch((error) => reject(error))
		}

		step(generator.next())
	})
}

//丰富版处理 yield后 不是promise的情况

// 第二版
function run(gen) {
	var gen = gen()

	return new Promise(function (resolve, reject) {
		function next(data) {
			try {
				var result = gen.next(data)
			} catch (e) {
				return reject(e)
			}

			if (result.done) {
				return resolve(result.value)
			}

			var value = toPromise(result.value)

			value.then(
				function (data) {
					next(data)
				},
				function (e) {
					reject(e)
				}
			)
		}

		next()
	})
}

function isPromise(obj) {
	return 'function' == typeof obj.then
}

function toPromise(obj) {
	if (isPromise(obj)) return obj
	if ('function' == typeof obj) return thunkToPromise(obj)
	return obj
}

function thunkToPromise(fn) {
	return new Promise(function (resolve, reject) {
		fn(function (err, res) {
			if (err) return reject(err)
			resolve(res)
		})
	})
}

// module.exports = run;

//最终版 代码优化
// 第三版
function run(gen) {
	return new Promise(function (resolve, reject) {
		if (typeof gen == 'function') gen = gen()

		// 如果 gen 不是一个迭代器
		if (!gen || typeof gen.next !== 'function') return resolve(gen)

		onFulfilled()

		function onFulfilled(res) {
			var ret
			try {
				ret = gen.next(res)
			} catch (e) {
				return reject(e)
			}
			next(ret)
		}

		function onRejected(err) {
			var ret
			try {
				ret = gen.throw(err)
			} catch (e) {
				return reject(e)
			}
			next(ret)
		}

		function next(ret) {
			if (ret.done) return resolve(ret.value)
			var value = toPromise(ret.value)
			if (value && isPromise(value))
				return value.then(onFulfilled, onRejected)
			return onRejected(
				new TypeError(
					'You may only yield a function, promise ' +
						'but the following object was passed: "' +
						String(ret.value) +
						'"'
				)
			)
		}
	})
}

function isPromise(obj) {
	return 'function' == typeof obj.then
}

function toPromise(obj) {
	if (isPromise(obj)) return obj
	if ('function' == typeof obj) return thunkToPromise(obj)
	return obj
}

function thunkToPromise(fn) {
	return new Promise(function (resolve, reject) {
		fn(function (err, res) {
			if (err) return reject(err)
			resolve(res)
		})
	})
}

// module.exports = run;
