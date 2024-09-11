// 问题描述
// LYA是一位热爱水果的小猴子。最近,她来到一个果园,发现里面种植了许多串香蕉,这些香蕉串排成一行。每串香蕉上有若干根香蕉,数量不等。

// LYA打算采摘这些香蕉,但有一个规定:每次她只能从行的开头或末尾采摘一串香蕉,并且总共只能采摘
// 𝑁
// N 次。

// LYA想知道,在这个限制下,她最多能采摘到多少根香蕉?

// 输入格式
// 第一行包含一个正整数
// 𝑛
// n,表示香蕉串的数量。

// 第二行包含
// 𝑛
// n 个正整数
// 𝑎
// 1
// ,
// 𝑎
// 2
// ,
// .
// .
// .
// ,
// 𝑎
// 𝑛
// a
// 1
// ​
//  ,a
// 2
// ​
//  ,...,a
// n
// ​
//  ,其中
// 𝑎
// 𝑖
// a
// i
// ​
//   表示第
// 𝑖
// i 串香蕉上的香蕉根数。

// 第三行包含一个正整数
// 𝑁
// N,表示LYA能够采摘的次数。

// 输出格式
// 输出一个正整数,表示LYA最多能采摘到的香蕉根数。

// 样例输入 1
// 7
// 1 2 2 7 3 6 1
// 3

function maxBananas(bananas, N) {
	const n = bananas.length

	// 如果可采摘次数大于或等于香蕉串的数量，直接返回所有香蕉的总和
	if (N >= n) {
		return bananas.reduce((sum, count) => sum + count, 0)
	}

	// 初始化指针和初始和
	let l = N - 1
	let r = n - 1
	let sum = bananas.slice(0, N).reduce((acc, val) => acc + val, 0)
	let res = sum

	// 贪心策略
	while (l >= 0) {
		//左指针还指向数组中
		sum = sum - bananas[l] + bananas[r]
		res = Math.max(res, sum)
		l--
		r--
	}

	return res
}

// 测试
const bananas = [1, 2, 2, 7, 3, 6, 1]
const N = 3
console.log(maxBananas(bananas, N)) // 应输出 10
