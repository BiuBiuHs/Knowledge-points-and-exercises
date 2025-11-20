/**
 * 131. 分割回文串
 * https://leetcode.cn/problems/palindrome-partitioning/
 *
 * 题目：给你一个字符串 s，请你将 s 分割成一些子串，使每个子串都是回文串。
 * 返回 s 所有可能的分割方案。
 *
 * 示例：
 * 输入：s = "aab"
 * 输出：[["a","a","b"],["aa","b"]]
 *
 * 输入：s = "a"
 * 输出：[["a"]]
 *
 * 提示：
 * - 1 <= s.length <= 16
 * - s 仅由小写英文字母组成
 */

/**
 * 方法1：回溯模板
 *
 * 核心思想：
 * 1. 对于字符串 s，从 startIndex 开始，尝试所有可能的分割点
 * 2. 如果 s[startIndex...i] 是回文串，则将其加入路径
 * 3. 继续递归处理剩余部分 s[i+1...]
 * 4. 回溯时撤销选择
 */
var partition = function (s) {
	let res = [];

	/**
	 * 判断字符串的某个子串是否是回文串
	 * @param {string} str - 原字符串
	 * @param {number} start - 起始位置（包含）
	 * @param {number} end - 结束位置（包含）
	 * @return {boolean} 是否是回文串
	 */
	function isPString(str, start, end) {
		let left = start;
		let right = end;

		// 双指针从两端向中间移动，判断是否对称
		while (left < right) {
			if (str[left] !== str[right]) {
				return false;
			}
			left++;
			right--;
		}
		return true;
	}

	/**
	 * 回溯函数
	 * @param {number} startIndex - 当前开始分割的位置
	 * @param {string[]} tempArr - 当前已分割的回文串数组
	 */
	function backtrack(startIndex, tempArr) {
		// 1. 终止条件：已经分割完整个字符串
		if (startIndex >= s.length) {
			// 保存当前分割方案（使用副本，避免引用问题）
			res.push([...tempArr]);
			return;
		}

		// 2. 选择循环：尝试所有可能的分割点
		// 从 startIndex 开始，到字符串末尾
		for (var i = startIndex; i < s.length; i++) {
			// 3. 处理节点：判断 s[startIndex...i] 是否是回文串
			if (isPString(s, startIndex, i)) {
				// 如果是回文串，将其加入当前路径
				// s.slice(startIndex, i + 1) 获取子串（i+1 因为 slice 不包含结束位置）
				tempArr.push(s.slice(startIndex, i + 1));
			} else {
				// 如果不是回文串，跳过这个分割点，尝试下一个
				continue;
			}

			// 4. 递归：继续分割剩余部分 s[i+1...]
			// 注意：从 i+1 开始，因为 i 位置已经包含在当前回文串中
			backtrack(i + 1, tempArr);

			// 5. 回溯：撤销刚才的选择，尝试其他分割点
			tempArr.pop();
		}
	}

	// 从索引 0 开始回溯
	backtrack(0, []);
	return res;
};

// 测试
console.log("=== 分割回文串问题 ===");
console.log("输入：s = 'aab'");
console.log("输出：", partition("aab"));
console.log("期望：[['a','a','b'],['aa','b']]");

console.log("\n输入：s = 'a'");
console.log("输出：", partition("a"));
console.log("期望：[['a']]");

/**
 * ============================================
 * 算法执行过程详解（以 s = "aab" 为例）
 * ============================================
 *
 * 回溯树状图：
 *
 *                   开始 []
 *                    /  |  \
 *                  /    |    \
 *                /      |      \
 *           分割"a"   分割"aa"  分割"aab"
 *            /          |          \
 *          [a]        [aa]       [aab] ❌ (不是回文)
 *         /  \          |
 *    分割"a" 分割"ab"  分割"b"
 *     /        \        |
 *  [a,a]    [a,ab]❌  [aa,b]
 *    |
 * 分割"b"
 *    |
 * [a,a,b] ✅
 *
 *
 * 详细执行流程：
 *
 * backtrack(0, [])
 *   startIndex = 0
 *   循环 i=0: s[0...0] = "a"
 *     isPString("aab", 0, 0) → true ✅
 *     tempArr.push("a") → tempArr = ["a"]
 *     backtrack(1, ["a"])
 *       startIndex = 1
 *       循环 i=1: s[1...1] = "a"
 *         isPString("aab", 1, 1) → true ✅
 *         tempArr.push("a") → tempArr = ["a", "a"]
 *         backtrack(2, ["a", "a"])
 *           startIndex = 2
 *           循环 i=2: s[2...2] = "b"
 *             isPString("aab", 2, 2) → true ✅
 *             tempArr.push("b") → tempArr = ["a", "a", "b"]
 *             backtrack(3, ["a", "a", "b"])
 *               startIndex = 3 >= s.length ✅
 *               保存 ["a", "a", "b"] ✅
 *               返回
 *             tempArr.pop() → tempArr = ["a", "a"]
 *           循环结束
 *           返回
 *         tempArr.pop() → tempArr = ["a"]
 *       循环 i=2: s[1...2] = "ab"
 *         isPString("aab", 1, 2) → false ❌
 *         continue（跳过）
 *       循环结束
 *       返回
 *     tempArr.pop() → tempArr = []
 *   循环 i=1: s[0...1] = "aa"
 *     isPString("aab", 0, 1) → true ✅
 *     tempArr.push("aa") → tempArr = ["aa"]
 *     backtrack(2, ["aa"])
 *       startIndex = 2
 *       循环 i=2: s[2...2] = "b"
 *         isPString("aab", 2, 2) → true ✅
 *         tempArr.push("b") → tempArr = ["aa", "b"]
 *         backtrack(3, ["aa", "b"])
 *           startIndex = 3 >= s.length ✅
 *           保存 ["aa", "b"] ✅
 *           返回
 *         tempArr.pop() → tempArr = ["aa"]
 *       循环结束
 *       返回
 *     tempArr.pop() → tempArr = []
 *   循环 i=2: s[0...2] = "aab"
 *     isPString("aab", 0, 2) → false ❌
 *     continue（跳过）
 *   循环结束
 *   返回
 *
 * 最终结果：[["a","a","b"],["aa","b"]]
 */

