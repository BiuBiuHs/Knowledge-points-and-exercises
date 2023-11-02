
/**
 * // Definition for a Node.
 * function Node(val,children) {
 *    this.val = val;
 *    this.children = children;
 * };
 */

/**
 * @param {Node|null} root
 * @return {number[][]}
 */
var levelOrder = function(root) {
    if(!root) return []
    const queue = [root]
    const ans = []
    while(queue.length) {
        const n = queue.length
        const tmp = []
        for(var i = 0; i < n ; i++) {
            const cur = queue.shift()
            tmp.push(cur.val)
            //与二叉树的层序遍历的区别就是这  需要将children取出来单独遍历 将所有的字元素放到队列中
            for(var item of cur.children){
                  queue.push(item)
            }
           
        }
        ans.push(tmp)
    }
    return ans
};