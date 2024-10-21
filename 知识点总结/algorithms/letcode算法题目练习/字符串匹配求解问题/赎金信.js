// https://leetcode.cn/problems/ransom-note/?envType=study-plan-v2&envId=top-interview-150

// 给你两个字符串：ransomNote 和 magazine ，判断 ransomNote 能不能由 magazine 里面的字符构成。

// 如果可以，返回 true ；否则返回 false 。

// magazine 中的每个字符只能在 ransomNote 中使用一次。

// 示例 1：

// 输入：ransomNote = "a", magazine = "b"
// 输出：false
// 示例 2：

// 输入：ransomNote = "aa", magazine = "ab"
// 输出：false
// 示例 3：

// 输入：ransomNote = "aa", magazine = "aab"
// 输出：true

// 提示：

// 1 <= ransomNote.length, magazine.length <= 105
// ransomNote 和 magazine 由小写英文字母组成

function letter(ransomNote, magazine) {
	const strMap = {};
	for (var i = 0; i < magazine.length; i++) {
		strMap[magazine[i]] = (strMap[magazine[i]] || 0) + 1;
	}

	for (var i = 0; i < ransomNote.length; i++) {
		//这里如果某一个字符 减少到0 则说明 magazine中的字母已经使用完了
		//!0 为true 说明ransomNote 中的某一种字符不再magazine中出现 或者出现次数多余magazine中的字符出现次数。
		if (!strMap[ransomNote[i]]) return false;
	}

	return true;
}
