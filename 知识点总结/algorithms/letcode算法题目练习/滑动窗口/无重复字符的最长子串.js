/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
	let ans = 0;
	let strMap = new Map();
	//这里设置为-1 可以解决只有一个字符或者一个空字符的特殊 case
	let left = -1;

	for (var i = 0; i < s.length; i++) {
		// 检查当前字符是否在之前出现过，并更新左边界
		if (strMap.get(s[i]) > left) {
			left = strMap.get(s[i]);
		}
		// 更新字符最后出现的位置
		strMap.set(s[i], i);
		// 计算当前无重复字符子串的长度，并更新最大长度
		ans = Math.max(i - left, ans);
	}
	// 返回最长无重复字符子串的长度
	return ans;
};
