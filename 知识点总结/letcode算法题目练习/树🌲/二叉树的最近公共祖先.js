// 链接：https://leetcode-cn.com/problems/er-cha-shu-de-zui-jin-gong-gong-zu-xian-lcof
// 给定一个二叉树, 找到该树中两个指定节点的最近公共祖先。

// 百度百科中最近公共祖先的定义为：“对于有根树 T 的两个结点 p、q，最近公共祖先表示为一个结点 x，满足 x 是 p、q 的祖先且 x 的深度尽可能大（一个节点也可以是它自己的祖先）。”

// 例如，给定如下二叉树:  root = [3,5,1,6,2,0,8,null,null,7,4]



//  

// 示例 1:

// 输入: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
// 输出: 3
// 解释: 节点 5 和节点 1 的最近公共祖先是节点 3。
// 示例 2:

// 输入: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4
// 输出: 5
// 解释: 节点 5 和节点 4 的最近公共祖先是节点 5。因为根据定义最近公共祖先节点可以为节点本身。
//  

// 说明:

// 所有节点的值都是唯一的。
// p、q 为不同节点且均存在于给定的二叉树中。



/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

//  方法二：存储父节点
//  思路
 
//  我们可以用哈希表存储所有节点的父节点，然后我们就可以利用节点的父节点信息从 p 结点开始不断往上跳，并记录已经访问过的节点，再从 q 节点开始不断往上跳，如果碰到已经访问过的节点，那么这个节点就是我们要找的最近公共祖先。
 
//  算法
 
//  1.从根节点开始遍历整棵二叉树，用哈希表记录每个节点的父节点指针。
//  2.从 p 节点开始不断往它的祖先移动，并用数据结构记录已经访问过的祖先节点。
//  3.同样，我们再从 q 节点开始不断往它的祖先移动，如果有祖先已经被访问过，即意味着这是 p 和 q 的深度最深的公共祖先，即 LCA 节点。
 
/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
 var lowestCommonAncestor = function(root, p, q) {
    let parentArr = new Map()
    let visitedParent = new Map()
    let dfs= function(node) {
        if(node.left!=null){
            parentArr.set(node.left.val,node)
            dfs(node.left)
        }
        if(node.right!=null){
            parentArr.set(node.right.val,node)
            dfs(node.right)
        }
    }
    dfs(root)

    while(p!=null){
        visitedParent.set(p.val)
        p = parentArr.get(p.val)
    }
    while(q!=null){
       if(visitedParent.has(q.val)) return q
        q = parentArr.get(q.val)
    }
};