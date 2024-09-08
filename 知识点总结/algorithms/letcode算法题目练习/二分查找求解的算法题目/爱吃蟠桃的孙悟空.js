// 孙悟空爱吃蟠桃，有一天趁着蟠桃园守卫不在来偷吃。已知蟠桃园有 N 棵桃树，每颗树上都有桃子，守卫将在 H 小时后回来。

// 孙悟空可以决定他吃蟠桃的速度K（个/小时），每个小时选一颗桃树，并从树上吃掉 K 个，如果树上的桃子少于 K 个，则全部吃掉，并且这一小时剩余的时间里不再吃桃。

// 孙悟空喜欢慢慢吃，但又想在守卫回来前吃完桃子。

// 请返回孙悟空可以在 H 小时内吃掉所有桃子的最小速度 K（K为整数）。如果以任何速度都吃不完所有桃子，则返回0。

// 输入描述
// 第一行输入为 N 个数字，N 表示桃树的数量，这 N 个数字表示每颗桃树上蟠桃的数量。

// 第二行输入为一个数字，表示守卫离开的时间 H。

// 其中数字通过空格分割，N、H为正整数，每颗树上都有蟠桃，且 0 < N < 10000，0 < H < 10000。

// 输出描述
// 吃掉所有蟠桃的最小速度 K，无解或输入异常时输出 0。

function canEatAll(piles, speed, h) {
	let time = 0
	for (let pile of piles) {
		//用每棵树上桃子除以吃的速度 来计算需要的时间
		time += Math.ceil(pile / speed)
	}
	//如果总共的时间小于等于 护卫离开的时间则可以吃完 否则吃不完
	return time <= h
}

function minEatingSpeed(piles, h) {
	if (piles.length > h) {
		return 0
	}

	//left right代表的就是吃的速度 不是数组中的某个元素的下标值，因为要计算最小的吃桃速度 k 要从1开始累积 以及利用
	// 给出的桃树的最大桃子数量 当作吃的速度 与最小速度进行 二分 来算出最小的吃桃速度
	//最终找到的这个最终值一定是最小的吃桃速度。
	let left = 1
	let right = Math.max(...piles)

	//利用二分查找
	while (left < right) {
		//算出mid的位置
		let mid = Math.floor((left + right) / 2)
		console.log(mid, 'mid')
		if (canEatAll(piles, mid, h)) {
			right = mid
			console.log(right, 'right')
		} else {
			console.log(left, 'left')
			left = mid + 1
		}
	}

	return left
}

// 读取输入
function processInput(input) {
	try {
		const lines = input.trim().split('\n')
		const piles = lines[0].split(' ').map(Number)
		const h = parseInt(lines[1])

		// 检查输入是否符合条件
		if (!(0 < piles.length && piles.length < 10000 && 0 < h && h < 10000)) {
			return 0
		}

		return minEatingSpeed(piles, h)
	} catch (error) {
		return 0
	}
}

// 示例使用
const input = `3 6 7 11
8`
console.log(processInput(input))
