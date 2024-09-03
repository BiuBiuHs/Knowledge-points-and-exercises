// 寿司店周年庆，正在举办优惠活动回馈新老用户。

// 寿司转盘上总共有 n 盘寿司， prices[i] 是第 i 盘寿司的价格。

// 如果客户选择了第 i 盘寿司， 寿司店免费赠送客户距离第 i 盘寿司最近的下一盘寿司 j ，前提是 prices[j] < prices[i]，如果没有满足条件的 i ，则不赠送寿司。

// 每个价格的寿司都可无限供应。

// 输入描述
// 输入的每一个数字代表寿司的价格，每盘寿司的价格之间使用空格分隔，例如：

// 3 15 6 14
// 表示:

// 第 0 盘寿司价格 prices[0] 为 3
// 第 1 盘寿司价格 prices[1] 为 15
// 第 2 盘寿司价格 prices[2] 为 6
// 第 3 盘寿司价格 prices[3] ​为 14
// 寿司的盘数 n 范围为：1 ≤ n ≤ 500
// 每盘寿司的价格 price 范围为：1≤ price ≤1000

// 输出享受优惠后的一组数据，每个值表示客户端选择第 i 盘寿司实际得到的寿司的总价格，使用空格进行分隔，例如：

// 3 21 9 17
// 示例1
// 输入：
// 3 15 6 14

// 输出：
// 3 21 9 17
/**
 * @param {string} input - 输入的寿司价格字符串
 * @return {string} - 输出的实际总价格字符串
 */
function calculateTotalPrices(input) {
	// 将输入字符串转换为数字数组
	const prices = input.split(' ').map(Number)
	const n = prices.length
	const result = new Array(n).fill(-1) // 存储赠送寿司的索引
	const stack = [] // 用于存储索引的单调栈

	// 使用单调栈找到每盘寿司对应的赠送寿司
	for (let i = 0; i < n * 2; i++) {
		const index = i % n

		while (
			stack.length > 0 &&
			prices[stack[stack.length - 1]] > prices[index]
		) {
			const topIndex = stack.pop()
			if (result[topIndex] === -1) {
				result[topIndex] = index
			}
		}

		if (i < n) {
			stack.push(index)
		}
	}

	// 计算实际总价格
	const totalPrices = prices.map((price, i) => {
		if (result[i] === -1) {
			return price // 没有赠送寿司
		} else {
			return price + prices[result[i]] // 加上赠送寿司的价格
		}
	})

	// 将结果转换为字符串
	return totalPrices.join(' ')
}

// 测试
const input = '3 15 6 14'
console.log(calculateTotalPrices(input)) // 输出: "3 21 6 20"
