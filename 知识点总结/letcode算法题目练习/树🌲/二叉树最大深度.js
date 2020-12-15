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
//非递归
var maxDepth = function(root) {
    if(root == null) return 0 
    let queue = [root]
    let deep = 0
    while(queue.length > 0){ //当队列长度不为 0 还有节点未遍历完成
        deep++                 //每次遍历都是去到二叉树的下一层节点 所以 深度 +1
        let temp = queue.length //记录当前层节点个数 用于遍历
        while(temp > 0){ //为0 时 说明当前层节点遍历完毕 要准备去到下一层
            let curr = queue.shift() //取出队首节点 查看它是否有子节点 有插入对尾
            if(curr.left != null){
                queue.push(curr.left)
            }
            if(curr.right != null){
                queue.push(curr.right)
            }
          temp-- //遍历完一个节点，轮到下一个节点 当前层节点个数 -1 
        }
       
       
    }
    return deep
};
//递归
var maxDepth = function(root) {
    if(root == null) return 0;//递归终止条件 节点为null 说明没有节点 返回0 
    return Math.max(maxDepth(root.left),maxDepth(root.right)) + 1 //当有下一级节点 比较深度 取深度较大的 并且 层级deep +1 
};


