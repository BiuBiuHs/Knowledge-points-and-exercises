// 给你一个字符串 s，最多 可以从中删除一个字符。

// 请你判断 s 是否能成为回文字符串：如果能，返回 true ；否则，返回 false 。

/**
 * @param {string} s
 * @return {boolean}
 */
var validPalindrome = function (s) {
	let left = 0
	let right = s.length - 1

	while (left < right) {
		if (s[left] !== s[right]) {
			return (
				//判断子串是否为回文数
				isSubStrPalindrome(s, left + 1, right) ||
				isSubStrPalindrome(s, left, right - 1)
			)
		}
		left++
		right--
	}
	return true
}
function isSubStrPalindrome(s, left, right) {
	while (left < right) {
		if (s[left] !== s[right]) {
			return false
		}
		left++
		right--
	}
	return true
}
