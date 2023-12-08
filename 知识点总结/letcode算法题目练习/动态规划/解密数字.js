// // https://leetcode.cn/problems/ba-shu-zi-fan-yi-cheng-zi-fu-chuan-lcof/solutions/280198/ba-shu-zi-fan-yi-cheng-zi-fu-chuan-by-leetcode-sol/

// 现有一串神秘的密文 ciphertext，经调查，密文的特点和规则如下：

// 密文由非负整数组成
// 数字 0-25 分别对应字母 a-z
// 请根据上述规则将密文 ciphertext 解密为字母，并返回共有多少种解密结果。

 

 

// 示例 1:

// 输入: ciphertext = 216612
// 输出: 6
// 解释: 216612 解密后有 6 种不同的形式，分别是 "cbggbc"，"vggbc"，"vggm"，"cbggm"，"cqggbc" 和 "cqggm" 
 

// 提示：

// 0 <= ciphertext < 231


//纯递归方案。
var crackNumber = function(ciphertext) {

    function dfs(arr,index) {
        //当到达下标时说明前面的选择都是有效的 此时会生成一种正确方案 所以返回1
        if(index == arr.length) {
            return 1
        }
        //当后续还有其他元素时，答案由下一个元素决定。
        //此时只能转换 当前的index的数字。
        let ways = dfs(arr,index + 1)
        //index 不能越界 超过数组的长度。并且前后两个元素的和小于 规定的范围时 0-25 为有效范围。且不能以0为前导 也就是不能为02、0x
        if(index < arr.length && ((arr[index] - '0' *10) + arr[index+1]-'0') < 26 && arr[index] != '0'){
            //用之前的的值 + 跳过这两个元素来计算。
            ways += dfs(arr, index + 2)
        }

        return ways
    }
    
    return dfs(ciphertext.toString().split(''),0)
    };

    //动态规划

function crackNumber (ciphertext) {
    const ch = ciphertext.toString()
    let len = ch.length 
    const dp = new Array(len + 1).fill(0)
    dp[0] = 1
    dp[1] = 1
    for(var i = 2 ; i <= len ; i++) {
        let count = (ch[i -2] - '0' )* 10 + (ch[i-1] -'0')
        if(count >9 && count < 26 ) {
            //index 不能越界 超过数组的长度。并且前后两个元素的和小于 规定的范围时 0-25 为有效范围。且不能以0为前导 也就是不能为02、0x
            dp[i] = dp[i-1] + dp [i - 2]

        }else{
            //否则是转化当前的数字。
            dp[i] = dp[i - 1]
        }
    }
    return dp[len]
}