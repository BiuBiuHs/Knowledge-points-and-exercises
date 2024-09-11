// 给你一个仅由数字组成的字符串 s，在最多交换一次 相邻 且具有相同 奇偶性 的数字后，返回可以得到的
// 字典序最小的字符串
// 。

// 如果两个数字都是奇数或都是偶数，则它们具有相同的奇偶性。例如，5 和 9、2 和 4 奇偶性相同，而 6 和 9 奇偶性不同。

// 示例 1：

// 输入： s = "45320"

// 输出： "43520"

// 解释：

// s[1] == '5' 和 s[2] == '3' 都具有相同的奇偶性，交换它们可以得到字典序最小的字符串。

// 示例 2：

// 输入： s = "001"

// 输出： "001"

// 解释：

// 无需进行交换，因为 s 已经是字典序最小的。

/**
 * @param {string} s
 * @return {string}
 */
var getSmallestString = function (s) {
	let arr = s.split('')
	let n = arr.length
	let swapped = false

	for (let i = 0; i < n - 1; i++) {
		if (swapped) break // 如果已经交换过，就停止

		// 检查相邻字符是否具有相同的奇偶性
		if (parseInt(arr[i]) % 2 === parseInt(arr[i + 1]) % 2) {
			// 如果下一个字符小于当前字符，交换它们
			if (arr[i + 1] < arr[i]) {
				;[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]
				swapped = true
			}
		}
	}

	return arr.join('')
}
