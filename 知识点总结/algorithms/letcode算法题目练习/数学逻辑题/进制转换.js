// 相关企业
// 给定一个整数 num，将其转化为 7 进制，并以字符串形式输出。

/*
 * @param {number} num
 * @return {string}
 */
var convertToBase7 = function (num) {
	if (num === 0) return '0'

	let isNegative = num < 0
	num = Math.abs(num)

	let result = ''
	while (num > 0) {
		//要转换为几进制 就除谁 取余 放在结果的第一位
		result = (num % 7) + result
		//将剩余的值再除改进制 赋值给num
		num = Math.floor(num / 7)
	}

	return isNegative ? '-' + result : result
}
