// 链接：https://leetcode-cn.com/problems/sum-of-left-leaves
// 计算给定二叉树的所有左叶子之和。

// 示例：

//     3
//    / \
//   9  20
//     /  \
//    15   7

// 在这个二叉树中，有两个左叶子，分别是 9 和 15，所以返回 24





/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var sumOfLeftLeaves = function(root) {
    let sum = 0
    let sumOfLeft = function(node){  //递归方法 需要构造一个递归函数 重要！！！
        if(!node) return 0
        if(node.left&&!node.left.left &&! node.left.right){  //判定 是否是左叶子节点 叶子节点（没有子节点）
            sum+=node.left.val
        }
         sumOfLeft(node.left)  //递归遍历 左子树 与右子树
         sumOfLeft(node.right)
    }
    sumOfLeft(root) //遍历根节点
   
    return sum 
};