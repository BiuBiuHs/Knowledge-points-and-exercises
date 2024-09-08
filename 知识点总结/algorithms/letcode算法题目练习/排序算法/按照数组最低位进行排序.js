// 给定一个非空数组(列表)，其元素数据类型为整型，请按照数组元素十进制最低位从小到大进行排序，十进制最低位相同的元素，相对位置保持不变
// 当数组元素为负值时，十进制最低位等同于去除符号位后对应十进制值最低位。
// 输入描述
// 给定一个非空数组，其元素数据类型为32位有符号整数，数组长度[1,1000]

// 输出描述
// 输出排序后的数组

// 示例1
// 输入：
// 1,2,5,-21,22,11,55,-101,42,8,7,32

// 输出：
// 1,-21,11,-101,2,22,42,32,5,55,7,8

/**
 * 按十进制最低位排序数组
 * @param {number[]} arr - 输入的整数数组
 * @returns {number[]} - 排序后的数组
 */
function sortByLastDigit(arr) {
	// 创建一个数组来存储每个最低位的元素
	const buckets = Array.from({ length: 10 }, () => [])

	// 将元素分配到对应的桶中
	for (let num of arr) {
		let lastDigit = Math.abs(num % 10)
		buckets[lastDigit].push(num)
	}

	// 按顺序从桶中取出元素
	const result = []
	for (let bucket of buckets) {
		result.push(...bucket)
	}

	return result
}

// 处理输入
const readline = require('readline')
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

rl.on('line', (line) => {
	const arr = line.split(',').map(Number)
	const sortedArr = sortByLastDigit(arr)
	console.log(sortedArr.join(','))
	rl.close()
})
