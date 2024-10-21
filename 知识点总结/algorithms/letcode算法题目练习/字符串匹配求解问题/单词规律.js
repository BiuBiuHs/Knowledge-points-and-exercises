// 给定一种规律 pattern 和一个字符串 s ，判断 s 是否遵循相同的规律。

//单词规律
// 这里的 遵循 指完全匹配，例如， pattern 里的每个字母和字符串 s 中的每个非空单词之间存在着双向连接的对应规律。

// 示例1:

// 输入: pattern = "abba", s = "dog cat cat dog"
// 输出: true
// 示例 2:

// 输入:pattern = "abba", s = "dog cat cat fish"
// 输出: false
// 示例 3:

// 输入: pattern = "aaaa", s = "dog cat cat dog"
// 输出: false

/**
 * @param {string} pattern
 * @param {string} s
 * @return {boolean}
 */
var wordPattern = function (pattern, s) {
	const left = new Map();
	const right = new Map();
	let wordArr = s.split(" ");
	if (pattern.length !== wordArr.length) return false;
	for (var i = 0; i < pattern.length; i++) {
		const x = pattern[i];
		const y = wordArr[i];
		if (
			(left.has(x) && left.get(x) !== y) ||
			(right.has(y) && right.get(y) !== x)
		)
			return false;
		left.set(x, y);
		right.set(y, x);
	}
	return true;
};
