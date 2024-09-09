// K小姐所在公司举办了 Family Day 活动，邀请员工及其家属参观公司园区。将公司园区视为一个
// 𝑛
// ×
// 𝑚
// n×m 的矩形网格，起始位置在左上角，终点位置在右下角。家属参观园区时，只能向右或向下移动。园区中有些位置设有闸机，无法通行。请问，从起始位置到终点位置，一共有多少种不同的参观路径？

// 输入格式
// 第一行包含两个正整数
// 𝑛
// n 和
// 𝑚
// m，分别表示园区的行数和列数。 接下来
// 𝑛
// n 行，每行包含
// 𝑚
// m 个空格分隔的数字，数字为
// 0
// 0 表示该位置可以通行，数字为
// 1
// 1 表示该位置无法通行。

// 输出格式
// 输出一个整数，表示从起始位置到终点位置的不同参观路径数量。

// 样例输入
// 3 3
// 0 0 0
// 0 1 0
// 0 0 0
// 样例输出
// 2

/**
 * 计算从起点到终点的不同路径数量
 * @param {number} n - 园区的行数
 * @param {number} m - 园区的列数
 * @param {number[][]} grid - 园区的布局，0表示可通行，1表示不可通行
 * @returns {number} - 不同路径的数量
 */
function countPaths(n, m, grid) {
	// 创建动态规划数组
	let dp = Array(n)
		.fill()
		.map(() => Array(m).fill(0))

	// 初始化起点
	dp[0][0] = grid[0][0] === 0 ? 1 : 0

	// 初始化第一行
	for (let j = 1; j < m; j++) {
		if (grid[0][j] === 0) {
			dp[0][j] = dp[0][j - 1]
		}
	}

	// 初始化第一列
	for (let i = 1; i < n; i++) {
		if (grid[i][0] === 0) {
			dp[i][0] = dp[i - 1][0]
		}
	}

	// 填充dp数组
	for (let i = 1; i < n; i++) {
		for (let j = 1; j < m; j++) {
			if (grid[i][j] === 0) {
				dp[i][j] = dp[i - 1][j] + dp[i][j - 1]
			}
		}
	}

	// 返回终点的路径数量
	return dp[n - 1][m - 1]
}

// 处理输入
const readline = require('readline')
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

let lineCount = 0
let n, m
let grid = []

rl.on('line', (line) => {
	if (lineCount === 0) {
		;[n, m] = line.split(' ').map(Number)
	} else {
		grid.push(line.split(' ').map(Number))
	}

	lineCount++

	if (lineCount === n + 1) {
		console.log(countPaths(n, m, grid))
		rl.close()
	}
})
