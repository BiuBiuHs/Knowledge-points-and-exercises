// https://leetcode.cn/problems/minimum-swaps-to-make-strings-equal/description/
// 有两个长度相同的字符串 s1 和 s2，且它们其中 只含有 字符 "x" 和 "y"，你需要通过「交换字符」的方式使这两个字符串相同。

// 每次「交换字符」的时候，你都可以在两个字符串中各选一个字符进行交换。

// 交换只能发生在两个不同的字符串之间，绝对不能发生在同一个字符串内部。也就是说，我们可以交换 s1[i] 和 s2[j]，但不能交换 s1[i] 和 s1[j]。

// 最后，请你返回使 s1 和 s2 相同的最小交换次数，如果没有方法能够使得这两个字符串相同，则返回 -1 。

// 示例 1：

// 输入：s1 = "xx", s2 = "yy"
// 输出：1
// 解释：
// 交换 s1[0] 和 s2[1]，得到 s1 = "yx"，s2 = "yx"。
// 示例 2：

// 输入：s1 = "xy", s2 = "yx"
// 输出：2
// 解释：
// 交换 s1[0] 和 s2[0]，得到 s1 = "yy"，s2 = "xx" 。
// 交换 s1[0] 和 s2[1]，得到 s1 = "xy"，s2 = "xy" 。
// 注意，你不能交换 s1[0] 和 s1[1] 使得 s1 变成 "yx"，因为我们只能交换属于两个不同字符串的字符。
// 示例 3：

// 输入：s1 = "xx", s2 = "xy"
// 输出：-1

// 提示：

// 1 <= s1.length, s2.length <= 1000
// s1.length == s2.length
// s1, s2 只包含 'x' 或 'y'。

// 题解
// 1.初始化计数器：

// count_x_y 用于记录 s1 中的 'x' 对应 s2 中的 'y' 的位置数量。
// count_y_x 用于记录 s1 中的 'y' 对应 s2 中的 'x' 的位置数量。
// 遍历字符串：

// 2. 通过一个循环遍历 s1 和 s2，统计不同字符的位置数量。

// 3.计算最小交换次数：

// 每两个不同字符可以通过一次交换解决，因此 swaps += Math.floor(count_x_y / 2) 和 swaps += Math.floor(count_y_x / 2)。
// 如果 count_x_y 和 count_y_x 都是奇数，最后会剩下两个不同的字符，需要再进行一次交换，因此 swaps += 2。
// 如果 count_x_y 和 count_y_x 一个为奇数一个为偶数，无法通过交换使两个字符串相同，返回 -1。

/**
 * @param {string} s1
 * @param {string} s2
 * @return {number}
 */
var minimumSwap = function (s1, s2) {
	let xy = 0,
		yx = 0;
	let n = s1.length;
	for (let i = 0; i < n; i++) {
		if (s1[i] == "x" && s2[i] == "y") {
			xy++;
		}
		if (s1[i] == "y" && s2[i] == "x") {
			yx++;
		}
	}
	if ((xy + yx) % 2 == 1) return -1;
	// Math.floor(xy / 2) + Math.floor(yx / 2) 部分说明
	// 字符串1 中存在  xx 字符串2 中存在 yy 这种字符串 此时只需交换一次即可相等

	//  (xy % 2) + (yx % 2);
	// 如果 xy 与yx 为基数说明必须要交换两次才可以使得 字符串相等  因为只能和对方的字符串相交换
	// 题目限制条件 ==》 我们可以交换 s1[i] 和 s2[j]，但不能交换 s1[i] 和 s1[j]。
	// 字符串1。xy  字符串2 为 yx
	return Math.floor(xy / 2) + Math.floor(yx / 2) + (xy % 2) + (yx % 2);
};
