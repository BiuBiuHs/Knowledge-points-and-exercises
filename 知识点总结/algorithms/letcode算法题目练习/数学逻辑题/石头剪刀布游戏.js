// 石头剪刀布游戏有 3 种出拳形状：石头、剪刀、布。分别用字母 A , B , C 表示。

// 游戏规则:

// 出拳形状之间的胜负规则如下： A > B；B > C；C > A；">"左边一个字母，表示相对优势形状。右边一个字母，表示相对劣势形状。 当本场次中有且仅有一种出拳形状优于其它出拳形状，则该形状的玩家是胜利者。否则认为是平局。 当发生平局，没有赢家。有多个胜利者时，同为赢家。

// 例如 1： 三个玩家出拳分别是A, B, C ，由于出现三方优势循环(即没有任何一方优于其它出拳者)，判断为平局。

// 例如 2： 两个玩家，出拳分别是 A, B ，出拳 A 的获胜。

// 例如 3： 三个玩家，出拳全部是 A ，判为平局。

// 输入描述
// 在一场游戏中，每个玩家的信息为一行。玩家数量不超过 1000 。每个玩家信息有 2 个字段，用空格隔开：

// 玩家 ID：一个仅由英文字母和数字组成的字符串
// 出拳形状：以英文大写字母表示, A 、B 、C 形状。 例：
// abc1 A
// xyz B
// 输出描述
// 输出为赢家的玩家 ID 列表(一个或多个)，每个 ID 一行，按字符串升序排列。如果没有赢家，输出为"NULL"字符串。例如：

// abc1
// 用例1
// 输入

// abc1 A
// xyz B

function rockPaperScissors(players) {
	const shapes = { A: 0, B: 0, C: 0 }
	const playerMap = {}

	// 统计每种形状的数量并记录玩家
	players.forEach(([id, shape]) => {
		shapes[shape]++
		if (!playerMap[shape]) playerMap[shape] = []
		playerMap[shape].push(id)
	})

	// 确定胜利的形状
	let winningShape = null
	if (shapes['A'] > 0 && shapes['B'] > 0 && shapes['C'] === 0)
		winningShape = 'A'
	else if (shapes['B'] > 0 && shapes['C'] > 0 && shapes['A'] === 0)
		winningShape = 'B'
	else if (shapes['C'] > 0 && shapes['A'] > 0 && shapes['B'] === 0)
		winningShape = 'C'

	// 如果有胜利形状，返回使用该形状的玩家ID（排序后）
	if (winningShape) {
		return playerMap[winningShape].sort()
	}

	// 如果没有胜利者，返回 "NULL"
	return ['NULL']
}

// // 处理输入
// const readline = require('readline')
// const rl = readline.createInterface({
// 	input: process.stdin,
// 	output: process.stdout,
// })

// let players = []

// rl.on('line', (line) => {
// 	if (line.trim() === '') {
// 		// 输入结束
// 		const result = rockPaperScissors(players)
// 		result.forEach((id) => console.log(id))
// 		rl.close()
// 	} else {
// 		players.push(line.split(' '))
// 	}
// })

console.log(
	rockPaperScissors([
		['111', 'A'],
		['121', 'B'],
		['131', 'C'],
		['141', 'B'],
		['151', 'A'],
	])
)
