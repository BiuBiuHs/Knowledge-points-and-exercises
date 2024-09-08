// 程序员小明打了一辆出租车去上班。出于职业敏感，他注意到这辆出租车的计费表有点问题，总是偏大。

// 出租车司机解释说他不喜欢数字4，所以改装了计费表，任何数字位置遇到数字4就直接跳过，其余功能都正常。

// 比如：

// 23再多一块钱就变为25；
// 39再多一块钱变为50；
// 399再多一块钱变为500；
// 小明识破了司机的伎俩，准备利用自己的学识打败司机的阴谋。

// 给出计费表的表面读数，返回实际产生的费用。

// 输入描述
// 只有一行，数字N，表示里程表的读数。

// (1<=N<=888888888)。

// 输出描述
// 一个数字，表示实际产生的费用。以回车结束。

// 用例
// | 输入 | 5 |

// | 输出 | 4 || 说明 | 5表示计费表的表面读数。4表示实际产生的费用其实只有4块钱。 |
/**
 * 将"跳过4"的计费表读数转换为实际费用
 * @param {number} n - 计费表的表面读数
 * @returns {number} - 实际产生的费用
 */
function calculateActualFare(n) {
	let actualFare = 0
	let multiplier = 1

	while (n > 0) {
		let digit = n % 10
		n = Math.floor(n / 10)

		if (digit > 4) {
			digit--
		}

		actualFare += digit * multiplier
		multiplier *= 9
	}

	return actualFare
}

// 测试
console.log(calculateActualFare(5)) // 应输出 4
console.log(calculateActualFare(17)) // 应输出 15
console.log(calculateActualFare(100)) // 应输出 81
