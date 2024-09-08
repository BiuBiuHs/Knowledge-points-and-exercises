// 小明今年升学到小学一年级，来到新班级后发现其他小朋友们身高参差不齐，然后就想基于各小朋友和自己的身高差对他们进行排序，请帮他实现排序。

// 输入描述
// 第一行为正整数H和N，0<H<200，为小明的身高，0<N<50，为新班级其他小朋友个数。

// 第二行为N个正整数H1-HN，分别是其他小朋友的身高，取值范围0<Hi<200 (1<= i <=N)，且N个正整数各不相同。

// 输出描述
// 输出排序结果，各正整数以空格分割。和小明身高差绝对值最小的小朋友排在前面，和小明身高差绝对值最大的小朋友排在最后，如果两个小朋友和小明身高差一样，则个子较小的小朋友排在前面。

// 示例1
// 输入：
// 100 10
// 95 96 97 98 99 101 102 103 104 105

// 输出：
// 99 101 98 102 97 103 96 104 95 105

/**
 * 对小朋友的身高进行排序
 * @param {number} H - 小明的身高
 * @param {number[]} heights - 其他小朋友的身高数组
 * @returns {number[]} - 排序后的身高数组
 */
function sortHeights(H, heights) {
	return heights.sort((a, b) => {
		const diffA = Math.abs(a - H)
		const diffB = Math.abs(b - H)
		if (diffA !== diffB) {
			return diffA - diffB // 按与小明身高差的绝对值升序排序
		}
		return a - b // 如果身高差相同，按身高升序排序
	})
}

// 处理输入
const readline = require('readline')
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

let lineCount = 0
let H, N

rl.on('line', (line) => {
	if (lineCount === 0) {
		;[H, N] = line.split(' ').map(Number)
	} else {
		const heights = line.split(' ').map(Number)
		const sortedHeights = sortHeights(H, heights)
		console.log(sortedHeights.join(' '))
		rl.close()
	}
	lineCount++
})
