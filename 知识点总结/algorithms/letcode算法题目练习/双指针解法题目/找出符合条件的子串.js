/**
 * 查找最长符合条件的子串长度
 * @param {string} s - 输入的字符串
 * @returns {number} - 最长符合条件的子串长度，如果不存在则返回 -1
 */
function longestValidSubstring(s) {
	let maxLength = -1
	let left = 0
	let letterIndex = -1

	for (let right = 0; right < s.length; right++) {
		if (/[a-zA-Z]/.test(s[right])) {
			// 如果遇到字母
			if (letterIndex !== -1) {
				// 如果已经有一个字母了，更新left到上一个字母的下一个位置
				left = letterIndex + 1
			}
			letterIndex = right
		}

		// 检查当前子串是否有效
		if (letterIndex >= left) {
			maxLength = Math.max(maxLength, right - left + 1)
		}
	}

	return maxLength > 1 ? maxLength : -1
}

// 测试
console.log(longestValidSubstring('abC124ACb')) // 应输出 4
console.log(longestValidSubstring('a1B2c3D4')) // 应输出 3
console.log(longestValidSubstring('12345')) // 应输出 -1
console.log(longestValidSubstring('abcde')) // 应输出 -1
console.log(longestValidSubstring('1234A5678')) // 应输出 9
