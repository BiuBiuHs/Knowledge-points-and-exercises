// https://leetcode.cn/problems/maximum-depth-of-binary-tree/

/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function (root) {
	if (!root) return 0
	const queue = [root]
	let depth = 0
	while (queue.length) {
		const n = queue.length
		for (var i = 0; i < n; i++) {
			const curNode = queue.shift()
			const { left, right } = curNode
			if (left) queue.push(left)
			if (right) queue.push(right)
		}
		depth++
	}
	return depth
}
