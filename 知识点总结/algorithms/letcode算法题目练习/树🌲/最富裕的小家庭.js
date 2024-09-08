// 在一棵树中，每个节点代表一个家庭成员，节点的数字表示其个人的财富值，一个节点及其直接相连的子节点被定义为一个小家庭现给你一棵树，请计算出最富裕的小家庭的财富和。

// 输入描述
// 第一行为一个数N，表示成员总数，成员编号1-N，1<=N<=1000

// 第二行为N个空格分隔的数，表示编号1- N 的成员的财富值。 0 <= 财富值 <= 1000000

// 接下来 N-1 行，每行两个空格分隔的整数（N1,N2）， 表示 N1 是 N2 的父节点。

// 输出描述
// 最富裕的小家庭的财富和

// 示例1
// 输入：
// 4
// 100 200 300 500
// 1 2
// 1 3
// 2 4

// 输出：
// 700

/**
 * 计算最富裕的小家庭的财富和
 * @param {number} N - 成员总数
 * @param {number[]} wealth - 每个成员的财富值
 * @param {[number, number][]} relations - 父子关系数组
 * @returns {number} - 最富裕的小家庭的财富和
 */
function richestFamily(N, wealth, relations) {
	// 构建树结构
	const tree = Array.from({ length: N + 1 }, () => [])
	for (const [parent, child] of relations) {
		tree[parent].push(child)
	}

	let maxWealth = 0

	// 遍历树，计算每个小家庭的财富和
	function dfs(node) {
		let familyWealth = wealth[node - 1] // 当前节点的财富
		for (const child of tree[node]) {
			familyWealth += wealth[child - 1] // 加上直接子节点的财富
		}
		maxWealth = Math.max(maxWealth, familyWealth)

		// 继续遍历子节点
		for (const child of tree[node]) {
			dfs(child)
		}
	}

	dfs(1) // 从根节点开始遍历

	return maxWealth
}

// 测试
const N = 4
const wealth = [100, 200, 300, 500]
const relations = [
	[1, 2],
	[1, 3],
	[2, 4],
]
console.log(richestFamily(N, wealth, relations)) // 应输出 700
