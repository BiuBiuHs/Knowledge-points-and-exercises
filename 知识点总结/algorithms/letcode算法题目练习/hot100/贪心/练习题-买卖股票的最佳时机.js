/**
 * 121. 买卖股票的最佳时机
 * https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/
 * 
 * 题目：给定一个数组 prices，它的第 i 个元素 prices[i] 表示一支给定股票第 i 天的价格。
 * 你只能选择某一天买入这只股票，并选择在未来的某一个不同的日子卖出该股票。
 * 设计一个算法来计算你所能获取的最大利润。
 * 如果你不能获取任何利润，返回 0。
 * 
 * 示例：
 * 输入：[7,1,5,3,6,4]
 * 输出：5
 * 解释：在第 2 天（股票价格 = 1）的时候买入，在第 5 天（股票价格 = 6）的时候卖出，最大利润 = 6-1 = 5。
 * 注意利润不能是 7-1 = 6, 因为卖出价格需要大于买入价格。
 * 
 * 输入：prices = [7,6,4,3,1]
 * 输出：0
 * 解释：在这种情况下, 交易无法完成, 所以最大利润为 0。
 * 
 * 提示：
 * - 1 <= prices.length <= 10^5
 * - 0 <= prices[i] <= 10^4
 */

/**
 * 方法1：贪心算法（一次遍历）
 * 
 * 核心思想：
 * 1. 遍历价格数组，维护最低买入价格
 * 2. 计算每一天卖出的最大利润
 * 3. 更新全局最大利润
 * 
 * 贪心策略：
 * - 在每一天，如果卖出，应该在历史最低价买入（贪心选择）
 * - 如果当前价格更低，更新最低买入价格
 */
var maxProfit = function(prices) {
    let minPrice = Infinity;  // 历史最低买入价格
    let maxProfit = 0;         // 最大利润
    
    for (let i = 0; i < prices.length; i++) {
        // 如果当前价格更低，更新最低买入价格
        if (prices[i] < minPrice) {
            minPrice = prices[i];
        } else {
            // 计算在当前价格卖出的利润
            let profit = prices[i] - minPrice;
            // 更新最大利润
            maxProfit = Math.max(maxProfit, profit);
        }
    }
    
    return maxProfit;
};

// 测试
console.log("=== 买卖股票的最佳时机问题 ===");
console.log("输入：prices = [7,1,5,3,6,4]");
console.log("输出：", maxProfit([7,1,5,3,6,4]));
console.log("期望：5");

console.log("\n输入：prices = [7,6,4,3,1]");
console.log("输出：", maxProfit([7,6,4,3,1]));
console.log("期望：0");

/**
 * ============================================
 * 算法执行过程详解（以 prices = [7,1,5,3,6,4] 为例）
 * ============================================
 * 
 * 执行过程：
 * 
 * i = 0: prices[0] = 7
 *   prices[0] = 7 < minPrice = Infinity ✅
 *   minPrice = 7
 *   maxProfit = 0
 * 
 * i = 1: prices[1] = 1
 *   prices[1] = 1 < minPrice = 7 ✅
 *   minPrice = 1
 *   maxProfit = 0
 * 
 * i = 2: prices[2] = 5
 *   prices[2] = 5 >= minPrice = 1
 *   profit = 5 - 1 = 4
 *   maxProfit = max(0, 4) = 4
 * 
 * i = 3: prices[3] = 3
 *   prices[3] = 3 >= minPrice = 1
 *   profit = 3 - 1 = 2
 *   maxProfit = max(4, 2) = 4
 * 
 * i = 4: prices[4] = 6
 *   prices[4] = 6 >= minPrice = 1
 *   profit = 6 - 1 = 5
 *   maxProfit = max(4, 5) = 5
 * 
 * i = 5: prices[5] = 4
 *   prices[5] = 4 >= minPrice = 1
 *   profit = 4 - 1 = 3
 *   maxProfit = max(5, 3) = 5
 * 
 * 最终结果：5
 */

/**
 * ============================================
 * 贪心策略证明
 * ============================================
 * 
 * 【贪心选择性质】
 * 
 * 假设最优解是在第 i 天买入，第 j 天卖出（i < j）。
 * 
 * 如果存在第 k 天（i < k < j），使得 prices[k] < prices[i]，
 * 那么在第 k 天买入会更优，因为：
 * - prices[j] - prices[k] > prices[j] - prices[i]
 * 
 * 所以，最优解一定是在历史最低价买入。
 * 
 * 贪心策略：在每一天，如果卖出，应该在历史最低价买入。
 * 这个策略保证了我们总是考虑最优的买入时机。
 * 
 * 【最优子结构】
 * 
 * 如果前 i 天的最大利润是 maxProfit，那么前 i+1 天的最大利润
 * 可以通过 max(maxProfit, prices[i+1] - minPrice) 得到。
 */

/**
 * ============================================
 * 方法2：动态规划（对比）
 * ============================================
 * 
 * 动态规划思路：
 * - dp[i][0] 表示第 i 天持有股票的最大利润
 * - dp[i][1] 表示第 i 天不持有股票的最大利润
 * 
 * 状态转移：
 * - dp[i][0] = max(dp[i-1][0], -prices[i])
 * - dp[i][1] = max(dp[i-1][1], dp[i-1][0] + prices[i])
 * 
 * 时间复杂度：O(n)
 * 空间复杂度：O(n) 或 O(1)（可以优化）
 * 
 * 贪心算法更简洁：
 * - 时间复杂度：O(n)
 * - 空间复杂度：O(1)
 */
var maxProfitDP = function(prices) {
    let n = prices.length;
    // dp[i][0] 表示第 i 天持有股票的最大利润
    // dp[i][1] 表示第 i 天不持有股票的最大利润
    let dp = new Array(n).fill(0).map(() => new Array(2).fill(0));
    
    dp[0][0] = -prices[0];  // 第 0 天买入
    dp[0][1] = 0;           // 第 0 天不买入
    
    for (let i = 1; i < n; i++) {
        // 第 i 天持有股票：前一天持有 或 今天买入
        dp[i][0] = Math.max(dp[i-1][0], -prices[i]);
        // 第 i 天不持有股票：前一天不持有 或 今天卖出
        dp[i][1] = Math.max(dp[i-1][1], dp[i-1][0] + prices[i]);
    }
    
    return dp[n-1][1];
};

/**
 * ============================================
 * 方法3：简化版（推荐）
 * ============================================
 */
var maxProfitSimple = function(prices) {
    let minPrice = prices[0];
    let maxProfit = 0;
    
    for (let i = 1; i < prices.length; i++) {
        // 更新最低买入价格
        minPrice = Math.min(minPrice, prices[i]);
        // 更新最大利润
        maxProfit = Math.max(maxProfit, prices[i] - minPrice);
    }
    
    return maxProfit;
};

/**
 * ============================================
 * 时间复杂度与空间复杂度
 * ============================================
 * 
 * 时间复杂度：O(n)
 * - 只需要遍历一次数组
 * 
 * 空间复杂度：O(1)
 * - 只使用了常数额外空间
 */

