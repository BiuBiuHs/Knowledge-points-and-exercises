/**

* @description 单词拆分：判断字符串s能否被拆分为字典wordDict中的单词（可重复使用）
* @param {string} s  需要拆分的目标字符串
* @param {string[]} wordDict  单词字典数组
* @returns {boolean}  能否拆分的布尔结果
 */
//递归解决
var wordBreak = function (s, wordDict) {
	// 1. 计算字典中单词的【最大长度】- 核心剪枝优化：只需要往前找maxLen个字符，更长的子串一定不在字典里
	const maxWordLen = Math.max(...wordDict.map((word) => word.length));
	// 2. 字典转Set集合 - 查询效率优化：数组includes是O(n)，Set的has是O(1)，大数据量差距极大
	const wordSet = new Set(wordDict);
	// 3. 记忆化缓存数组：memo[i] 存储 字符串前i个字符能否被拆分的结果(true/false)
	// 数组长度s.length+1，对应dfs(0)~dfs(s.length)，初始值undefined代表未计算过
	const memo = new Array(s.length + 1);

	/**
	 * 核心递归函数：自顶向下深度优先搜索
	 * @param {number} i  递归状态，表示「判断字符串s的前i个字符 s[0...i-1] 能否被成功拆分」
	 * @returns {boolean} 当前状态的拆分结果
	 */
	const dfs = function (i) {
		// ===== 递归终止条件【成功的终点】=====
		// i=0 代表字符串的前0个字符，即空字符串，空串天然可以被拆分，返回true作为递归的锚点
		if (i === 0) {
			return true;
		}

		// ===== 记忆化缓存命中【核心优化】=====
		// 如果当前状态计算过，直接返回缓存结果，避免重复递归计算，解决重叠子问题
		if (memo[i] !== undefined) {
			return memo[i];
		}

		// ===== 核心循环：从i向前找有效分割点j =====
		// j的范围：从i-1 往前遍历 到 Math.max(i - maxWordLen, 0)
		// 1. Math.max(...,0) 防止j出现负数，保证下标合法
		// 2. 只遍历maxWordLen个字符，是剪枝，超出的子串一定不在字典里，无需判断
		for (let j = i - 1; j >= Math.max(i - maxWordLen, 0); j--) {
			// ===== 核心判断逻辑：拆分的核心规则 =====
			// 1. s.slice(j, i)：截取字符串 j到i的部分（左闭右开），即 s[j] ~ s[i-1]
			// 2. wordSet.has(...)：判断这个子串是否是字典里的单词
			// 3. dfs(j)：递归判断「字符串的前j个字符」能否被拆分
			// 两个条件同时满足 → 前i个字符可以被拆分！
			if (wordSet.has(s.slice(j, i)) && dfs(j)) {
				// 记忆化存储结果+返回，一行完成2件事：把true存入memo[i]，再返回true
				// 执行这个return → 立刻终止当前循环 + 立刻终止当前dfs函数，回溯到上一层
				return (memo[i] = true);
			}
		}

		// ===== 兜底逻辑 =====
		// 所有分割点j都遍历完，没有找到符合条件的拆分方式 → 前i个字符无法拆分
		// 记忆化存储结果+返回，存入false并返回false
		return (memo[i] = false);
	};

	// 最终调用：判断「字符串的前s.length个字符」→ 也就是整个字符串能否被拆分，返回结果
	return dfs(s.length);
};

/**
 * @description 单词拆分：动态规划版本【无递归，新手友好，最易理解】
 * @param {string} s  需要拆分的目标字符串
 * @param {string[]} wordDict  单词字典数组
 * @returns {boolean}  能否拆分的布尔结果
 */
var wordBreak = function (s, wordDict) {
	// 字符串长度
	const strLen = s.length;
	// 1. 字典转Set，提升查询效率 O(1)
	const wordSet = new Set(wordDict);
	// 2. 计算字典中单词的最大长度，剪枝优化
	const maxWordLen = Math.max(...wordDict.map((word) => word.length));

	// 3. 定义dp数组：动态规划的核心状态
	// dp[i] 表示：字符串s的「前i个字符」s[0...i-1] 能否被拆分为字典中的单词
	const dp = new Array(strLen + 1).fill(false);
	// 4. 初始化dp[0] = true：空字符串天然可以被拆分，作为所有有效拆分的起点【必须初始化】
	dp[0] = true;

	// 5. 遍历：从1到字符串末尾，逐个判断前i个字符能否拆分
	for (let i = 1; i <= strLen; i++) {
		// 6. 内层循环：从i往前找有效分割点j，剪枝只找maxWordLen个字符
		// j的下限：Math.max(i - maxWordLen, 0)，防止下标越界
		for (let j = Math.max(i - maxWordLen, 0); j < i; j++) {
			// 核心判断：dp[j]为true 且 子串s[j,i)在字典中 → dp[i]为true
			// dp[j] = true 说明「前j个字符能拆分」，拼接上「j到i的合法单词」，则前i个字符一定能拆分
			if (dp[j] && wordSet.has(s.slice(j, i))) {
				dp[i] = true;
				// 找到一个合法拆分方式即可，无需继续遍历j，直接跳出内层循环
				break;
			}
		}
	}

	// 最终结果：dp[strLen] 表示整个字符串能否被拆分
	return dp[strLen];
};
