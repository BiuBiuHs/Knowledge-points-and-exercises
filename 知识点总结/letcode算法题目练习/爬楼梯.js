/**
 * https://leetcode-cn.com/problems/climbing-stairs/submissions/
 * @param {number} n
 * @return {number}
 */
// 1. 直接递归
var climbStairs = function(n) {
    if(n == 1) return 1
    if(n == 2) return 2
    return climbStairs(n-1) + climbStairs(n-2)
 };
 //利用数组 减少重复计算
var climbStairs = function(n) {
    let dp = new Array()
     dp[1] = 1
     dp[2] = 2
      for (let i = 3; i <= n; i++) {
         dp[i] = dp[i - 1] + dp[i - 2]
     }
     return dp[n]
 };