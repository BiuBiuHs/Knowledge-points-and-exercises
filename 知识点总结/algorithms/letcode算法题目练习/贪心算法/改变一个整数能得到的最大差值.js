// https://leetcode.cn/problems/max-difference-you-can-get-from-changing-an-integer/description/?envType=daily-question&envId=2025-07-20
// 给你一个整数 num 。你可以对它进行以下步骤共计 两次：

// 选择一个数字 x (0 <= x <= 9).
// 选择另一个数字 y (0 <= y <= 9) 。数字 y 可以等于 x 。
// 将 num 中所有出现 x 的数位都用 y 替换。
// 令两次对 num 的操作得到的结果分别为 a 和 b 。

// 请你返回 a 和 b 的 最大差值 。

// 注意，a 和 b 必须不能 含有前导 0，并且 不为 0。

// 示例 1：

// 输入：num = 555
// 输出：888
// 解释：第一次选择 x = 5 且 y = 9 ，并把得到的新数字保存在 a 中。
// 第二次选择 x = 5 且 y = 1 ，并把得到的新数字保存在 b 中。
// 现在，我们有 a = 999 和 b = 111 ，最大差值为 888
// 示例 2：

// 输入：num = 9
// 输出：8
// 解释：第一次选择 x = 9 且 y = 9 ，并把得到的新数字保存在 a 中。
// 第二次选择 x = 9 且 y = 1 ，并把得到的新数字保存在 b 中。
// 现在，我们有 a = 9 和 b = 1 ，最大差值为 8
// 示例 3：

// 输入：num = 123456
// 输出：820000
// 示例 4：

// 输入：num = 10000
// 输出：80000
// 示例 5：

// 输入：num = 9288
// 输出：8700

// 提示：

// 1 <= num <= 10^8
function maxDiff(num) {
	let replace = (str, x, y) => str.split(x).join(y);

	let max = num.toString();
	let min = num.toString();

	for (var curStr of max) {
		if (curStr !== "9") {
			max = replace(max, curStr, "9");
			break;
		}
	}

	for (var i = 0; i < min.length; i++) {
		let curStr = min[i];
		if (i == 0) {
			//第一位不为1 则将与第一位相同的 替换为1 就是最小的数字
			if (curStr !== "1") {
				min = replace(min, curStr, "1");
				break;
			}
		} else {
			//第一位为1，那么就只能替换第二高位 ，且不等于1的数字 替换为0
			if (curStr !== "0" && curStr !== min[0]) {
				min = replace(min, curStr, "0");
				break;
			}
		}
	}

	return parseInt(max) - parseInt(min);
}
