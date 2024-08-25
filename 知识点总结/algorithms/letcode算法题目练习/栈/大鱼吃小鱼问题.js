// 两个数组一个是鱼的大小，一个是鱼的方向
// 每次向 左/右游动一个单位  方向不同且鱼的大小不同时才能吃掉小鱼
//使用栈来解题

/**
 * @param {number[]} sizes - 鱼的大小数组
 * @param {number[]} directions - 鱼的方向数组 (0 表示向左, 1 表示向右)
 * @return {number} - 存活的鱼的数量
 */
function numFishAlive(sizes, directions) {
	const stack = []

	for (let i = 0; i < sizes.length; i++) {
		const currentSize = sizes[i]
		const currentDirection = directions[i]

		// 如果当前鱼向右游，直接入栈
		if (currentDirection === 1) {
			stack.push(i)
			continue
		}

		// 当前鱼向左游，需要与栈中向右游的鱼对比
		while (stack.length > 0) {
			const topFishIndex = stack[stack.length - 1]

			// 如果栈顶的鱼也是向左游，跳出循环
			if (directions[topFishIndex] === 0) {
				break
			}

			// 比较大小
			if (sizes[topFishIndex] > currentSize) {
				// 栈顶的鱼更大，当前鱼被吃掉
				break
			} else {
				// 当前鱼更大，吃掉栈顶的鱼
				stack.pop()
			}
		}

		// 如果栈空了或者栈顶鱼向左游，当前鱼入栈
		if (stack.length === 0 || directions[stack[stack.length - 1]] === 0) {
			stack.push(i)
		}
	}

	// 栈的大小就是存活鱼的数量
	return stack.length
}

// 测试
const sizes = [4, 2, 5, 3, 1]
const directions = [1, 1, 0, 0, 0]
console.log(numFishAlive(sizes, directions)) // 应该输出 3
