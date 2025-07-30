// https://leetcode.cn/problems/maximum-erasure-value/description/?envType=daily-question&envId=2025-07-22
// 给你一个正整数数组 nums ，请你从中删除一个含有 若干不同元素 的子数组。删除子数组的 得分 就是子数组各元素之 和 。

// 返回 只删除一个 子数组可获得的 最大得分 。

// 如果数组 b 是数组 a 的一个连续子序列，即如果它等于 a[l],a[l+1],...,a[r] ，那么它就是 a 的一个子数组。

// 示例 1：

// 输入：nums = [4,2,4,5,6]
// 输出：17
// 解释：最优子数组是 [2,4,5,6]
// 示例 2：

// 输入：nums = [5,2,1,2,5,2,1,2,5]
// 输出：8
// 解释：最优子数组是 [5,2,1] 或 [1,2,5]

// 提示：

// 1 <= nums.length <= 105
// 1 <= nums[i] <= 104

// 题解： 滑动窗口
//滑动窗口逻辑
// 外层循环 for (let i = 0; i < n; i++)：右指针 i 从左到右遍历数组。
// pSum += nums[i]：将当前元素 nums[i] 加入当前子数组的和中。
// 内层 while 循环 while (seen.has(nums[i]))：如果当前元素 nums[i] 已经在 seen 中，说明当前子数组中有重复元素，需要移动左指针 j，并从 seen 和 pSum 中移除 nums[j]，直到 nums[i] 不再在 seen 中。
// seen.add(nums[i])：将当前元素 nums[i] 加入 seen 中。
// res = Math.max(pSum, res)：更新最大子数组的和。
/**
 * @param {number[]} nums
 * @return {number}
 */
var maximumUniqueSubarray = function (nums) {
	const n = nums.length;
	const seen = new Set();
	let res = 0;
	let pSum = 0;
	let j = 0;

	for (let i = 0; i < n; i++) {
		// 将当前元素加入当前子数组的和中
		pSum += nums[i];

		// 如果当前元素已经在 seen 中，移动左指针 j，直到当前元素不在 窗口seen 中
		while (seen.has(nums[i])) {
			seen.delete(nums[j]);
			pSum -= nums[j];
			j++;
		}

		// 将当前元素加入 seen
		seen.add(nums[i]);

		// 更新最大子数组的和
		res = Math.max(pSum, res);
	}

	return res;
};
