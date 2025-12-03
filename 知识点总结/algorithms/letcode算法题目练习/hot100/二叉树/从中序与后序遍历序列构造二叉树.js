// 链接：https://leetcode.cn/problems/construct-binary-tree-from-inorder-and-postorder-traversal/
// 题目：从中序与后序遍历序列构造二叉树
//
// 给定两个整数数组 inorder 和 postorder ，其中 inorder 是二叉树的中序遍历，
// postorder 是同一棵树的后序遍历，请你构造并返回这颗 二叉树 。
//
// 示例 1:
// 输入：inorder = [9,3,15,20,7], postorder = [9,15,7,20,3]
// 输出：[3,9,20,null,null,15,7]
//
// 示例 2:
// 输入：inorder = [-1], postorder = [-1]
// 输出：[-1]
//
// 提示:
// 1 <= inorder.length <= 3000
// postorder.length == inorder.length
// -3000 <= inorder[i], postorder[i] <= 3000
// inorder 和 postorder 都由 不同 的值组成
// postorder 中每一个值都在 inorder 中
// inorder 保证是树的中序遍历
// postorder 保证是树的后序遍历

/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {number[]} inorder 中序遍历序列
 * @param {number[]} postorder 后序遍历序列
 * @return {TreeNode}
 */
var buildTree = function (inorder, postorder) {
	// 如果中序或后序数组为空，返回 null
	if (inorder.length === 0 || postorder.length === 0) {
		return null;
	}

	// 后序遍历的最后一个元素就是根节点
	const rootVal = postorder[postorder.length - 1];
	const root = new TreeNode(rootVal);

	// 在中序遍历中找到根节点的位置
	const rootIndex = inorder.indexOf(rootVal);

	// 根据根节点在中序遍历中的位置，分割左右子树
	// 左子树的中序遍历：根节点左边的所有元素
	const leftInorder = inorder.slice(0, rootIndex);
	// 右子树的中序遍历：根节点右边的所有元素
	const rightInorder = inorder.slice(rootIndex + 1);

	// 左子树的后序遍历：前 leftInorder.length 个元素
	const leftPostorder = postorder.slice(0, leftInorder.length);
	// 右子树的后序遍历：除了最后一个根节点外，剩余的元素
	const rightPostorder = postorder.slice(
		leftInorder.length,
		postorder.length - 1
	);

	// 递归构造左子树和右子树
	root.left = buildTree(leftInorder, leftPostorder);
	root.right = buildTree(rightInorder, rightPostorder);

	return root;
};

// 不使用中序左子树的数量 截取
var buildTree = function (inorder, postorder) {
	if (!postorder.length) return null;

	let rootValue = postorder.pop();

	const rootNode = new TreeNode(rootValue);

	let rootIndex = inorder.findIndex((item) => item == rootValue);

	rootNode.left = buildTree(
		inorder.slice(0, rootIndex),
		postorder.slice(0, rootIndex)
	);
	rootNode.right = buildTree(
		inorder.slice(rootIndex + 1),
		postorder.slice(rootIndex)
	);

	return rootNode;
};

// // 优化版本：使用 Map 存储中序遍历的索引，避免重复查找
// var buildTreeOptimized = function (inorder, postorder) {
// 	// 创建中序遍历值到索引的映射，提高查找效率
// 	const inorderMap = new Map();
// 	for (let i = 0; i < inorder.length; i++) {
// 		inorderMap.set(inorder[i], i);
// 	}

// 	// 递归构建二叉树的辅助函数
// 	// inStart: 中序遍历的起始位置
// 	// inEnd: 中序遍历的结束位置
// 	// postStart: 后序遍历的起始位置
// 	// postEnd: 后序遍历的结束位置
// 	const build = (inStart, inEnd, postStart, postEnd) => {
// 		// 如果中序遍历范围无效，返回 null
// 		if (inStart > inEnd || postStart > postEnd) {
// 			return null;
// 		}

// 		// 后序遍历的最后一个元素是根节点
// 		const rootVal = postorder[postEnd];
// 		const root = new TreeNode(rootVal);

// 		// 在中序遍历中找到根节点的位置
// 		const rootIndex = inorderMap.get(rootVal);
// 		// 计算左子树的节点数量
// 		const leftTreeSize = rootIndex - inStart;

// 		// 递归构建左子树
// 		// 左子树的中序遍历范围：[inStart, rootIndex - 1]
// 		// 左子树的后序遍历范围：[postStart, postStart + leftTreeSize - 1]
// 		root.left = build(
// 			inStart,
// 			rootIndex - 1,
// 			postStart,
// 			postStart + leftTreeSize - 1
// 		);

// 		// 递归构建右子树
// 		// 右子树的中序遍历范围：[rootIndex + 1, inEnd]
// 		// 右子树的后序遍历范围：[postStart + leftTreeSize, postEnd - 1]
// 		root.right = build(
// 			rootIndex + 1,
// 			inEnd,
// 			postStart + leftTreeSize,
// 			postEnd - 1
// 		);

// 		return root;
// 	};

// 	return build(0, inorder.length - 1, 0, postorder.length - 1);
// };
