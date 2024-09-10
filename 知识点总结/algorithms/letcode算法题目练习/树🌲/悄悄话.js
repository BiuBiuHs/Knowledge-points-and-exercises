// 给定一个二叉树，每个节点上站一个人，节点数字表示父节点到该节点传递悄悄话需要花费的时间。

// 初始时，根节点所在位置的人有一个悄悄话想要传递给其他人，求二叉树所有节点上的人都接收到悄悄话花费的时间。

// 输入描述
// 给定二叉树

// 0 9 20 -1 -1 15 7 -1 -1 -1 -1 3 2
// 注： -1 表示空节点
// 返回所有节点都接收到悄悄话花费的时间

// 38
// 示例1
// 输入：
// 0 9 20 -1 -1 15 15 7 -1 -1 -1 -1 3 2

// 输出：
// 38

class TreeNode {
	constructor(val) {
		this.val = val === -1 ? 0 : val // 如果输入是 -1，将值设为 0
		this.left = null
		this.right = null
	}
}

function buildTree(nodes) {
	if (nodes.length === 0) return null

	const root = new TreeNode(nodes[0])
	const queue = [root]
	let i = 1

	while (queue.length > 0 && i < nodes.length) {
		const currentNode = queue.shift()

		if (i < nodes.length) {
			currentNode.left = new TreeNode(nodes[i])
			queue.push(currentNode.left)
			i++
		}

		if (i < nodes.length) {
			currentNode.right = new TreeNode(nodes[i])
			queue.push(currentNode.right)
			i++
		}
	}

	return root
}

function whisperTime(root) {
	console.log(JSON.stringify(root, 'root'))
	function dfs(node, time) {
		if (!node) return time

		// 递归遍历左右子树
		const leftTime = dfs(node.left, time + node.val)
		const rightTime = dfs(node.right, time + node.val)
		return Math.max(leftTime, rightTime)
	}

	return dfs(root, 0)
}

// 主函数
function calculateWhisperTime(input) {
	const nodes = input.split(' ').map(Number)
	const root = buildTree(nodes)
	return whisperTime(root)
}

// 测试
console.log(calculateWhisperTime('0 9 20 -1 -1 15 7 -1 -1 -1 -1 3 2')) // 应输出 38
