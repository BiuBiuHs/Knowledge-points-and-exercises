function curry(fn, ...args) {
	return function (...innerArgs) {
		const allArgs = [...args, ...innerArgs]

		if (fn.length <= allArgs.length) {
			// 说明已经接受完所有参数，这个时候可以执行了
			return fn.apply(this, allArgs)
		} else {
			// 继续返回函数，收集参数
			return curry(fn, ...allArgs)
		}
	}
}
const add = curry((a, b, c) => a + b + c)
console.log(add(1, 2, 3)) // 6
console.log(add(1)(2, 3)) // 6
console.log(add(1)(2)(3)) // 6
