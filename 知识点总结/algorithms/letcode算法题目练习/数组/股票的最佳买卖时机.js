// https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/description/?envType=study-plan-v2&envId=top-interview-150
// 给定一个数组 prices ，它的第 i 个元素 prices[i] 表示一支给定股票第 i 天的价格。

// 你只能选择 某一天 买入这只股票，并选择在 未来的某一个不同的日子 卖出该股票。设计一个算法来计算你所能获取的最大利润。

// 返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 0 。

// 示例 1：

// 输入：[7,1,5,3,6,4]
// 输出：5
// 解释：在第 2 天（股票价格 = 1）的时候买入，在第 5 天（股票价格 = 6）的时候卖出，最大利润 = 6-1 = 5 。
//      注意利润不能是 7-1 = 6, 因为卖出价格需要大于买入价格；同时，你不能在买入前卖出股票。
// 示例 2：

// 输入：prices = [7,6,4,3,1]
// 输出：0
// 解释：在这种情况下, 没有交易完成, 所以最大利润为 0。

/**
 * @param {number[]} prices
 * @return {number}
 * 该函数使用一次遍历来计算可能的最大利润。
 * 它跟踪最低价格和当前最大利润，
 * 每次遇到更低的价格时更新最低价格，
 * 否则计算当前价格与最低价格之差，更新最大利润
 */
function maxProfit(prices) {
	// 初始化最大利润为0
	let max = 0;
	// 初始化最小价格为JavaScript中的最大数值
	let min = Number.MAX_VALUE;

	// 遍历价格数组
	for (var i = 0; i < prices.length; i++) {
		if (prices[i] < min) {
			// 更新最小价格
			min = prices[i];
		} else {
			// 计算当前价格与最小价格的差，更新最大利润
			max = Math.max(max, prices[i] - min);
		}
	}
	// 返回最大利润
	return max;
}
