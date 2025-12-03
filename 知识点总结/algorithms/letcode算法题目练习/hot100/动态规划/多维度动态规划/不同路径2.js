// https://leetcode.cn/problems/unique-paths-ii/

// 给定一个 m x n 的整数数组 grid。一个机器人初始位于 左上角（即 grid[0][0]）。机器人尝试移动到 右下角（即 grid[m - 1][n - 1]）。机器人每次只能向下或者向右移动一步。

// 网格中的障碍物和空位置分别用 1 和 0 来表示。机器人的移动路径中不能包含 任何 有障碍物的方格。

// 返回机器人能够到达右下角的不同路径数量。

// 测试用例保证答案小于等于 2 * 109。

// 示例 1：

// 输入：obstacleGrid = [[0,0,0],[0,1,0],[0,0,0]]
// 输出：2
// 解释：3x3 网格的正中间有一个障碍物。
// 从左上角到右下角一共有 2 条不同的路径：
// 1. 向右 -> 向右 -> 向下 -> 向下
// 2. 向下 -> 向下 -> 向右 -> 向右

/**
 * 计算从左上角到右下角的唯一路径数，考虑障碍物
 * @param {number[][]} obstacleGrid - 二维网格，1 表示障碍物，0 表示空地
 * @return {number} - 唯一路径数
 */
var uniquePathsWithObstacles = function (obstacleGrid) {
	// 获取网格的行数和列数
	let m = obstacleGrid.length;
	let n = obstacleGrid[0].length;

	// 如果起点或终点有障碍物，直接返回 0
	if (obstacleGrid[0][0] === 1 || obstacleGrid[m - 1][n - 1] === 1) return 0;

	// 初始化动态规划数组 dp，大小为 m x n，所有元素初始值为 0
	let dp = new Array(m).fill(0).map(() => new Array(n).fill(0));

	// 初始化第一列的路径数，从起点到第一列的任何位置都只有一条路径，除非有障碍物
	for (let i = 0; i < m && obstacleGrid[i][0] === 0; i++) {
		dp[i][0] = 1;
	}

	// 初始化第一行的路径数，从起点到第一行的任何位置都只有一条路径，除非有障碍物
	for (let j = 0; j < n && obstacleGrid[0][j] === 0; j++) {
		dp[0][j] = 1;
	}

	// 计算其他位置的路径数
	for (let i = 1; i < m; i++) {
		for (let j = 1; j < n; j++) {
			// 如果当前位置没有障碍物
			if (obstacleGrid[i][j] === 0) {
				// 当前位置的路径数等于从上方位置和左方位置到达的路径数之和
				dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
			} else {
				// 如果当前位置有障碍物，路径数为 0
				dp[i][j] = 0;
			}
		}
	}

	// 返回从起点到终点的唯一路径数
	return dp[m - 1][n - 1];
};
