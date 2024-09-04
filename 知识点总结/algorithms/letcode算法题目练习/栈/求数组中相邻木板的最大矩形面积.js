// 给定一个数组，数组中的元素代表木板的高度。请你求出相邻木板能剪出的最大矩形面积。

/**
 * 思路：
 *
 * 在选择的时候，由于要构造出最大的矩形。一种暴力的做法是：
 *
 * for (int i = 0; i < N; i++) {
 *     ans = max(ans, A[i]参与构造的最大矩形面积);
 * }
 *
 * 那么在求A[i]参与构造的最大矩形的时候。A[i]左边与右边的值
 * 肯定都要 >= A[i]才可以。
 *
 * 那么也就是说，我们需要找到左边第一个比A[i]小的数, leftPos
 * 也需要找到右边第一个比A[i]小的数。rightPos
 *
 * 那么前面暴力的代码就可以写成：
 *
 * for (int i = 0; i < N; i++) {
 *     leftPos = findLeftSmall(A[i]);
 *     rightPos = findRightSmall(A[i]);
 *     ans = max(ans, A[i] * (rightPos - leftPos - 1));
 * }
 *
 * 而leftPos和rightPos我们都可以先通过单调栈得到。那么到这里，问题就解决了。
 *
 *
 */

//寻找左边第一个比当前小的元素
const findLeftMinItem = function (arr) {
	let stack = []
	let ans = []

	for (var i = arr.length - 1; i >= 0; i--) {
		let cur = arr[i]
		while (stack.length && arr[stack[stack.length - 1]] > cur) {
			const index = stack.pop()
			ans[index] = i
		}
		stack.push(i)
	}

	while (stack.length) {
		const index = stack.pop()
		ans[index] = -1
	}
	return ans
}

const findRightMinItem = function (arr) {
	let stack = []
	let ans = []

	for (var i = 0; i < arr.length; i--) {
		let cur = arr[i]
		while (stack.length && arr[stack[stack.length - 1]] > cur) {
			const index = stack.pop()
			ans[index] = i
		}
		stack.push(i)
	}

	while (stack.length) {
		const index = stack.pop()
		ans[index] = -1
	}
	return ans
}

function maxArea(arr) {
	if (!arr.length) return 0
	let leftArr = findLeftMinItem(arr)
	let rightArr = findRightMinItem(arr)

	let area = 0
	for (var i = 0; i < arr.length; i++) {
		const left = leftArr[i]
		const right = rightArr[i]
		area = Math.max(area, (right - left) * arr[i])
	}
	return area
}
