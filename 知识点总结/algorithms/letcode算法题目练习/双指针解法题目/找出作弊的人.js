// 公司组织了一次考试,现在考试结果出来了，想看一下有没人存在作弊行为,但是员工太多了,需要先对员工进行一次过滤,再进一步确定是否存在作弊行为。

// 过滤的规则为:找到分差最小的员工ID对(p1,p2)列表,要求p1<p2

// 员工个数取值范国:O<n<100000

// 员工ID为整数,取值范围:0<=n<=100000

// 考试成绩为整数,取值范围:0<=score<=300

/**
 * @param {number[][]} employees - 员工信息数组，每个元素是 [id, score]
 * @return {number[][]} - 分差最小的员工ID对列表
 */
function findClosestScorePairs(employees) {
	// 按分数排序
	employees.sort((a, b) => a[1] - b[1])

	let minDiff = Infinity
	let result = []

	// 使用双指针找最小分差
	for (let i = 1; i < employees.length; i++) {
		let diff = employees[i][1] - employees[i - 1][1]
		if (diff < minDiff) {
			minDiff = diff
			result = []
		}
		if (diff === minDiff) {
			// 确保 ID 较小的在前
			let pair =
				employees[i - 1][0] < employees[i][0]
					? [employees[i - 1][0], employees[i][0]]
					: [employees[i][0], employees[i - 1][0]]
			result.push(pair)
		}
	}

	// 按 ID 排序
	result.sort((a, b) => {
		if (a[0] !== b[0]) return a[0] - b[0]
		return a[1] - b[1]
	})

	return result
}

// 测试
let employees = [
	[1, 100],
	[2, 50],
	[3, 150],
	[4, 200],
	[5, 150],
	[6, 50],
]

console.log(findClosestScorePairs(employees))
