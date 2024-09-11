// 给你一个下标从 0 开始的字符串 s ，重复执行下述操作 任意 次：

// 在字符串中选出一个下标 i ，并使 c 为字符串下标 i 处的字符。并在 i 左侧（如果有）和 右侧（如果有）各 删除 一个距离 i 最近 的字符 c 。
// 请你通过执行上述操作任意次，使 s 的长度 最小化 。

// 返回一个表示 最小化 字符串的长度的整数。

// 示例 1：

// 输入：s = "aaabc"
// 输出：3
// 解释：在这个示例中，s 等于 "aaabc" 。我们可以选择位于下标 1 处的字符 'a' 开始。接着删除下标 1 左侧最近的那个 'a'（位于下标 0）以及下标 1 右侧最近的那个 'a'（位于下标 2）。执行操作后，字符串变为 "abc" 。继续对字符串执行任何操作都不会改变其长度。因此，最小化字符串的长度是 3 。

//因为可以从当前字符串的左侧与右侧任意删除一个 与它相同的字符 ，所以此题目转换为求 不同字符出现的次数。
/**
 * @param {string} s
 * @return {number}
 */
var minLengthAfterOperations = function (s) {
	let strMap = {}

	for (let char of s) {
		if (!strMap[char]) {
			strMap[char] = 1
		}
	}

	return Object.values(strMap).length
}

// 测试
console.log(minLengthAfterOperations('aaabc')) // 输出: 3
console.log(minLengthAfterOperations('abcccabba')) // 输出: 2
console.log(minLengthAfterOperations('dddaaa')) // 输出: 0
