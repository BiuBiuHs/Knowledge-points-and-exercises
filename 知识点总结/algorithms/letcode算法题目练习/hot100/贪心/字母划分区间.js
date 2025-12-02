// https://leetcode.cn/problems/partition-labels/description/?envType=study-plan-v2&envId=top-100-liked
// 给你一个字符串 s 。我们要把这个字符串划分为尽可能多的片段，同一字母最多出现在一个片段中。例如，字符串 "ababcc" 能够被分为 ["abab", "cc"]，但类似 ["aba", "bcc"] 或 ["ab", "ab", "cc"] 的划分是非法的。

// 注意，划分结果需要满足：将所有划分结果按顺序连接，得到的字符串仍然是 s 。

// 返回一个表示每个字符串片段的长度的列表。

// 示例 1：
// 输入：s = "ababcbacadefegdehijhklij"
// 输出：[9,7,8]
// 解释：
// 划分结果为 "ababcbaca"、"defegde"、"hijhklij" 。
// 每个字母最多出现在一个片段中。
// 像 "ababcbacadefegde", "hijhklij" 这样的划分是错误的，因为划分的片段数较少。
// 示例 2：

// 输入：s = "eccbbbbdec"
// 输出：[10]

// 提示：

// 1 <= s.length <= 500
// s 仅由小写英文字母组成

// 贪心
/**
 * @param {string} s
 * @return {number[]}
 */
var partitionLabels = function (s) {
	// 初始化结果数组，用于存储每个分区的长度
	let res = [];

	// 初始化哈希表，用于存储每个字符最后一次出现的位置
	let hashMap = {};

	// 遍历字符串，记录每个字符最后一次出现的位置
	for (let i = 0; i < s.length; i++) {
		hashMap[s[i]] = i;
	}

	// 初始化左指针和右指针
	let left = 0;
	let right = 0;

	// 遍历字符串，确定每个分区的边界
	for (let i = 0; i < s.length; i++) {
		// 更新右指针为当前字符最后一次出现的位置的最大值
		right = Math.max(right, hashMap[s[i]]);

		// 如果当前指针位置等于右指针位置，说明找到了一个分区
		if (i === right) {
			// 计算当前分区的长度
			let curStrLen = right - left + 1;

			// 更新左指针为下一个分区的起始位置
			left = right + 1;

			// 将当前分区的长度添加到结果数组中
			res.push(curStrLen);
		}
	}

	// 返回结果数组
	return res;
};

// 详细解释
// 初始化结果数组：

// let res = [];
// 初始化一个空数组 res，用于存储每个分区的长度。
// 初始化哈希表：

// let hashMap = {};
// 初始化一个空对象 hashMap，用于存储每个字符最后一次出现的位置。
// 记录每个字符最后一次出现的位置：

// for (let i = 0; i < s.length; i++) { hashMap[s[i]] = i; }
// 遍历字符串 s，将每个字符 s[i] 的最后一次出现位置 i 记录在 hashMap 中。
// 初始化左指针和右指针：

// let left = 0;
// let right = 0;
// 初始化两个指针 left 和 right，分别表示当前分区的起始位置和结束位置。
// 确定每个分区的边界：

// for (let i = 0; i < s.length; i++) { ... }
// 遍历字符串 s，确定每个分区的边界。
// right = Math.max(right, hashMap[s[i]]);
// 更新右指针 right 为当前字符 s[i] 最后一次出现的位置的最大值。
// if (i === right) { ... }
// 如果当前指针位置 i 等于右指针 right，说明找到了一个分区。
// let curStrLen = right - left + 1;
// 计算当前分区的长度 curStrLen。
// left = right + 1;
// 更新左指针 left 为下一个分区的起始位置。
// res.push(curStrLen);
// 将当前分区的长度 curStrLen 添加到结果数组 res 中。
// 返回结果数组：

// return res;
// 返回结果数组 res，其中包含每个分区的长度。
