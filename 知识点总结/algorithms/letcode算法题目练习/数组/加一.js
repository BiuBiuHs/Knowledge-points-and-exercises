// 给定一个由 整数 组成的 非空 数组所表示的非负整数，在该数的基础上加一。

// 最高位数字存放在数组的首位， 数组中每个元素只存储单个数字。

// 你可以假设除了整数 0 之外，这个整数不会以零开头。

//

// 示例 1：

// 输入：digits = [1,2,3]
// 输出：[1,2,4]
// 解释：输入数组表示数字 123。
// 示例 2：

// 输入：digits = [4,3,2,1]
// 输出：[4,3,2,2]
// 解释：输入数组表示数字 4321。
// 示例 3：

// 输入：digits = [0]
// 输出：[1]
//

// 提示：

// 1 <= digits.length <= 100
// 0 <= digits[i] <= 9

// 链接：https://leetcode-cn.com/problems/plus-one

/**
 * @param {number[]} digits
 * @return {number[]}
 */
var plusOne = function (digits) {
	let len = digits.length;

	for (var i = len - 1; i >= 0; i--) {
		digits[i]++;
		digits[i] %= 10;
		if (digits[i] != 0) return digits; //当某一位不为0 说明可以返回了
	}
	digits = [...Array(len + 1)].map((_) => 0); //当走到这里时说明 所有位都为0  也就是 N个9 的情况 此时只需要填充len + 1 长度的数组的值为0 并将设置进位 为1 即可
	digits[0] = 1;
	return digits;
};

// 解法2

/**
 * @param {number[]} digits
 * @return {number[]}
 */
// 这个函数实现了一个大整数加 1 的操作，其中整数以数组形式表示，每个数组元素对应一个数位。函数处理了两种情况：

// 常规情况：找到最右边的非 9 数字，将其加 1，并将其右侧所有数字置为 0
// 特殊情况：当所有数字都是 9 时（如 99、999 等），需要增加数组长度，并将结果设置为 10...0（第一位为 1，其余为 0）
// 这种实现方式避免了整数溢出问题，可以处理任意长度的整数加 1 操作。时间复杂度为 O(n)，其中 n 是数组长度。
var plusOne = function (digits) {
	let n = digits.length;
	for (var i = n - 1; i >= 0; i--) {
		if (digits[i] !== 9) {
			digits[i]++;
			for (var j = i + 1; j < n; j++) {
				digits[j] = 0;
			}
			return digits;
		}
	}
	const ans = new Array(n + 1).fill(0);
	ans[0] = 1;
	return ans;
};
