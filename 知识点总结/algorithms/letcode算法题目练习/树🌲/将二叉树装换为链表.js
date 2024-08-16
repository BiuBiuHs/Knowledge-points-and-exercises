// 链接：https://leetcode-cn.com/problems/binode-lcci
// 二叉树数据结构TreeNode可用来表示单向链表（其中left置空，right为下一个链表节点）。实现一个方法，把二叉搜索树转换为单向链表，要求依然符合二叉搜索树的性质，转换操作应是原址的，也就是在原始的二叉搜索树上直接修改。

// 返回转换后的单向链表的头节点。

// 注意：本题相对原题稍作改动

//  

// 示例：

// 输入： [4,2,5,1,3,null,6,0]
// 输出： [0,null,1,null,2,null,3,null,4,null,5,null,6]
// 提示：

// 节点数量不会超过 100000。

//解法 使用二叉树的中序遍历 

var convertBiNode = function(root) {
    if(!root) return null;
        let preNode = new TreeNode(0);
        //用于存放最后的结果
        let dummyRoot = preNode;
        function dfs(root){
            if(!root) return null;
            //中序遍历 ,左-根-右
            dfs(root.left);
            //将当前结点的左子节点置空
            root.left = null;
            //将上一个结点的由结点指向当前结点
            preNode.right = root;
            //上一个结点下移到当前结点
            preNode  =root;
            dfs(root.right)
        }
        dfs(root);
        return dummyRoot.right;
    
    };



