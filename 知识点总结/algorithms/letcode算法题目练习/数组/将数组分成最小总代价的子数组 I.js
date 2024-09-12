// 给你一个长度为 n 的整数数组 nums 。

// 一个数组的 代价 是它的 第一个 元素。比方说，[1,2,3] 的代价是 1 ，[3,4,1] 的代价是 3 。

// 你需要将 nums 分成 3 个 连续且没有交集 的子数组。

// 请你返回这些
// 子数组
// 的 最小 代价 总和 。

// 示例 1：

// 输入：nums = [1,2,3,12]
// 输出：6
// 解释：最佳分割成 3 个子数组的方案是：[1] ，[2] 和 [3,12] ，总代价为 1 + 2 + 3 = 6 。
// 其他得到 3 个子数组的方案是：
// - [1] ，[2,3] 和 [12] ，总代价是 1 + 2 + 12 = 15 。
// - [1,2] ，[3] 和 [12] ，总代价是 1 + 3 + 12 = 16 。
// 示例 2：

// 输入：nums = [5,4,3]
// 输出：12
// 解释：最佳分割成 3 个子数组的方案是：[5] ，[4] 和 [3] ，总代价为 5 + 4 + 3 = 12 。
// 12 是所有分割方案里的最小总代价。

/**
 * @param {number[]} nums
 * @return {number}
 */
var minimumCost = function (nums) {
	if (nums.length <= 3) return nums.reduce((sum, next) => (sum += next), 0)
	const res = []
	const firstNum = nums.shift()
	const sortnums = nums.sort((a, b) => a - b)
	return firstNum + sortnums[0] + sortnums[1]
}
