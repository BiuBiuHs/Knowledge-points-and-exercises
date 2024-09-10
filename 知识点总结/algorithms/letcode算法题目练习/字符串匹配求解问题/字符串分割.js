// 给定一个非空字符串S，其被N个'-分隔成 N+1的子串，给定正整数K，要求除第一个子串外，其余的子串每K个字符组成新的子串，并用-分隔。对于新组成的每一个子串，如果它含有的小写字母比大写字母多，则将这个子串的所有大写字母转换为小写字母;反之，如果它含有的大写字母比小写字母多，则将这个子串的所有小写字母转换为大写字母;大小写字母的数量相等时，不做转换。

// 输入描述

// 输入为两行，第一行为参数K，第二行为字符串 S。

// 输出描述

// 输出转换后的字符串。

// 示例1

// 输入

// 3

// 12abc-abCABc-4aB@

// 输出

// 12abc-abc-ABC-4aB-@

// 说明:子串为12abc、abCABc、4aB@，第一个子串保留，后面的子串每3个字符一组为abC、 ABc、4aB、@，abC中小写字母较多，转换为abc，ABc中大写字母较多，转换为ABC，4aB中大小写字母都为1个，不做转换，@中没有字母，连起来即12abc-abc-ABC-4aB-@

function processString(K, S) {
	// 分割字符串
	const parts = S.split('-')

	// 处理第一个子串之后的所有子串
	const processedParts = [parts[0]].concat(
		parts.slice(1).map((part) => {
			// 每K个字符分组
			const groups = []
			for (let i = 0; i < part.length; i += K) {
				groups.push(part.slice(i, i + K))
			}

			// 处理每个分组
			return groups
				.map((group) => {
					let lowerCount = 0,
						upperCount = 0
					for (let char of group) {
						if (char >= 'a' && char <= 'z') lowerCount++
						else if (char >= 'A' && char <= 'Z') upperCount++
					}

					// 转换大小写
					if (lowerCount > upperCount) {
						return group.toLowerCase()
					} else if (upperCount > lowerCount) {
						return group.toUpperCase()
					} else {
						return group
					}
				})
				.join('-')
		})
	)

	// 用'-'连接所有处理后的子串
	return processedParts.join('-')
}

processString(3, '12abc-abCABc-4aB@')

// 处理输入
const readline = require('readline')
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

let K
rl.on('line', (line) => {
	if (!K) {
		K = parseInt(line)
	} else {
		console.log(processString(K, line))
		rl.close()
	}
})
