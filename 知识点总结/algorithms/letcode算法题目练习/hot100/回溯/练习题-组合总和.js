/**
 * 39. 组合总和
 * https://leetcode.cn/problems/combination-sum/
 *
 * 题目：给定一个无重复元素的数组 candidates 和一个目标数 target
 * 找出 candidates 中所有可以使数字和为 target 的组合。
 * candidates 中的数字可以无限制重复被选取。
 *
 * 示例：
 * 输入：candidates = [2,3,6,7], target = 7
 * 输出：[[2,2,3],[7]]
 *
 * 说明：
 * - 所有数字（包括 target）都是正整数
 * - 解集不能包含重复的组合
 */

/**
 * 方法1：回溯模板
 */
function combinationSum(candidates, target) {
	// TODO: 实现回溯算法
	let res = [];
	let path = [];

	function backtrack(start, sum) {
		// 1. 终止条件：和等于目标值
		// 2. 剪枝：和超过目标值，提前返回
		// 3. 选择循环：从 start 开始（可以重复选择）
		// 4. 处理节点
		// 5. 递归（注意：可以重复选择，所以从 i 开始）
		// 6. 回溯
	}

	backtrack(0, 0);
	return res;
}

// 测试
console.log("=== 组合总和问题 ===");
console.log("输入：candidates = [2,3,6,7], target = 7");
console.log("输出：", combinationSum([2, 3, 6, 7], 7));
console.log("期望：[[2,2,3],[7]]");

/**
 * ============================================
 * 参考答案
 * ============================================
 */
function combinationSumAnswer(candidates, target) {
	let res = [];
	let path = [];

	function backtrack(start, sum) {
		// 1. 终止条件：和等于目标值
		if (sum === target) {
			res.push([...path]);
			return;
		}

		// 2. 剪枝：和超过目标值，提前返回
		if (sum > target) {
			return;
		}

		// 3. 选择循环：从 start 开始，可以重复选择
		for (let i = start; i < candidates.length; i++) {
			// 4. 处理节点：选择当前数字
			path.push(candidates[i]);
			sum += candidates[i];

			// 5. 递归：可以重复选择，所以从 i 开始（不是 i+1）
			backtrack(i, sum);

			// 6. 回溯：撤销选择
			path.pop();
			sum -= candidates[i];
		}
	}

	backtrack(0, 0);
	return res;
}

/**
 * 优化版本：使用新值传递（不需要回溯 sum）
 */
function combinationSumOptimized(candidates, target) {
	let res = [];
	let path = [];

	function backtrack(start, sum) {
		if (sum === target) {
			res.push([...path]);
			return;
		}

		if (sum > target) {
			return;
		}

		for (let i = start; i < candidates.length; i++) {
			path.push(candidates[i]);
			// 传递新值，不需要回溯 sum
			backtrack(i, sum + candidates[i]);
			path.pop();
		}
	}

	backtrack(0, 0);
	return res;
}
