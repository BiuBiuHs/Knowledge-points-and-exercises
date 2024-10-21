// https://leetcode.cn/problems/happy-number/description/?envType=study-plan-v2&envId=top-interview-150

// 编写一个算法来判断一个数 n 是不是快乐数。

// 「快乐数」 定义为：

// 对于一个正整数，每一次将该数替换为它每个位置上的数字的平方和。
// 然后重复这个过程直到这个数变为 1，也可能是 无限循环 但始终变不到 1。
// 如果这个过程 结果为 1，那么这个数就是快乐数。
// 如果 n 是 快乐数 就返回 true ；不是，则返回 false 。

// 示例 1：

// 输入：n = 19
// 输出：true
// 解释：
// 12 + 92 = 82
// 82 + 22 = 68
// 62 + 82 = 100
// 12 + 02 + 02 = 1

/**
 * @param {number} n
 * @return {boolean}
 */

function bitSquareSum(num) {
	let sum = 0;
	let cur;
	while (num > 0) {
		//取最后一位
		cur = num % 10;
		sum += cur * cur;
		//除以10 相当于去掉最后一位
		num = Math.floor(num / 10);
	}
	return sum;
}

var isHappy = function (n) {
	let resMap = new Map();
	//最重要的思想其实 是将计算过的结果保存下来
	// 在结果集中寻找是否出现过 计算过的数
	//如果出现过 说明此数字 计算后会出现循环
	//情况1，数字和出现过 但是不等于1 结束循环 返回false
	//情况2  n=1 结束循环 说明是快乐数
	while (n != 1 && !resMap.has(n)) {
		resMap.set(n, n);
		n = bitSquareSum(n);
	}

	//如果出现过 且不等于1 则返回false
	return n == 1;
};
