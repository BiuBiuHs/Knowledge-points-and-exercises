
// 518. 零钱兑换 II
// 给定不同面额的硬币和一个总金额。写出函数来计算可以凑成总金额的硬币组合数。假设每一种面额的硬币有无限个。 

// https://leetcode-cn.com/problems/coin-change-2/

// 示例 1:

// 输入: amount = 5, coins = [1, 2, 5]
// 输出: 4
// 解释: 有四种方式可以凑成总金额:
// 5=5
// 5=2+2+1
// 5=2+1+1+1
// 5=1+1+1+1+1
// 示例 2:

// 输入: amount = 3, coins = [2]
// 输出: 0
// 解释: 只用面额2的硬币不能凑成总金额3。
// 示例 3:

// 输入: amount = 10, coins = [10] 
// 输出: 1
 

// 注意:

// 你可以假设：

// 0 <= amount (总金额) <= 5000
// 1 <= coin (硬币面额) <= 5000
// 硬币种类不超过 500 种
// 结果符合 32 位符号整数


/**
 * @param {number} amount
 * @param {number[]} coins
 * @return {number}
 */
 var change = function(amount, coins) {

    var dp = new Array(amount + 1).fill(0) //生成和 目标金额一样长的数组 +1 的目的是 包括0 
    dp[0] = 1 //当金额为0 时 只有一种组合方式 不使用任何硬币 
    for (let coin of coins) { //遍历 不同金额 硬币数组
        for (let j = coin; j < amount + 1; ++j) { //对于每个面值的硬币 我们从0开始 递归累加到amount金额 
            //从0开始递推
            dp[j] += dp[j - coin] //计算组合数量 

        }
    }
    return dp[amount]

};

// 时间复杂度：O(N×amount)。其中 N 为 coins 数组的长度。
// 空间复杂度：O(amount)，dp 数组使用的空间。

