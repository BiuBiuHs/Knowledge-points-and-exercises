// https://leetcode.cn/problems/product-of-array-except-self/description/?envType=study-plan-v2&envId=top-interview-150

// 给你一个整数数组 nums，返回 数组 answer ，其中 answer[i] 等于 nums 中除 nums[i] 之外其余各元素的乘积 。

// 题目数据 保证 数组 nums之中任意元素的全部前缀元素和后缀的乘积都在  32 位 整数范围内。

// 请 不要使用除法，且在 O(n) 时间复杂度内完成此题。

// 示例 1:

// 输入: nums = [1,2,3,4]
// 输出: [24,12,8,6]
// 示例 2:

// 输入: nums = [-1,1,0,-3,3]
// 输出: [0,0,9,0,0]

// 提示：

// 2 <= nums.length <= 105
// -30 <= nums[i] <= 30
// 保证 数组 nums之中任意元素的全部前缀元素和后缀的乘积都在  32 位 整数范围内

// 进阶：你可以在 O(1) 的额外空间复杂度内完成这个题目吗？（ 出于对空间复杂度分析的目的，输出数组 不被视为 额外空间。）

/**
 * @param {number[]} nums
 * @return {number[]}
 */
var productExceptSelf = function (nums) {
	let n = nums.length;

	// 初始化左侧乘积数组和右侧乘积数组
	let L = new Array(n);
	let R = new Array(n);
	let anwser = new Array(n);

	// 计算左侧乘积

	//下标为0的元素的左侧没有其他元素， 因为不能包含当前元素，所以左侧数组的第一个值为1，后续计算 对因位置的元素的左侧数字的乘积
	L[0] = 1;
	//以此计算左侧所有数字的乘积
	for (var i = 1; i < n; i++) {
		L[i] = nums[i - 1] * L[i - 1];
	}

	// 初始化右侧乘积的最后一个元素
	R[n - 1] = 1;

	// 计算右侧乘积
	//从右侧开始计算得到的乘积
	for (var i = n - 2; i >= 0; i--) {
		R[i] = nums[i + 1] * R[i + 1];
	}

	// 计算最终结果：左侧乘积 * 右侧乘积
	for (var i = 0; i < n; i++) {
		anwser[i] = L[i] * R[i];
	}
	return anwser;
};
