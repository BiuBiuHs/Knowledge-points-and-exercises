
// https://leetcode.cn/problems/binary-tree-right-side-view/description/?envType=study-plan-v2&envId=bytedance-2023-fall-sprint


// 给定一个二叉树的 根节点 root，想象自己站在它的右侧，按照从顶部到底部的顺序，返回从右侧所能看到的节点值。

 

// 示例 1:



// 输入: [1,2,3,null,5,null,4]
// 输出: [1,3,4]
// 示例 2:

// 输入: [1,null,3]
// 输出: [1,3]
// 示例 3:

// 输入: []
// 输出: []
 

// 提示:

// 二叉树的节点个数的范围是 [0,100]
// -100 <= Node.val <= 100 


function rightSight (root) {
    const ans = []

    function dfs(node,step) {
        //使用深度优先遍历 先访问右子节点
        //终止条件 =》节点不存在 
        if(node) {
            //深度 等于数组长度时 第一个访问的一定是右子节点
            //将节点值push进去 
            if(step === ans.length) {
                ans.push(node.val)
            }
            dfs(node.right ,step + 1)
            dfs(node.left ,step + 1)
        }
    }  

    dfs(root,0)
    return ans  
}


//解2 
//使用层序遍历 取每层的最后一个元素一定是右边看到的节点
function rightSideView(root) {
    if(!root) return []
    let temp = []
    const ans = []
    const queue =[root]

    while(queue.length ) {
        const n = queue.length 
        for(var i = 0; i < n ; i++) {
            const {left,right ,val} = queue.shift()
            if(left) queue.push(left)
            if(right) queue.push(right)
            temp.push(val)
        }
        ans.push(temp[temp.length -1])
        temp = []
    }
    return ans
}