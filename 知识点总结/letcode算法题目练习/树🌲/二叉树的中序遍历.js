// https://leetcode-cn.com/problems/binary-tree-inorder-traversal/submissions/


// 94. 二叉树的中序遍历
// 给定一个二叉树的根节点 root ，返回它的 中序 遍历。

 

// 示例 1：


// 输入：root = [1,null,2,3]
// 输出：[1,3,2]
// 示例 2：

// 输入：root = []
// 输出：[]
// 示例 3：

// 输入：root = [1]
// 输出：[1]
// 示例 4：


// 输入：root = [1,2]
// 输出：[2,1]
// 示例 5：


// 输入：root = [1,null,2]
// 输出：[1,2]
 

// 提示：

// 树中节点数目在范围 [0, 100] 内
// -100 <= Node.val <= 100

//递归 
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
 * @return {number[]}
 */
 var inorderTraversal = function(root) {
    let res = []
     let dfs = function(node){
         if(!node )return null
         dfs(node.left)
         res.push(node.val)
         dfs(node.right)
     }
     dfs(root)
     return res
    };

    //迭代解决 
    var inorderTraversal = function(root) {
        const res = [];
        const stk = [];
        while (root || stk.length) { //判断节点是否为null 或栈 不为空 继续遍历 
            while (root) { // 思路还是 先放入树的所有左节点 
                stk.push(root);
                root = root.left;
            }
            root = stk.pop(); //将栈顶元素 弹出 并记录下值
            res.push(root.val);
            root = root.right; //继续遍历 右节点 第一次遍历时 root.right 为null 但是栈内元素不为空 所以继续迭代 遍历。
        }
        return res;
    };
    
