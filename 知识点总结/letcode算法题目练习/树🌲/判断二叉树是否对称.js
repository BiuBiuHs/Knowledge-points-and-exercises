// 链接：https://leetcode-cn.com/problems/dui-cheng-de-er-cha-shu-lcof
// 请实现一个函数，用来判断一棵二叉树是不是对称的。如果一棵二叉树和它的镜像一样，那么它是对称的。

// 例如，二叉树 [1,2,2,3,4,4,3] 是对称的。

//     1
//    / \
//   2   2
//  / \ / \
// 3  4 4  3
// 但是下面这个 [1,2,2,null,3,null,3] 则不是镜像对称的:

//     1
//    / \
//   2   2
//    \   \
//    3    3

//  

// 示例 1：

// 输入：root = [1,2,2,3,4,4,3]
// 输出：true
// 示例 2：

// 输入：root = [1,2,2,null,3,null,3]
// 输出：false
//  

// 限制：

// 0 <= 节点个数 <= 1000


/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

/**
 * @param {TreeNode} root
 * @return {boolean}
 */
 var isSymmetric = function(root) {
    if(!root)return true
    var isEqual = function (left,right){
        if(!left&&!right)return true //当左右子节点都不存 
        if(!left || !right)return false //如果 左子节点 或右子节点 有值 说明不对称
        //递归遍历 判断子节点的值相等 
        // 且 左子树的左节点与右子树的右节点 相等 
        // 且 左子树的右节点与右子树的左节点 相等 此时二叉树才对称。
        return left.val === right.val && isEqual(left.left,right.right)&&isEqual(left.right,right.left) 
    }
   return  isEqual(root.left,root.right)
};
