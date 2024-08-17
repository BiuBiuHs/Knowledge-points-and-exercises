// 给定一个DOM tree和目标节点，请找出其左边的节点。
//使用层序遍历保存上一个节点 ，当前节点为目标节点时 保存的上一个节点即为 左边的节点


function leftNode (root ,target) {
    const queue = [root];
    while(queue.length){
        var n = queue.length
        let prev = null
        for (var i = 0 ;i < n ;i++){
            //每次遍历一个层级 
            let cur = queue.shift()
            if(cur === target){
                return prev
            }
            //将该层级的第N个节点的所有子节点都放到队列中 继续遍历
            queue.push(cur.children)
            prev = cur
        }
    }
    return null
}