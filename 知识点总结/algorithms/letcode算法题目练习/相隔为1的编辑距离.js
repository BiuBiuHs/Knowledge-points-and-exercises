// https://leetcode.cn/problems/one-edit-distance/description/?envType=study-plan-v2&envId=baidu-2023-fall-sprint

// 给定两个字符串 s 和 t ，如果它们的编辑距离为 1 ，则返回 true ，否则返回 false 。

// 字符串 s 和字符串 t 之间满足编辑距离等于 1 有三种可能的情形：

// 往 s 中插入 恰好一个 字符得到 t
// 从 s 中删除 恰好一个 字符得到 t
// 在 s 中用 一个不同的字符 替换 恰好一个 字符得到 t
 

// 示例 1：

// 输入: s = "ab", t = "acb"
// 输出: true
// 解释: 可以将 'c' 插入字符串 s 来得到 t。
// 示例 2:

// 输入: s = "cab", t = "ad"
// 输出: false
// 解释: 无法通过 1 步操作使 s 变为 t。
 


function isOneEditDistance (s,t)  {
    const m = s.length ,n = t.length
    if(m - n ==1) {
        return isOneInsert(t,s)
    }else if(n - m ==1) {
        return isOneInsert(s,t)
    }else if(m ===n) {
        let hasOneDiffrent = false 
        //长度相等时的判断 
        for(var i = 0; i < m ;i++) {
            if(s[i] != t[i]) {
                if(!hasOneDiffrent) {
                    hasOneDiffrent= true
                }else{
                    return  false
                }
            }
        }
        return hasOneDiffrent
    }else{
        return false
    }
}

//相差为1时的比较方法
function isOneInsert (short,longer) {
    const s = short.length 
    const l = longer.length 

    let p1 = 0,p2 = 0;
    //使用两个计数变量 来控制终止条件
    while(p1< s && p2< l) {
        //必须两个字符串相同位置的值相等时 较短的index才会 ++  指向下一个字符的位置
        if(short[p1] ===  longer[p2]) {
            p1++
        }
        //p2 每次都累加
        p2++
        //在循环中 只要两个计数的差值大于1 就说明有两个不同的字符 直接返回false即可
        if(p2 - p1 > 1) return false
    }

    return true
   
}