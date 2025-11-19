/**
 * 17. 电话号码的字母组合
 * https://leetcode.cn/problems/letter-combinations-of-a-phone-number/
 *
 * 题目：给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。
 *
 * 示例：
 * 输入：digits = "23"
 * 输出：["ad","ae","af","bd","be","bf","cd","ce","cf"]
 *
 * 说明：
 * 数字到字母的映射如下（与电话按键相同）：
 * 2: abc, 3: def, 4: ghi, 5: jkl, 6: mno, 7: pqrs, 8: tuv, 9: wxyz
 */

/**
 * 方法1：回溯模板（推荐：使用新字符串）
 */
function letterCombinations(digits) {
	// TODO: 实现回溯算法
	if (digits.length === 0) return [];

	const map = {
		2: "abc",
		3: "def",
		4: "ghi",
		5: "jkl",
		6: "mno",
		7: "pqrs",
		8: "tuv",
		9: "wxyz",
	};

	let res = [];

	function backtrack(curStr, index) {
		// 1. 终止条件：索引达到字符串长度
		if (index === digits.length) {
			res.push(curStr);
		}

		// 2. 选择循环：遍历当前数字对应的所有字母
		let letters = map[digits[index]];
		for (var item of letters) {
			backtrack(curStr + item, index + 1);
		}

		// 3. 递归：使用新字符串（不需要回溯）
	}

	backtrack("", 0);
	return res;
}

// 测试
console.log("=== 电话号码字母组合问题 ===");
console.log("输入：digits = '23'");
console.log("输出：", letterCombinations("23"));
console.log("期望：['ad','ae','af','bd','be','bf','cd','ce','cf']");

/**
 * ============================================
 * 参考答案
 * ============================================
 */
function letterCombinationsAnswer(digits) {
	if (digits.length === 0) return [];

	const map = {
		2: "abc",
		3: "def",
		4: "ghi",
		5: "jkl",
		6: "mno",
		7: "pqrs",
		8: "tuv",
		9: "wxyz",
	};

	let res = [];

	function backtrack(curStr, index) {
		// 1. 终止条件：索引达到字符串长度
		if (index === digits.length) {
			res.push(curStr);
			return;
		}

		// 2. 选择循环：遍历当前数字对应的所有字母
		const letters = map[digits[index]];
		for (let letter of letters) {
			// 3. 递归：使用新字符串，不需要回溯
			backtrack(curStr + letter, index + 1);
		}
	}

	backtrack("", 0);
	return res;
}

/**
 * 方法2：使用数组（需要回溯）
 */
function letterCombinationsAnswer2(digits) {
	if (digits.length === 0) return [];

	const map = {
		2: "abc",
		3: "def",
		4: "ghi",
		5: "jkl",
		6: "mno",
		7: "pqrs",
		8: "tuv",
		9: "wxyz",
	};

	let res = [];
	let path = [];

	function backtrack(index) {
		if (index === digits.length) {
			res.push(path.join(""));
			return;
		}

		const letters = map[digits[index]];
		for (let letter of letters) {
			path.push(letter);
			backtrack(index + 1);
			path.pop(); // 回溯
		}
	}

	backtrack(0);
	return res;
}
