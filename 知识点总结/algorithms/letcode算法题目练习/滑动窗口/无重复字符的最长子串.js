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

		// strMap.get(s[i]) 会返回当前字符 s[i] 在 Map 中的值。如果 s[i] 不存在于 Map 中，get 方法会返回 undefined。
		// 由于 undefined 在与数字比较时会被转换为 NaN，而 NaN 与任何数比较都会返回 false，
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
