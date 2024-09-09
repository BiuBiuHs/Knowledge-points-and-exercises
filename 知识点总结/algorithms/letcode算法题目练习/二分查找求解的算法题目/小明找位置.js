// 小朋友出操，按学号从小到大排成一列;小明来迟了，请你给小明出个主意，让他尽快找到他应该排的位置。

// 算法复杂度要求不高于nLog(n);学号为整数类型，队列规模<=10000;

// 输入描述
// 1、第一行:输入已排成队列的小朋友的学号 (正整数)，以”,”隔开

// ​ 例如: 93,95,97,100,102,123,1552、第二行:小明学号，如110;

// 输出描述
// 输出一个数字，代表队列位置 (从1开始)例如:6

// 用例
// 输入

// 93,95,97,100,102,123,155

// 110

// 输出

// 6

// 说明

// 无
/**
 * 使用二分查找找到小明应该排的位置
 * @param {number[]} queue - 已排序的学号队列
 * @param {number} target - 小明的学号
 * @returns {number} - 小明应该排的位置（从1开始）
 */
function findPosition(queue, target) {
	let left = 0
	let right = queue.length - 1

	while (left <= right) {
		let mid = Math.floor((left + right) / 2)

		if (queue[mid] === target) {
			return mid + 1 // 找到完全匹配的位置
		} else if (queue[mid] < target) {
			left = mid + 1
		} else {
			right = mid - 1
		}
	}

	// 如果没有找到完全匹配，left 就是应该插入的位置
	return left + 1 // 加1是因为位置从1开始计数
}

// 处理输入
const readline = require('readline')
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

let lineCount = 0
let queue

rl.on('line', (line) => {
	if (lineCount === 0) {
		queue = line.split(',').map(Number)
	} else {
		const target = parseInt(line)
		console.log(findPosition(queue, target))
		rl.close()
	}
	lineCount++
})
console.log(findPosition([93, 95, 97, 100, 102, 123, 155], 110))
