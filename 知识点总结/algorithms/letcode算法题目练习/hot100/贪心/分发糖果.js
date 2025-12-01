// https://leetcode.cn/problems/candy/description/

// n 个孩子站成一排。给你一个整数数组 ratings 表示每个孩子的评分。

// 你需要按照以下要求，给这些孩子分发糖果：

// 每个孩子至少分配到 1 个糖果。
// 相邻两个孩子中，评分更高的那个会获得更多的糖果。
// 请你给每个孩子分发糖果，计算并返回需要准备的 最少糖果数目 。

// 示例 1：

// 输入：ratings = [1,0,2]
// 输出：5
// 解释：你可以分别给第一个、第二个、第三个孩子分发 2、1、2 颗糖果。
// 示例 2：

// 输入：ratings = [1,2,2]
// 输出：4
// 解释：你可以分别给第一个、第二个、第三个孩子分发 1、2、1 颗糖果。
//      第三个孩子只得到 1 颗糖果，这满足题面中的两个条件。

/**
 * @param {number[]} ratings
 * @return {number}
 */
var candy = function (ratings) {
	// 初始化一个数组，每个孩子至少有一个糖果
	let candy = new Array(ratings.length).fill(1);

	// 第一次遍历，从左到右，确保右边的孩子如果评分比左边的高，糖果数也比左边的多
	for (let i = 1; i < ratings.length; i++) {
		if (ratings[i] > ratings[i - 1]) {
			// 如果当前孩子的评分比前一个孩子高，当前孩子的糖果数应比前一个孩子多一个
			candy[i] = candy[i - 1] + 1;
		}
	}

	// 第二次遍历，从右到左，确保左边的孩子如果评分比右边的高，糖果数也比右边的多
	for (let i = ratings.length - 2; i >= 0; i--) {
		if (ratings[i] > ratings[i + 1]) {
			// 如果当前孩子的评分比后一个孩子高，当前孩子的糖果数应至少比后一个孩子多一个
			// 使用 Math.max 确保当前孩子的糖果数在两次遍历中都是最多的
			candy[i] = Math.max(candy[i + 1] + 1, candy[i]);
		}
	}

	// 计算并返回所需的最少糖果总数
	return candy.reduce((sum, next) => sum + next, 0);
};

// 详细解释
// 初始化糖果数组：

// let candy = new Array(ratings.length).fill(1);
// 初始化一个长度与 ratings 相同的数组 candy，并将每个孩子的糖果数初始化为 1。
// 第一次遍历（从左到右）：

// for (let i = 1; i < ratings.length; i++) { ... }
// 从第二个孩子开始遍历，确保如果当前孩子的评分比前一个孩子高，当前孩子的糖果数也比前一个孩子多一个。
// if (ratings[i] > ratings[i - 1]) { candy[i] = candy[i - 1] + 1; }
// 如果当前孩子的评分比前一个孩子高，当前孩子的糖果数应比前一个孩子多一个。
// 第二次遍历（从右到左）：

// for (let i = ratings.length - 2; i >= 0; i--) { ... }
// 从倒数第二个孩子开始遍历，确保如果当前孩子的评分比后一个孩子高，当前孩子的糖果数也比后一个孩子多一个。
// if (ratings[i] > ratings[i + 1]) { candy[i] = Math.max(candy[i + 1] + 1, candy[i]); }
// 如果当前孩子的评分比后一个孩子高，当前孩子的糖果数应至少比后一个孩子多一个。使用 Math.max 确保当前孩子的糖果数在两次遍历中都是最多的。
// 计算并返回最少糖果总数：

// return candy.reduce((sum, next) => sum + next, 0);
// 使用 reduce 方法计算并返回 candy 数组中所有糖果数的总和，即所需的最少糖果总数。
