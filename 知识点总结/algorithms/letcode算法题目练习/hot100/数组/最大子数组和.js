// https://leetcode.cn/problems/maximum-subarray/description/?envType=study-plan-v2&envId=baidu-2023-fall-sprint

// 给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

// 子数组 是数组中的一个连续部分。

// 示例 1：

// 输入：nums = [-2,1,-3,4,-1,2,1,-5,4]
// 输出：6
// 解释：连续子数组 [4,-1,2,1] 的和最大，为 6 。
// 示例 2：

// 输入：nums = [1]
// 输出：1
// 示例 3：

// 输入：nums = [5,4,-1,7,8]
// 输出：23

// 提示：

// 1 <= nums.length <= 105
// -104 <= nums[i] <= 104

// 思路和算法

// 假设 nums 数组的长度是 n，下标从 0 到 n−1。

// 我们用 f(i) 代表以第 i 个数结尾的「连续子数组的最大和」，那么很显然我们要求的答案就是：

// max ⁡0≤i≤n−1 {f(i)}

// 因此我们只需要求出每个位置的 f(i)，然后返回 f 数组中的最大值即可。那么我们如何求 f(i) 呢？我们可以考虑 nums[i] 单独成为一段还是加入 f(i−1) 对应的那一段，
// 这取决于 nums[i]和 f(i−1)+nums[i]的大小，我们希望获得一个比较大的，于是可以写出这样的动态规划转移方程：

// f(i) = max ⁡{ f(i−1) + nums[i], nums[i] }

// 不难给出一个时间复杂度 O(n)、空间复杂度 O(n) 的实现，即用一个 f 数组来保存 f(i) 的值，用一个循环求出所有 f(i)。
// 考虑到 f(i)只和 f(i−1) 相关，于是我们可以只用一个变量 pre来维护对于当前 f(i) 的 f(i−1)的值是多少，从而让空间复杂度降低到 O(1)

var maxSubArray = function (nums) {
	let maxAns = nums[0],
		prev = 0;
	nums.forEach((item) => {
		//prev：记录当前子数组的和，每次迭代时决定是继续扩展当前子数组还是从当前元素开始一个新的子数组。
		// maxAns：记录当前找到的最大子数组和，每次迭代时更新为当前最大值。
		prev = Math.max(item, prev + item);
		maxAns = Math.max(maxAns, prev);
	});
	return maxAns;
};
