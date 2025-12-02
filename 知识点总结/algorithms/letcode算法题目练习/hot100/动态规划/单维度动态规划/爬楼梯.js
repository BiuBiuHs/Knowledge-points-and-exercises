/**
 * https://leetcode-cn.com/problems/climbing-stairs/submissions/
 * @param {number} n
 * @return {number}
 */
// 1. 直接递归
var climbStairs = function (n) {
	if (n == 1) return 1;
	if (n == 2) return 2;
	return climbStairs(n - 1) + climbStairs(n - 2);
};

//动态规划
//利用数组 减少重复计算
var climbStairs = function (n) {
	// 初始化动态规划数组 dp
	let dp = new Array();

	// 基础情况：爬 1 级台阶有 1 种方法
	dp[1] = 1;

	// 基础情况：爬 2 级台阶有 2 种方法
	dp[2] = 2;

	// 从第 3 级台阶开始，计算到第 n 级台阶的方法数
	for (let i = 3; i <= n; i++) {
		// dp[i] 表示爬到第 i 级台阶的方法数
		// 爬到第 i 级台阶的方法数等于爬到第 (i-1) 级台阶的方法数加上爬到第 (i-2) 级台阶的方法数
		dp[i] = dp[i - 1] + dp[i - 2];
	}

	// 返回爬到第 n 级台阶的方法数
	return dp[n];
};
