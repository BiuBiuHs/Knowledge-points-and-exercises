// https://leetcode.cn/problems/valid-anagram/description/?envType=study-plan-v2&envId=top-interview-150
// 给定两个字符串 s 和 t ，编写一个函数来判断 t 是否是 s 的
// 字母异位词
// 。

// 示例 1:

// 输入: s = "anagram", t = "nagaram"
// 输出: true
// 示例 2:

// 输入: s = "rat", t = "car"
// 输出: false

// 提示:

// 1 <= s.length, t.length <= 5 * 104
// s 和 t 仅包含小写字母

/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isAnagram = function (s, t) {
	let wordArr = new Array(26).fill(0);
	for (var i = 0; i < s.length; i++) {
		//用当前字母的unicode码 减去a字母的unicode码 来当作下标的index 来记录每个字母的出现次数
		wordArr[s.charCodeAt(i) - "a".charCodeAt(0)]++;
	}
	for (var i = 0; i < t.length; i++) {
		wordArr[t.charCodeAt(i) - "a".charCodeAt(0)]--;
		if (wordArr[t.charCodeAt(i) - "a".charCodeAt(0)] < 0) return false;
	}

	return true;
};
