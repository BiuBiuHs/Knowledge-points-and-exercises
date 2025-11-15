// 给定一个整数数组 nums，将数组中的元素向右轮转 k 个位置，其中 k 是非负数。

// 示例 1:

// 输入: nums = [1,2,3,4,5,6,7], k = 3
// 输出: [5,6,7,1,2,3,4]
// 解释:
// 向右轮转 1 步: [7,1,2,3,4,5,6]
// 向右轮转 2 步: [6,7,1,2,3,4,5]
// 向右轮转 3 步: [5,6,7,1,2,3,4]
// 示例 2:

// 输入：nums = [-1,-100,3,99], k = 2
// 输出：[3,99,-1,-100]
// 解释:
// 向右轮转 1 步: [99,-1,-100,3]
// 向右轮转 2 步: [3,99,-1,-100]

//暴力解法  超时

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var rotate = function (nums, k) {
	while (k > 0) {
		const cur = nums.pop()
		nums.unshift(cur)
		k--
	}
}

// 方法二
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {void} Do not return anything, modify nums in-place instead.
 */
function rotate(nums, k) {
	const n = nums.length
	k = k % n // 处理 k 大于数组长度的情况
	const temp = nums.slice(-k) // 复制后 k 个元素

	// 将前 n-k 个元素向右移动
	for (let i = n - 1; i >= k; i--) {
		nums[i] = nums[i - k]
	}

	// 将临时数组中的元素放到数组前面
	for (let i = 0; i < k; i++) {
		nums[i] = temp[i]
	}
}
