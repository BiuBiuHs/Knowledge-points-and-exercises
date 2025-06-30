// https://leetcode.cn/problems/add-binary/description/
// 67. 二进制求和
// 简单
// 相关标签
// premium lock icon
// 相关企业
// 给你两个二进制字符串 a 和 b ，以二进制字符串的形式返回它们的和。

// 示例 1：

// 输入:a = "11", b = "1"
// 输出："100"
// 示例 2：

// 输入：a = "1010", b = "1011"
// 输出："10101"

// 提示：

// 1 <= a.length, b.length <= 104
// a 和 b 仅由字符 '0' 或 '1' 组成
// 字符串如果不是 "0" ，就不含前导零

/**
 * @param {string} a - 第一个二进制字符串
 * @param {string} b - 第二个二进制字符串
 * @return {string} - 返回两个二进制字符串相加的结果
 */
var addBinary = function (a, b) {
	let ans = ""; // 用于存储结果字符串
	let ca = 0; // 用于存储进位值

	// 从两个字符串的末尾开始遍历，直到两个字符串都遍历完
	for (let i = a.length - 1, j = b.length - 1; i >= 0 || j >= 0; i--, j--) {
		let sum = ca; // 初始化当前位的和为进位值

		// 如果 a 字符串还有剩余字符，将其当前位的值加到 sum 上
		sum += i >= 0 ? parseInt(a[i]) : 0;

		// 如果 b 字符串还有剩余字符，将其当前位的值加到 sum 上
		sum += j >= 0 ? parseInt(b[j]) : 0;

		// 计算当前位的值，取 sum 的模 2
		ans += sum % 2;

		// 更新进位值，取 sum 的整除 2
		ca = Math.floor(sum / 2);
	}

	// 如果最后还有进位值，将其添加到结果字符串中
	ans += ca == 1 ? ca : "";

	// 由于结果字符串是从低位到高位构建的，需要将其反转
	return ans.split("").reverse().join("");
};
