// 小华按照地图去寻宝，地图上被划分成 m 行和 n 列的方格，横纵坐标范围分别是 [0, n-1] 和 [0, m-1]。

// 在横坐标和纵坐标的数位之和不大于 k 的方格中存在黄金（每个方格中仅存在一克黄金），但横坐标和纵坐标数位之和大于 k 的方格存在危险不可进入。小华从入口 (0,0) 进入，任何时候只能向左，右，上，下四个方向移动一格。

// 请问小华最多能获得多少克黄金？

// 输入描述
// 坐标取值范围如下：

// 0 ≤ m ≤ 50
// 0 ≤ n ≤ 50
// k 的取值范围如下：

// 0 ≤ k ≤ 100
// 输入中包含3个字数，分别是m, n, k

// 输出描述
// 输出小华最多能获得多少克黄金

// 用例
// 输入 40 40 18
// 输出	1484
// 说明	无输入 5 4 7
// 输出	20
// 说明	无
// 解题思路
// 边界条件: 在 dfs 函数中，首先检查当前坐标是否越界，是否已经被访问过，以及当前坐标的数位和是否大于 k。如果满足这些条件中的任何一个，当前方格不可访问，返回 0。

// 标记访问: 创建一个二维布尔数组 visited 来跟踪每个方格是否已经被访问过。这是为了防止在搜索过程中重复访问相同的方格。

// 递归搜索: 从当前方格出发，递归地向四个方向（上、下、左、右）进行搜索。每次递归调用返回时，将返回值累加，表示可以收集到的黄金数量。每个可访问的方格代表一克黄金，所以在每次递归调用的返回值中加 1。

function collectGold(m, n, k) {
	const visited = Array(m)
		.fill()
		.map(() => Array(n).fill(false))

	function isValid(x, y) {
		if (x < 0 || x >= m || y < 0 || y >= n) return false
		if (visited[x][y]) return false
		return digitSum(x) + digitSum(y) <= k
	}

	function digitSum(num) {
		return num
			.toString()
			.split('')
			.reduce((sum, digit) => sum + parseInt(digit), 0)
	}

	function dfs(x, y) {
		if (!isValid(x, y)) return 0

		visited[x][y] = true
		let gold = 1 // Current cell contains 1 gram of gold

		// Explore in all four directions
		gold += dfs(x + 1, y)
		gold += dfs(x - 1, y)
		gold += dfs(x, y + 1)
		gold += dfs(x, y - 1)

		return gold
	}

	return dfs(0, 0)
}

// 测试
console.log(collectGold(40, 40, 18)) // 应输出 1484
console.log(collectGold(5, 4, 7)) // 应输出 20
