// 给定字符串 s 和字符串数组 words, 返回  words[i] 中是s的子序列的单词个数 。

// 字符串的 子序列 是从原始字符串中生成的新字符串，可以从中删去一些字符(可以是none)，而不改变其余字符的相对顺序。

// 例如， “ace” 是 “abcde” 的子序列。

//可以通过的算法
/**
 * @param {string} s
 * @param {string[]} words
 * @return {number}
 */
var numMatchingSubseq = function (s, words) {
	return words.reduce((acc, w) => acc + isSubSeq(w), 0)

	function isSubSeq(w) {
		let p = 0 //单词的index指针
		let cur = 0
		while (p < w.length) {
			//代表着此时 从哪个下标作为start 进行匹配
			cur = s.indexOf(w[p], cur)
			//如果以cur为匹配起点 匹配单词中第p位的字母 未找到则说明此单词不是字符串s的子串。
			if (cur === -1) return 0
			cur++
			p++
		}
		return 1
	}
}

//暴力匹配 会超时空

/**
 * @param {string} s
 * @param {string[]} words
 * @return {number}
 */
var numMatchingSubseq = function (s, words) {
	let resCount = 0
	for (var wordItem of words) {
		let wordCount = 0
		for (var i = 0; i < s.length; i++) {
			if (wordItem[wordCount] === s[i] && wordCount < wordItem.length) {
				wordCount++
			}
		}
		if (wordCount == wordItem.length) {
			resCount++
		}
	}
	return resCount
}
