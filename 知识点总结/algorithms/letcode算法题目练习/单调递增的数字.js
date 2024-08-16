
// https://leetcode-cn.com/problems/monotone-increasing-digits/

// 给定一个非负整数 N，找出小于或等于 N 的最大的整数，同时这个整数需要满足其各个位数上的数字是单调递增。

// （当且仅当每个相邻位数上的数字 x 和 y 满足 x <= y 时，我们称这个整数是单调递增的。）

// 示例 1:

// 输入: N = 10
// 输出: 9
// 示例 2:

// 输入: N = 1234
// 输出: 1234


/**
 * @param {number} N
 * @return {number}
 */
var monotoneIncreasingDigits = function(N) {
    //将数字格式化为 一个str 数组
    let strN = N.toString().split('').map(v=>+v)
    let i = 1
    // 从第一位开始遍历 使得最大的数 的前X位 尽量与给定的数字N 相同 
    // 找出 不递增的 索引 index
    while (i<strN.length&&strN[i-1]<= strN[i]){
        i+=1
    }
    //此时的索引 应该继续小于 str 数组的的长度
    if(i<strN.length){
        //当索引大于0 并且数组 i-1 位 大于 第 i 位时 不满足递增规则
        // 将第i-1位 减1  并且比较 i-1与i-2 位的大小 
        // 从i-1 位开始 从右向左 比较 来保证 前面的数字是递增的
        while(i>0 && strN[i-1]>strN[i]){
            strN[i-1] -=1
            i--
        }
        //所有的数字都满足递增规则 
        //此时 从第i位 后面都补充9 则保证这个数字最大
        for(i+=1;i<strN.length;i++){
            strN[i]=9
        }
    }
    return parseInt( strN.join(''))
 };
 
 