/**
 * ============================================
 * 优化版本：预处理回文串（动态规划）
 * ============================================
 *
 * 使用动态规划预处理所有子串是否是回文串
 * 时间复杂度：O(n^2) 预处理 + O(2^n) 回溯
 * 空间复杂度：O(n^2)
 */
var partitionOptimized = function (s) {
	let res = [];
	let n = s.length;

	// 1. 预处理：使用动态规划判断所有子串是否是回文串
	// dp[i][j] 表示 s[i...j] 是否是回文串
	let dp = new Array(n).fill(0).map(() => new Array(n).fill(false));

	// 初始化：单个字符都是回文串
	for (let i = 0; i < n; i++) {
		dp[i][i] = true;
	}

	// 填充 dp 数组
	// 从下往上，从左往右填充
	for (let i = n - 1; i >= 0; i--) {
		for (let j = i + 1; j < n; j++) {
			if (s[i] === s[j]) {
				// 如果两端字符相同
				if (j - i === 1 || dp[i + 1][j - 1]) {
					// 如果长度是2，或者中间部分是回文串
					dp[i][j] = true;
				}
			}
		}
	}

	/**
	 * 回溯函数（使用预处理的 dp 数组）
	 */
	function backtrack(startIndex, tempArr) {
		if (startIndex >= s.length) {
			res.push([...tempArr]);
			return;
		}

		for (let i = startIndex; i < s.length; i++) {
			// 直接使用 dp 数组判断，O(1) 时间复杂度
			if (dp[startIndex][i]) {
				tempArr.push(s.slice(startIndex, i + 1));
				backtrack(i + 1, tempArr);
				tempArr.pop();
			}
		}
	}

	backtrack(0, []);
	return res;
};

/**
 * ============================================
 * 关键理解点
 * ============================================
 *
 * 1. 为什么需要回溯？
 *    因为要尝试所有可能的分割方案
 *    例如："aab" 可以分割为 ["a","a","b"] 或 ["aa","b"]
 *    需要尝试所有可能，所以需要回溯
 *
 * 2. 为什么从 i+1 开始递归？
 *    因为 s[startIndex...i] 已经被加入路径
 *    剩余部分从 i+1 开始继续分割
 *
 * 3. 为什么需要判断回文串？
 *    题目要求每个子串都是回文串
 *    只有回文串才能加入路径
 *
 * 4. 时间复杂度分析：
 *    - 判断回文串：O(n) 每个子串
 *    - 回溯：O(2^n) 最坏情况
 *    - 总时间：O(n × 2^n)
 *
 * 5. 空间复杂度分析：
 *    - 递归深度：O(n)
 *    - 路径存储：O(n)
 *    - 结果存储：O(2^n × n)
 *
 * 6. 优化思路：
 *    - 使用动态规划预处理回文串判断
 *    - 将判断回文串的时间从 O(n) 降到 O(1)
 *    - 但回溯的时间复杂度仍然是 O(2^n)
 */

/**
 * ============================================
 * 与其他回溯问题的对比
 * ============================================
 *
 * 1. 与子集问题的区别：
 *    - 子集问题：每个节点都是结果
 *    - 分割问题：只有完整分割才是结果
 *
 * 2. 与组合问题的区别：
 *    - 组合问题：选择 k 个元素
 *    - 分割问题：必须分割完整个字符串
 *
 * 3. 与全排列问题的区别：
 *    - 全排列问题：顺序重要，需要标记已使用
 *    - 分割问题：顺序固定，不需要标记
 *
 * 4. 共同点：
 *    - 都需要回溯
 *    - 都需要终止条件
 *    - 都需要选择循环
 */
