// 给定一个 24 小时制（小时:分钟 "HH:MM"）的时间列表，找出列表中任意两个时间的最小时间差并以分钟数表示。

// 示例 1：

// 输入：timePoints = ["23:59","00:00"]
// 输出：1
// 示例 2：

// 输入：timePoints = ["00:00","23:59","00:00"]
// 输出：0
/**
 * @param {string[]} words
 * @return {string[]}
 */
var findWords = function (words) {
	const row1 = new Set('qwertyuiop')
	const row2 = new Set('asdfghjkl')
	const row3 = new Set('zxcvbnm')

	const result = []

	for (let word of words) {
		const lowercaseWord = word.toLowerCase()
		if (
			canBeTypedInOneRow(lowercaseWord, row1) ||
			canBeTypedInOneRow(lowercaseWord, row2) ||
			canBeTypedInOneRow(lowercaseWord, row3)
		) {
			result.push(word)
		}
	}

	return result
}

function canBeTypedInOneRow(word, row) {
	for (let char of word) {
		if (!row.has(char)) {
			return false
		}
	}
	return true
}
