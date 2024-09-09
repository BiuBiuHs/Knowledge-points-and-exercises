// 给定一个含有N个正整数的数组, 求出有多少个连续区间（包括单个正整数）, 它们的和大于等于x。

// 输入描述
// 第一行两个整数N x（0 < N <= 100000, 0 <= x <= 10000000)

// 第二行有N个正整数（每个正整数小于等于100)。

// 输出描述
// 输出一个整数，表示所求的个数。

// 用例1
// 输入

// 3 7
// 3 4 7

// 输出

// 4

/**
 * 计算和大于等于x的连续区间数量
 * @param {number[]} nums - 输入的正整数数组
 * @param {number} x - 目标和
 * @returns {number} - 满足条件的连续区间数量
 */
function countIntervals(nums, x) {
	const n = nums.length
	let count = 0
	let sum = 0
	let left = 0

	for (let right = 0; right < n; right++) {
		sum += nums[right]

		while (sum >= x) {
			// 当前窗口满足条件，计算以left开始的所有区间数量
			//说明此时 left 到right的区间已经满足了 加起来大于x的要求
			// 那么说明 从right 一直到 n 的所有区间都是满足条件的
			// 所以可以直接加上 n - right 就可以了
			// 这个技巧很关键，避免了重复计算

			/**
			 * eg [1,2,3,0,4]  5
			 * 1+2+3 >=5  那么 1+2+3 可以与后续两位数 0，4 任意组合都是一个新的区间
			 */
			count += n - right

			// 缩小窗口
			//在缩小窗口再次寻找新的满足的区间 进行累加运算
			sum -= nums[left]
			left++
		}
	}

	return count
}

// 处理输入
// const readline = require('readline')
// const rl = readline.createInterface({
// 	input: process.stdin,
// 	output: process.stdout,
// })

// let lineCount = 0
// let N, x
// let nums

// rl.on('line', (line) => {
// 	if (lineCount === 0) {
// 		;[N, x] = line.split(' ').map(Number)
// 	} else {
// 		nums = line.split(' ').map(Number)
// 		console.log(countIntervals(nums, x))
// 		rl.close()
// 	}
// 	lineCount++
// })

console.log(countIntervals([1, 2, 3, 0, 4], 5)) //7 种

// 这个解决方案的主要思路如下：

// 我们定义了一个 countIntervals 函数，它接受正整数数组 nums 和目标和 x 作为输入。

// 我们使用两个指针 left 和 right 来定义一个滑动窗口。

// 我们从左到右移动 right 指针，不断扩大窗口：

// 我们将新加入窗口的数加入 sum。
// 当 sum 大于等于 x 时，我们找到了一个满足条件的区间。
// 此时，以 left 为起点，right 为终点的所有区间都满足条件，我们将 n - right 加入计数（因为 right 到 n-1 的所有位置都可以作为终点）。
// 然后我们缩小窗口（移动 left 指针），直到 sum 再次小于 x。
// 我们重复这个过程，直到 right 指针到达数组末尾。

// 最后，我们返回满足条件的区间总数。

// 这个解决方案的时间复杂度是 O(n)，其中 n 是数组的长度。虽然我们有两个循环，但每个元素最多被访问两次（一次被加入窗口，一次被移出窗口）。空间复杂度是 O(1)，因为我们只使用了常数额外空间。
