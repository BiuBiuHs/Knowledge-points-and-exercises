// 链接：https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/
// 题目：从前序与中序遍历序列构造二叉树
//
// 给定两个整数数组 preorder 和 inorder ，其中 preorder 是二叉树的先序遍历，
// inorder 是同一棵树的中序遍历，请构造二叉树并返回其根节点。
//
// 示例 1:
// 输入: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
// 输出: [3,9,20,null,null,15,7]
//
// 示例 2:
// 输入: preorder = [-1], inorder = [-1]
// 输出: [-1]
//
// 提示:
// 1 <= preorder.length <= 3000
// inorder.length == preorder.length
// -3000 <= preorder[i], inorder[i] <= 3000
// preorder 和 inorder 均 无重复 元素
// inorder 均出现在 preorder
// preorder 保证 为二叉树的前序遍历序列
// inorder 保证 为二叉树的中序遍历序列

/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {number[]} preorder 前序遍历序列
 * @param {number[]} inorder 中序遍历序列
 * @return {TreeNode}
 */
var buildTree = function (preorder, inorder) {
	// 如果前序或中序数组为空，返回 null
	if (preorder.length === 0 || inorder.length === 0) {
		return null;
	}

	// 前序遍历的第一个元素就是根节点
	const rootVal = preorder[0];
	const root = new TreeNode(rootVal);

	// 在中序遍历中找到根节点的位置
	const rootIndex = inorder.indexOf(rootVal);

	// 根据根节点在中序遍历中的位置，分割左右子树
	// 左子树的中序遍历：根节点左边的所有元素
	const leftInorder = inorder.slice(0, rootIndex);
	// 右子树的中序遍历：根节点右边的所有元素
	const rightInorder = inorder.slice(rootIndex + 1);

	// 左子树的前序遍历：除了根节点外，前 rootIndex 个元素
	const leftPreorder = preorder.slice(1, 1 + leftInorder.length);
	// 右子树的前序遍历：剩余的元素
	const rightPreorder = preorder.slice(1 + leftInorder.length);

	// 递归构造左子树和右子树
	root.left = buildTree(leftPreorder, leftInorder);
	root.right = buildTree(rightPreorder, rightInorder);

	return root;
};

//不使用长度进行截取
var buildTree = function (preorder, inorder) {
	if (!preorder.length) return null;
	let rootValue = preorder.shift();
	const rootNode = new TreeNode(rootValue);
	let index = inorder.findIndex((item) => item == rootValue);
	rootNode.left = buildTree(preorder.slice(0, index), inorder.slice(0, index));
	rootNode.right = buildTree(preorder.slice(index), inorder.slice(index + 1));
	return rootNode;
};

// // 优化版本：使用 Map 存储中序遍历的索引，避免重复查找
// var buildTreeOptimized = function (preorder, inorder) {
// 	// 创建中序遍历值到索引的映射，提高查找效率
// 	const inorderMap = new Map();
// 	for (let i = 0; i < inorder.length; i++) {
// 		inorderMap.set(inorder[i], i);
// 	}

// 	// 递归构建二叉树的辅助函数
// 	// preStart: 前序遍历的起始位置
// 	// preEnd: 前序遍历的结束位置
// 	// inStart: 中序遍历的起始位置
// 	// inEnd: 中序遍历的结束位置
// 	const build = (preStart, preEnd, inStart, inEnd) => {
// 		// 如果前序遍历范围无效，返回 null
// 		if (preStart > preEnd || inStart > inEnd) {
// 			return null;
// 		}

// 		// 前序遍历的第一个元素是根节点
// 		const rootVal = preorder[preStart];
// 		const root = new TreeNode(rootVal);

// 		// 在中序遍历中找到根节点的位置
// 		const rootIndex = inorderMap.get(rootVal);
// 		// 计算左子树的节点数量
// 		const leftTreeSize = rootIndex - inStart;

// 		// 递归构建左子树
// 		// 左子树的前序遍历范围：[preStart + 1, preStart + leftTreeSize]
// 		// 左子树的中序遍历范围：[inStart, rootIndex - 1]
// 		root.left = build(
// 			preStart + 1,
// 			preStart + leftTreeSize,
// 			inStart,
// 			rootIndex - 1
// 		);

// 		// 递归构建右子树
// 		// 右子树的前序遍历范围：[preStart + leftTreeSize + 1, preEnd]
// 		// 右子树的中序遍历范围：[rootIndex + 1, inEnd]
// 		root.right = build(
// 			preStart + leftTreeSize + 1,
// 			preEnd,
// 			rootIndex + 1,
// 			inEnd
// 		);

// 		return root;
// 	};

// 	return build(0, preorder.length - 1, 0, inorder.length - 1);
// };
