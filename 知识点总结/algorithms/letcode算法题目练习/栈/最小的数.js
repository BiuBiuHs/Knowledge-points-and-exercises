// 给一个正整数NUM1，计算出新正整数NUM2，NUM2为NUM1中移除N位数字后的结果，需要使得NUM2的值最小。

// 输入描述
// 1.输入的第一行为一个字符串，字符串由0-9字符组成，记录正整数NUM1，NUM1长度小于32。
// 2.输入的第二行为需要移除的数字的个数，小于NUM1长度。

// 输出描述
// 输出一个数字字符串，记录最小值NUM2。

// 用例
// 输入

// 2615371
// 4
// 输出

// 131
// 解题思路
// 原题：********************************************************

// 维护一个单调递增的栈来实现移除数字

// 初始化一个空栈 stack，用于存储需要保留的数字。
// 遍历输入的正整数 NUM1 中的每个字符。
// 对于当前字符，检查栈顶元素是否大于当前字符，如果是，则出栈并减少需要移除的数字个数。这样可以确保移除的数字使得新正整数 NUM2 的值最小。
// 将当前字符入栈。
// 遍历完成后，如果仍有需要移除的数字个数，从栈顶开始移除剩余的数字。
// 将栈中的字符连接成一个字符串，去除前导零，输出结果。如果结果为空，则输出 "0"。
function findMinNum(str, k) {
	let removeCount = 0
	let stack = []
	for (var num of str) {
		while (
			stack.length &&
			parseInt(stack[stack.length - 1]) > parseInt(num) &&
			removeCount < k
		) {
			stack.pop()
			removeCount++
		}
		stack.push(num)
	}
	while (removeCount < k) {
		stack.pop()
		removeCount++
	}
	if (stack.length && stack[0] == '0') {
		stack.shift()
	}

	return stack.length ? stack.join('') : 0
}
console.log(findMinNum('2615371', 4))
