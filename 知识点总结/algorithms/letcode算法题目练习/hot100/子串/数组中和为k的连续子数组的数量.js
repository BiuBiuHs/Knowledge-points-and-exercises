// 给定一个整数数组和一个整数 k ，请找到该数组中和为 k 的连续子数组的个数。

// 示例 1：

// 输入:nums = [1,1,1], k = 2
// 输出: 2
// 解释: 此题 [1,1] 与 [1,1] 为两种不同的情况
// 示例 2：

// 输入:nums = [1,2,3], k = 3
// 输出: 2

// 提示:

// 1 <= nums.length <= 2 * 104
// -1000 <= nums[i] <= 1000
// -107 <= k <= 107

//因为数组中可能有负数 所以不可以使用滑动窗口
// 对于包含负数的数组，这个方法可能会错过一些解，
// 因为负数的存在使得和可能会减小，而滑动窗口方法假设和总是随着窗口扩大而增加。

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var subarraySum = function (nums, k) {
	let count = 0; // 用于记录和为 k 的子数组个数
	let pre = 0; // 用于记录当前的前缀和
	let hashMap = new Map(); // 用于存储前缀和及其出现的次数
	hashMap.set(0, 1); // 初始化哈希表，前缀和为 0 的情况出现一次

	for (var i = 0; i < nums.length; i++) {
		pre += nums[i]; // 更新当前的前缀和
		if (hashMap.has(pre - k)) {
			count += hashMap.get(pre - k); // 如果存在前缀和为 (pre - k) 的子数组，增加计数
		}
		if (hashMap.has(pre)) {
			hashMap.set(pre, hashMap.get(pre) + 1); // 更新当前前缀和的出现次数
		} else {
			hashMap.set(pre, 1); // 如果当前前缀和不存在于哈希表中，初始化其出现次数为 1
		}
	}
	return count; // 返回和为 k 的子数组个数
};
