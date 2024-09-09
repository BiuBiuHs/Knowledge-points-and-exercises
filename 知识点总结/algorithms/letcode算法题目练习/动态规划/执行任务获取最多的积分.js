// 现有N个任务需要处理，同一时间只能处理一个任务，处理每个任务所需要的时间固定为1。

// 每个任务都有最晚处理时间限制和积分值，在最晚处理时间点之前处理完成任务才可获得对应的积分奖励。

// 可用于处理任务的时间有限，请问在有限的时间内，可获得的最多积分。

// 输入描述
// 第一行为一个数 N，表示有 N 个任务

// 1 ≤ N ≤ 100
// 第二行为一个数 T，表示可用于处理任务的时间

// 1 ≤ T ≤ 100
// 接下来 N 行，每行两个空格分隔的整数（SLA 和 V），SLA 表示任务的最晚处理时间，V 表示任务对应的积分。

// 1 ≤ SLA ≤ 100
// 0 ≤ V ≤ 100000
// 输出描述
// 可获得的最多积分

// 用例1
// 输入

// 4
// 3
// 1 2
// 1 3
// 1 4
// 1 5
// 输出

// 5

/**
 * 计算在有限时间内可获得的最多积分
 * @param {number} N - 任务数量
 * @param {number} T - 可用于处理任务的时间
 * @param {number[][]} tasks - 任务数组，每个元素是 [SLA, V]
 * @returns {number} - 可获得的最多积分
 */
function maxPoints(N, T, tasks) {
	// 按照 SLA 排序任务
	tasks.sort((a, b) => a[0] - b[0])

	// 创建动态规划数组
	let dp = new Array(T + 1).fill(0)

	// 遍历每个任务
	for (let i = 0; i < N; i++) {
		let [sla, value] = tasks[i]
		// 从最晚处理时间开始，向前更新dp数组
		for (let t = Math.min(T, sla); t > 0; t--) {
			dp[t] = Math.max(dp[t], dp[t - 1] + value)
		}
	}

	// 返回最大积分
	return dp[T]
}

// 处理输入
const readline = require('readline')
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

let lineCount = 0
let N, T
let tasks = []

rl.on('line', (line) => {
	if (lineCount === 0) {
		N = parseInt(line)
	} else if (lineCount === 1) {
		T = parseInt(line)
	} else {
		const [sla, value] = line.split(' ').map(Number)
		tasks.push([sla, value])
	}

	lineCount++

	if (lineCount === N + 2) {
		console.log(maxPoints(N, T, tasks))
		rl.close()
	}
})
