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
function subarraySum(nums, k) {
	// 初始化计数器和前缀和
	let count = 0;
	let sum = 0;

	// 使用 Map 存储前缀和及其出现次数
	const map = new Map();
	map.set(0, 1); // 初始化，前缀和为0出现1次

	// 遍历数组
	for (let num of nums) {
		// 计算当前的前缀和
		sum += num;

		// 如果 map 中存在 sum - k，说明找到了和为 k 的连续子数组
		if (map.has(sum - k)) {
			count += map.get(sum - k);
		}

		// 更新 map
		map.set(sum, (map.get(sum) || 0) + 1);
	}

	return count;
}
