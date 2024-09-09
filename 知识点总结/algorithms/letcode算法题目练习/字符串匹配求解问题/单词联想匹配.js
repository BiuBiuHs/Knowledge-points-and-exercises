// 主管期望你来实现英文输入法单词联想功能。需求如下：依据用户输入的单词前缀，从已输入的英文语句中联想出用户想输入的单词，按字典序输出联想到的单词序列，如果联想不到，请输出用户输入的单词前缀。

// 注意：英文单词联想时，区分大小写，缩略形式如”don’t”，判定为两个单词，”don”和”t”，输出的单词序列，不能有重复单词，且只能是英文单词，不能有标点符号

// 输入描述

// 输入为两行。

// 首行输入一段由英文单词word和标点符号组成的语句str；

// 接下来一行为一个英文单词前缀pre。

// 0 < word.length() <= 20

// 0 < str.length <= 10000

// 0 < pre <= 20

// 输出描述

// 输出符合要求的单词序列或单词前缀，存在多个时，单词之间以单个空格分割

// 用例1

// 输入

// I love you

// He

// 输出

// He

// 说明：从用户已输入英文语句”I love you”中提炼出“I”、“love”、“you”三个单词，接下来用户输入“He”，

// 从已输入信息中无法联想到任何符合要求的单词，因此输出用户输入的单词前缀。

// 用例2

// 输入

// The furthest distance in the world, Is not between life and death, But when I stand in front of you, Yet you don't know that I love you.

// f

// 输出

// front furthest

/**
 * 实现英文输入法单词联想功能
 * @param {string} sentence - 输入的英文语句
 * @param {string} prefix - 用户输入的单词前缀
 * @returns {string} - 联想到的单词序列或输入的前缀
 */
function wordSuggestion(sentence, prefix) {
	// 提取单词并去重
	const words = [...new Set(sentence.match(/[a-zA-Z]+/g))]

	// 过滤出以给定前缀开头的单词
	const suggestions = words.filter((word) => word.startsWith(prefix))

	// 如果有匹配的单词，按字典序排序并返回
	if (suggestions.length > 0) {
		return suggestions.sort().join(' ')
	}

	// 如果没有匹配的单词，返回输入的前缀
	return prefix
}

// 处理输入
const readline = require('readline')
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

let sentence = ''
let prefix = ''
let lineCount = 0

rl.on('line', (line) => {
	if (lineCount === 0) {
		sentence = line
	} else {
		prefix = line
		console.log(wordSuggestion(sentence, prefix))
		rl.close()
	}
	lineCount++
})
