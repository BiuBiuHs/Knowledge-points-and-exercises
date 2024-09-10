// 火星人字符串表达式（结尾不带回车换行）

// 输入的字符串说明： 字符串为仅由无符号整数和操作符（#、$）组成的计算表达式。例如：

// 123#4$5#67$78

// 用例保证字符串中，操作数与操作符之间没有任何分隔符。

// 用例保证操作数取值范围为32位无符号整数。

// 保证输入以及计算结果不会出现整型溢出。

// 保证输入的字符串为合法的求值报文，例如：123#4$5#67$78

// 保证不会出现非法的求值报文，例如类似这样字符串：

// #4$5 //缺少操作数

// 4$5# //缺少操作数

// 4#$5 //缺少操作数

// 4 $5 //有空格

// 3+4-5*6/7 //有其它操作符

// 12345678987654321$54321 //32位整数计算溢出

// 输出描述
// 根据输入的火星人字符串输出计算结果（结尾不带回车换行）

// 用例
// 输入

// 7#6$5#12
// 输出

// 157
// 说明

// > =(4*7+3*6+2)$5#12
// > =48$5#12
// > =48$(4*5+3*12+2)
// > =48$58
// > =2*48+58+3
// > =157

function calculateMarsExpression(expression) {
	const stack = []
	let currentNumber = 0

	function calculate(x, y, op) {
		if (op === '#') {
			return 4 * x + 3 * y + 2
		} else if (op === '$') {
			return 2 * x + y + 3
		}
	}

	for (let i = 0; i < expression.length; i++) {
		if (expression[i] === '#' || expression[i] === '$') {
			if (expression[i] === '#') {
				// 如果是 '#' 操作，立即计算
				let nextNumber = 0
				i++
				while (
					i < expression.length &&
					expression[i] !== '#' &&
					expression[i] !== '$'
				) {
					nextNumber = nextNumber * 10 + parseInt(expression[i])
					i++
				}
				i-- // 回退一步，因为外层循环会 i++
				currentNumber = calculate(currentNumber, nextNumber, '#')
			} else {
				// 如果是 '$' 操作，将当前数字和 '$' 压入栈
				stack.push(currentNumber)
				stack.push('$')
				currentNumber = 0
			}
		} else {
			currentNumber = currentNumber * 10 + parseInt(expression[i])
		}
	}

	// 处理最后一个数字
	stack.push(currentNumber)

	// 从左到右计算所有的 '$' 操作
	while (stack.length > 1) {
		let x = stack.shift()
		let op = stack.shift()
		let y = stack.shift()
		stack.unshift(calculate(x, y, op))
	}

	return stack[0]
}

calculateMarsExpression('7#6$5#12')

// 读取输入并计算结果
const readline = require('readline')
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

rl.on('line', (line) => {
	console.log(calculateMarsExpression(line))
	rl.close()
})
