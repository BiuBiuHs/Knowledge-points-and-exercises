/**
 *  https://leetcode-cn.com/problems/minimum-genetic-mutation/submissions/
 * @param {string} start
 * @param {string} end
 * @param {string[]} bank
 * @return {number}
 */
var minMutation = function (start, end , bank){
    if(start == end){
        return 0
    }
    var bankSet = new Map() //确保不会有重复的字符串
    for (let x of bank){
        bankSet.set(x,true)
    }
    var base = {'A':["C","G","T"],'C':["A","G","T"],'G':["A","C","T"],'T':["A","C","G"]};

    var level = 0;
    var queue = [start]  //【start】===》['AACCGGTT']
    while(queue.length != 0){
        var size = queue.length //队列的长度 
        while(size>0){
            let curr = queue.pop()  //出队 将字符串结果取出
            if(curr == end){  //终止循环的条件 变异成最终形态的字符串
                return level;
            }
            let arrCurr = curr.split('')  //分隔字符串
            for(var i = 0;i < arrCurr.length; i++){ 
                let oldCurr = arrCurr[i] //暂时保存原来当前index的 字符
                var tempBase = base[arrCurr[i]] // 该变异字符串一定不会变异成自身 所以 例如当为A时  一定是 【C，G，T】
                for (var j =0 ;j < tempBase.length; j++){
                    arrCurr[i]=tempBase[j] //对当前index的字母进行替换， 替换成可变异的后的字母
                    let strCurr = arrCurr.join('')  // 将变异后的字符串数组 拼接起来
                    if(bankSet.has(strCurr)){  //如果目标变异库中存在 则删除掉  并且向队列中添加 变异后的字符串
                        bankSet.delete(strCurr)
                        queue.unshift(strCurr)
                    }

                }
                arrCurr[i] = oldCurr //将保存的原字符串 复原 
            }
            size--
        }
        level++
       
    }
    return -1
}