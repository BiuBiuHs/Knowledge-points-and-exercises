// 你现在是一场采用特殊赛制棒球比赛的记录员。这场比赛由若干回合组成，过去几回合的得分可能会影响以后几回合的得分。

// 比赛开始时，记录是空白的。你会得到一个记录操作的字符串列表 ops，其中 ops[i] 是你需要记录的第 i 项操作，ops 遵循下述规则：

// 整数 x - 表示本回合新获得分数 x
// "+" - 表示本回合新获得的得分是前两次得分的总和。题目数据保证记录此操作时前面总是存在两个有效的分数。
// "D" - 表示本回合新获得的得分是前一次得分的两倍。题目数据保证记录此操作时前面总是存在一个有效的分数。
// "C" - 表示前一次得分无效，将其从记录中移除。题目数据保证记录此操作时前面总是存在一个有效的分数。
// 请你返回记录中所有得分的总和。

/**
 * @param {string[]} operations
 * @return {number}
 */
var calPoints = function (operations) {
	let numStack = []
	for (var item of operations) {
		//  遍历数组去除关键字即可
		if (item == 'C') {
			numStack.pop()
		} else if (item == 'D') {
			const curNum = numStack[numStack.length - 1] * 2
			numStack.push(curNum)
		} else if (item == '+') {
			const curNum =
				numStack[numStack.length - 1] + numStack[numStack.length - 2]
			numStack.push(curNum)
		} else {
			//不是操作符则是数字 字符串格式化位num后放入数组中 根据操作符进行计算
			numStack.push(parseInt(item))
		}
	}
	// 累加返回结果
	return numStack.reduce((sum, num) => (sum += num), 0)
}
