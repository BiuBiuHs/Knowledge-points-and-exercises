// https://leetcode.cn/problems/unique-paths/description/

// 一个机器人位于一个 m x n 网格的左上角 （起始点在下图中标记为 “Start” ）。

// 机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为 “Finish” ）。

// 问总共有多少条不同的路径？

// 示例 1：

// 输入：m = 3, n = 7
// 输出：28
// 示例 2：

// 输入：m = 3, n = 2
// 输出：3
// 解释：
// 从左上角开始，总共有 3 条路径可以到达右下角。
// 1. 向右 -> 向下 -> 向下
// 2. 向下 -> 向下 -> 向右
// 3. 向下 -> 向右 -> 向下

/**
 * 计算从左上角到右下角的唯一路径数
 * @param {number} m - 行数
 * @param {number} n - 列数
 * @return {number} - 唯一路径数
 */
var uniquePaths = function (m, n) {
	// 初始化动态规划数组 dp，大小为 m x n，所有元素初始值为 0
	let dp = new Array(m).fill(0).map(() => new Array(n).fill(0));

	// 初始化第一列的路径数，从起点到第一列的任何位置都只有一条路径
	for (let i = 0; i < m; i++) {
		dp[i][0] = 1;
	}

	// 初始化第一行的路径数，从起点到第一行的任何位置都只有一条路径
	for (let j = 0; j < n; j++) {
		dp[0][j] = 1;
	}

	// 计算其他位置的路径数
	for (let i = 1; i < m; i++) {
		for (let j = 1; j < n; j++) {
			// 当前位置的路径数等于从上方位置和左方位置到达的路径数之和
			dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
		}
	}

	// 返回从起点到终点的唯一路径数
	return dp[m - 1][n - 1];
};
