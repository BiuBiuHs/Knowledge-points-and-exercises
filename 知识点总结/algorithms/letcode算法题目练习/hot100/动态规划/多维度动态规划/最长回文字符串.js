// https://leetcode.cn/problems/longest-palindromic-substring/description/
// 给你一个字符串 s，找到 s 中最长的回文子串。

// 如果字符串的反序与原始字符串相同，则该字符串称为回文字符串。

// 示例 1：

// 输入：s = "babad"
// 输出："bab"
// 解释："aba" 同样是符合题意的答案。
// 示例 2：

// 输入：s = "cbbd"
// 输出："bb"

// 提示：

// 1 <= s.length <= 1000
// s 仅由数字和英文字母组成

//解法1 中心扩散法
/**
 * 遍历一次数组即可得到题解，但是耗费空间 需要对每个位置都进行枚举
 * 把第i个数组的字符串当作 最长回文字符串的中心字符，向两侧进行扩散，并且保证左右的字符串相等，或左侧（右侧）的字符串与中心位置的字符相等
 *
 * 遍历方式为从内部向外扩散，如果某个字符串的子字符串都是回文，那么此字符串一定是回文字符串。
 *
 */

/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function (s) {
	//边界条件 s小于2时一定是回文字符串
	if (s.length < 2) return s;
	let strlen = s.length;
	let left = 0;
	let right = 0;
	let maxLen = 0;
	let maxStart = 0;
	let len = 1;

	for (let i = 0; i < strlen; i++) {
		left = i - 1;
		right = i + 1;

		//满足左侧与中心位置字符相等
		while (left >= 0 && s.charAt(left) === s.charAt(i)) {
			left--;
			len++;
		}
		//满足右侧与中心位置字符相等
		while (right < strlen && s.charAt(right) === s.charAt(i)) {
			len++;
			right++;
		}
		//当左右都不与中心相等时，判断左右的两个字符是否相当
		while (left >= 0 && right < strlen && s.charAt(left) === s.charAt(right)) {
			left--;
			right++;
			len += 2;
		}
		//判断此时是否是最长的回文
		if (len > maxLen) {
			maxLen = len;
			maxStart = left;
		}
		len = 1;
	}
	return s.substring(maxStart + 1, maxStart + maxLen + 1);
};

// ### 优化后的代码
function longestPalindrome(s) {
	const n = s.length;
	if (n < 2) return s;

	let dp = Array.from({ length: n }, () => Array(n).fill(false));
	let start = 0; // 最长回文子串的起始位置
	let maxLength = 1; // 最长回文子串的长度

	// 初始化单个字符的回文
	for (let i = 0; i < n; i++) {
		dp[i][i] = true;
	}

	// 动态规划填表
	for (let len = 2; len <= n; len++) {
		// len 为此轮计算的子串长度
		for (let i = 0; i <= n - len; i++) {
			// 子串的起始位置
			let j = i + len - 1; // 子串的结束位置
			if (s[i] === s[j]) {
				if (len === 2) {
					// 两个字符的情况
					dp[i][j] = true;
				} else {
					dp[i][j] = dp[i + 1][j - 1];
				}
			}

			if (dp[i][j] && len > maxLength) {
				maxLength = len;
				start = i;
			}
		}
	}

	return s.substring(start, start + maxLength);
}

// 示例
console.log(longestPalindrome("babad")); // 输出 "bab" 或 "aba"
console.log(longestPalindrome("cbbd")); // 输出 "bb"

// ### 优化后的逻辑解释
// 1. **初始化**：
//    - `n` 是字符串的长度。
//    - `dp` 是一个 `n x n` 的二维布尔数组，用于记录子串是否为回文。
//    - `start` 记录最长回文子串的起始位置。
//    - `maxLength` 记录最长回文子串的长度。

// 2. **单个字符的回文**：
//    - 遍历字符串，将每个单个字符标记为回文子串。

// 3. **动态规划填表**：
//    - **外层循环** `len` 表示子串的长度，从 2 开始到 `n`。
//      - 这样确保了我们从最短的子串开始处理，逐步扩展到更长的子串。
//    - **内层循环** `i` 表示子串的起始位置，从 0 到 `n - len`。
//          子串的起始位置也就是 left  最多只能到原字符串的长度 减去 当前这轮子串的长度
//      - `j` 是子串的结束位置，计算公式为 `j = i + len - 1`。
//          结束位置下标 就是 起始位置 + 长度 - 1
//    - **检查子串是否为回文**：
//      - 如果 `s[i]` 和 `s[j]` 相等：
//        - 如果子串长度为 2，则直接标记为回文。
//        - 否则，检查 `s[i+1...j-1]` 是否为回文。
//    - **更新最长回文子串**：
//      - 如果当前子串是回文且长度大于 `maxLength`，更新 `maxLength` 和 `start`。

// ### 逻辑思路
// 1. **从短到长**：
//    - 从长度为 2 的子串开始，逐步扩展到长度为 `n` 的子串。
//    - 这样可以确保在处理长度为 `len` 的子串时，所有比 `len` 短的子串已经处理过，从而可以正确地使用 `dp[i + 1][j - 1]` 的值。

// 2. **子串的起始位置**：
//    - 对于每个长度 `len`，遍历所有可能的起始位置 `i`，计算对应的结束位置 `j`。
//    - 这样确保了所有长度为 `len` 的子串都被检查到。

// 3. **检查和更新**：
//    - 每次检查当前子串是否为回文，并在必要时更新最长回文子串的起始位置和长度。

// 希望这个优化后的代码和解释对你有帮助！如果有任何进一步的问题或需要调整的地方，请随时告诉我。
