// 在学校中，N个小朋友站成一队， 第i个小朋友的身高为height[i]，

// 第i个小朋友可以看到的第一个比自己身高更高的小朋友j，那么j是i的好朋友(要求j > i)。

// 请重新生成一个列表，对应位置的输出是每个小朋友的好朋友位置，如果没有看到好朋友，请在该位置用0代替。

// 小朋友人数范围是 [0, 40000]。

// 输入描述
// 第一行输入N，N表示有N个小朋友

// 第二行输入N个小朋友的身高height[i]，都是整数

// 输出描述
// 输出N个小朋友的好朋友的位置

// 用例1
// 输入

// 2
// 100 95

// 由于有方向 ，此时输入的方向是从队尾到队首，也是就是说 方向是右侧
//于是此题目可以转化为 右边第一个比当前元素大的元素的下标

function findFirstFriend(heights) {
	const n = heights.length
	const stack = []
	let res = new Array(n).fill(0)
	for (var i = n - 1; i >= 0; i--) {
		const cur = heights[i]
		while (stack.length && heights[stack[stack.length - 1]] < cur) {
			//如果队列不是从1 开始则可以 给res赋值为下标index
			res[stack.pop()] = i + 1 //使用从1 开始的索引值
		}

		stack.push(i)
	}
	return res
}
