// 2023年题：

// 部门准备举办一场王者荣耀表演赛，有10名游戏爱好者参与，分5为两队，每队5人。每位参与者都有一个评分，代表着他的游戏水平。为了表演赛尽可能精彩，我们需要把10名参赛者分为实力尽量相近的两队。一队的实力可以表示为这一队5名队员的评分总和。现在给你10名参与者的游戏水平评分，请你根据上述要求分队最后输出这两组的实力差绝对值。例: 10名参赛者的评分分别为5 1 8 3 4 6 710 9 2，分组为 (135 8 10) (24 679)，两组实力差最小，差值为1。有多种分法，但实力差的绝对值最小为1。

// 输入描述
// 10个整数，表示10名参与者的游戏水平评分。范围在[1,10000]之间

// 输出描述
// 1个整数，表示分组后两组实力差绝对值的最小值.

/**
 * 计算两队实力差的最小值并返回分组
 * @param {number[]} scores - 10名参与者的评分数组
 * @returns {Object} - 包含最小分差和分组的对象
 */
function minDifferenceAndGroups(scores) {
	let minDiff = Infinity
	let bestGroup = []
	const totalScore = scores.reduce((sum, score) => sum + score, 0)
	const target = totalScore / 2

	/**
	 * 回溯函数
	 * @param {number} index - 当前处理的参与者索引
	 * @param {number} currentSum - 当前队伍的总分
	 * @param {number} count - 当前队伍的人数
	 * @param {number[]} currentGroup - 当前队伍的成员索引
	 */
	function backtrack(index, currentSum, count, currentGroup) {
		if (count === 5) {
			const diff = Math.abs(totalScore - 2 * currentSum)
			if (diff < minDiff) {
				minDiff = diff
				bestGroup = [...currentGroup]
			}
			return
		}
		if (index >= scores.length || count > 5) {
			return
		}

		// 选择当前参与者
		backtrack(index + 1, currentSum + scores[index], count + 1, [
			...currentGroup,
			index,
		])
		// 不选择当前参与者
		backtrack(index + 1, currentSum, count, currentGroup)
	}

	backtrack(0, 0, 0, [])

	// 构造两个分组
	const group1 = bestGroup
	const group2 = scores.map((_, i) => i).filter((i) => !group1.includes(i))

	return {
		minDifference: minDiff,
		groups: [group1.map((i) => scores[i]), group2.map((i) => scores[i])],
	}
}

// 测试
const scores = [5, 1, 8, 3, 4, 6, 7, 10, 9, 2]
const result = minDifferenceAndGroups(scores)
console.log('最小分差:', result.minDifference)
console.log('分组1:', result.groups[0])
console.log('分组2:', result.groups[1])
