// https://bigfrontend.dev/zh/problem/unique-class-name

// 请完成一个class name生成函数 并满足以下要求

// 仅使用字母: a - z , A - Z
// 调用一次返回一个类名
// 返回的类名序列需要满足: 先短后长，相同长度按照字母排序（小写字母优先）
// 同时提供一个reset函数

getUniqueClassName()
// 'a'

getUniqueClassName()
// 'b'

getUniqueClassName()
// 'c'

// skip cases till 'Y'

getUniqueClassName()
// 'Z'

getUniqueClassName()
// 'aa'

getUniqueClassName()
// 'aaa'

// ...等等

/**
 * @returns {string}
 */

const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
let id = 52
function getUniqueClassName() {
	// your code here
	let className = ''
	let num = id++
	//要注意这里的 符号不能是 >= 否则会直接输出aa
	while (num > 0) {
		//取余相当于 生成字符串的后面的字符 即倒序生成 需要将之前生成的className拼接在后方 。
		className = chars[num % chars.length] + className
		//num 相当于需要遍历的次数 是整数倍就会生成 整数倍为 位数 字符串
		num = Math.floor(num / chars.length) - 1
		//3倍 > aaa 2倍=》 aa
	}
	return className
}

getUniqueClassName.reset = function () {
	// your code here
	id = 0
}
