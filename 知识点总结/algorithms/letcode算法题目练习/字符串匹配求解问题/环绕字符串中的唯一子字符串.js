// 定义字符串 base 为一个 "abcdefghijklmnopqrstuvwxyz" 无限环绕的字符串，所以 base 看起来是这样的：

// "...zabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcd....".
// 给你一个字符串 s ，请你统计并返回 s 中有多少 不同非空子串 也在 base 中出现。

// 示例 1：

// 输入：s = "a"
// 输出：1
// 解释：字符串 s 的子字符串 "a" 在 base 中出现。
// 示例 2：

// 输入：s = "cac"
// 输出：2
// 解释：字符串 s 有两个子字符串 ("a", "c") 在 base 中出现。

/**
 * @param {string} s
 * @return {number}
 */
var findSubstringInWraproundString = function (s) {
	if (!s) return 0

	// 初始化一个对象，用于存储以每个字符结尾的最长子串长度
	let maxLength = {}
	for (let c of 'abcdefghijklmnopqrstuvwxyz') {
		maxLength[c] = 0
	}

	let currentLength = 0

	for (let i = 0; i < s.length; i++) {
		if (i > 0 && (s.charCodeAt(i) - s.charCodeAt(i - 1) + 26) % 26 === 1) {
			currentLength++
		} else {
			currentLength = 1
		}

		// 更新以当前字符结尾的最长子串长度
		maxLength[s[i]] = Math.max(maxLength[s[i]], currentLength)
	}

	// 所有不同的子串数量就是所有字符的最长子串长度之和
	return Object.values(maxLength).reduce((sum, val) => sum + val, 0)
}

// 1.我们使用一个普通的 JavaScript 对象 maxLength 来代替 Python 中的字典。

// 2.在 JavaScript 中，我们需要使用 charCodeAt() 方法来获取字符的 ASCII 码，以便进行字符的连续性判断。

// 3.在计算字符的连续性时，我们添加了 26 并取模，以确保在 'z' 到 'a' 的转换也被正确处理。

// 4.最后，我们使用 Object.values() 和 reduce() 方法来计算所有最长子串长度的和，这相当于 Python 中的 sum(max_length.values())。

// 这个实现的时间复杂度仍然是 O(n)，其中 n 是字符串 s 的长度。空间复杂度是 O(1)，因为我们使用的额外空间（maxLength 对象）大小是固定的（26个键值对）。

console.log(findSubstringInWraproundString('a')) // 输出: 1
console.log(findSubstringInWraproundString('cac')) // 输出: 2
console.log(findSubstringInWraproundString('zab')) // 输出: 6
