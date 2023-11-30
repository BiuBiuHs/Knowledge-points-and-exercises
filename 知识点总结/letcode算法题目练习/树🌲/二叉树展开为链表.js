// https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/description/?envType=study-plan-v2&envId=top-interview-150

// 给你二叉树的根结点 root ，请你将它展开为一个单链表：

// 展开后的单链表应该同样使用 TreeNode ，其中 right 子指针指向链表中下一个结点，而左子指针始终为 null 。
// 展开后的单链表应该与二叉树 先序遍历 顺序相同。



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
 * @return {void} Do not return anything, modify root in-place instead.
 */
var flatten = function(root) {
    //一个数组存储按照前序遍历顺序的节点
    const list = []
    //此数组用于回溯 
    const stack = []
    let node = root
    //判断条件 节点不为null 或者 stack中还有节点需要继续遍历
    while(node !== null || stack.length ) {
        //前序遍历 以及优先访问左子节点
        while(node!==null) {
            //存储所有遍历过的节点
            list.push(node)
            stack.push(node)
            node = node.left
        }
        //回溯上一个节点，继续访问右子节点。
        node = stack.pop()
        node = node.right
    }
   //所有节点已经按照前序遍历的顺序 放到了数组中。
    for(var i = 1; i < list.length ;i++) {
        const prev = list[i -1]
        const cur = list[i]
        //左子节点置空
        prev.left = null
        prev.right = cur
        //拼接到右节点上即可
    }  
   };