// 用数组代表每个人的能力，一个比赛活动要求参赛团队的最低能力值为 N，每个团队可以由 1 人或 2 人组成，且 1 个人只能参加 1 个团队，

// 请计算出最多可以派出多少支符合要求的团队

// 输入描述
// 5 3 1 5 7 9 8 第一行代表总人数，范围[1,500000]

// 第二行数组代表每个人的能力，每个元素的取值范围为[1,500000],数组的大小范围[1,500000]

// 第三行数值为团队要求的最低能力值，范围[1,500000]

// 输出描述
// 3 最多可以派出的团队的数量

// 示例1
// 输入：
// 5
// 3 1 5 7 9
// 8

// 输出：
// 3

// 说明：
// 3，5组成一队，1，7组成一队，9自己一个队，故而输出3

/**
 * 计算最多可以派出的符合要求的团队数量
 * @param {number[]} abilities - 每个人的能力值数组
 * @param {number} N - 团队要求的最低能力值
 * @returns {number} - 最多可以派出的团队数量
 */
function maxTeams(abilities, N) {
	// 对能力值进行降序排序
	abilities.sort((a, b) => b - a)

	let teams = 0
	let left = 0
	let right = abilities.length - 1

	while (left <= right) {
		if (abilities[left] >= N) {
			// 单人团队
			teams++
			left++
		} else if (left < right && abilities[left] + abilities[right] >= N) {
			// 双人团队
			teams++
			left++
			right--
		} else {
			// 无法组成团队
			break
		}
	}

	return teams
}

// 处理输入
const readline = require('readline')
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

let lineCount = 0
let totalPeople
let abilities
let N

rl.on('line', (line) => {
	if (lineCount === 0) {
		totalPeople = parseInt(line)
	} else if (lineCount === 1) {
		abilities = line.split(' ').map(Number)
	} else {
		N = parseInt(line)
		console.log(maxTeams(abilities, N))
		rl.close()
	}
	lineCount++
})
