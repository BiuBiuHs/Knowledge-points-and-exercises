/**
 * 47. 全排列 II
 * https://leetcode.cn/problems/permutations-ii/
 *
 * 题目：给定一个可包含重复数字的序列 nums，按任意顺序返回所有不重复的全排列。
 *
 * 示例：
 * 输入：nums = [1,1,2]
 * 输出：[[1,1,2],[1,2,1],[2,1,1]]
 *
 * 输入：nums = [1,2,3]
 * 输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
 *
 * 提示：
 * - 1 <= nums.length <= 8
 * - -10 <= nums[i] <= 10
 */

/**
 * 方法1：回溯模板 + 去重剪枝
 *
 * 核心思想：
 * 1. 先排序，让相同元素相邻
 * 2. 使用 used 数组标记已使用的元素
 * 3. 关键剪枝：如果当前元素与前一个元素相同，且前一个元素未被使用，则跳过
 *    - 这确保了相同元素的相对顺序，避免重复排列
 */
var permuteUnique = function (nums) {
	// 1. 先排序，让相同元素相邻（关键步骤！）
	nums.sort((a, b) => {
		return a - b;
	});

	let result = [];
	let path = [];

	/**
	 * 回溯函数
	 * @param {boolean[]} used - 标记数组，used[i] 表示 nums[i] 是否已被使用
	 */
	function backtracing(used) {
		// 2. 终止条件：路径长度等于数组长度
		if (path.length === nums.length) {
			// 保存当前排列（使用副本，避免引用问题）
			result.push([...path]);
			return;
		}

		// 3. 选择循环：遍历所有元素
		for (let i = 0; i < nums.length; i++) {
			// 4. 关键剪枝：跳过重复元素
			// 条件：i > 0 && nums[i] === nums[i - 1] && !used[i - 1]
			//
			// 解释：
			// - i > 0：确保不是第一个元素
			// - nums[i] === nums[i - 1]：当前元素与前一个元素相同
			// - !used[i - 1]：前一个相同元素未被使用（在同一层）
			//
			// 为什么 !used[i - 1] 能去重？
			// 如果前一个相同元素未被使用，说明我们在同一层（同一位置）尝试了相同的值
			// 这会导致重复排列，所以跳过
			//
			// 例如：[1, 1, 2]
			// 第一层：选择第一个1或第二个1，结果相同，所以跳过第二个1
			if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) {
				continue; // 跳过重复元素
			}
			if (used[i]) continue;

			// 5. 处理节点：如果当前元素未被使用
			used[i] = true;
			path.push(nums[i]);
			backtracing(used);
			path.pop();
			used[i] = false;
		}
	}

	// 初始化 used 数组，所有元素都未被使用
	backtracing([]);
	return result;
};

// 测试
console.log("=== 全排列 II 问题 ===");
console.log("输入：nums = [1,1,2]");
console.log("输出：", permuteUnique([1, 1, 2]));
console.log("期望：[[1,1,2],[1,2,1],[2,1,1]]");

console.log("\n输入：nums = [1,2,3]");
console.log("输出：", permuteUnique([1, 2, 3]));
console.log("期望：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]");

/**
 * ============================================
 * 算法执行过程详解（以 nums = [1,1,2] 为例）
 * ============================================
 *
 * 排序后：nums = [1, 1, 2]
 *
 * 回溯树状图（简化）：
 *
 *                   开始 []
 *                  /  |  \
 *                /    |    \
 *              /      |      \
 *         选1(0)   选1(1)❌  选2(2)
 *          /  \        |        |
 *        /     \       |        |
 *   选1(1)   选2(2)   ...     选1(0)
 *     |        |                |
 *   选2(2)   选1(1)           选1(1)
 *     |        |                |
 *  [1,1,2]  [1,2,1]          [2,1,1]
 *
 *
 * 详细执行流程：
 *
 * backtracing([]) - used = [false, false, false]
 *   循环 i=0: nums[0] = 1
 *     剪枝检查：i=0，不满足 i > 0，继续
 *     used[0] = false，可以使用
 *     used[0] = true, path.push(1) → path = [1]
 *     backtracing([true, false, false])
 *       循环 i=0: nums[0] = 1, used[0] = true，跳过
 *       循环 i=1: nums[1] = 1
 *         剪枝检查：i=1 > 0, nums[1] === nums[0], !used[0] = false
 *         条件：i > 0 && nums[i] === nums[i-1] && !used[i-1]
 *         结果：1 > 0 && 1 === 1 && false = false
 *         不跳过，继续
 *         used[1] = false，可以使用
 *         used[1] = true, path.push(1) → path = [1, 1]
 *         backtracing([true, true, false])
 *           循环 i=0: used[0] = true，跳过
 *           循环 i=1: used[1] = true，跳过
 *           循环 i=2: nums[2] = 2
 *             剪枝检查：i=2 > 0, nums[2] !== nums[1]，不跳过
 *             used[2] = false，可以使用
 *             used[2] = true, path.push(2) → path = [1, 1, 2]
 *             backtracing([true, true, true])
 *               路径长度 === 3，保存 [1, 1, 2] ✅
 *               返回
 *             path.pop(), used[2] = false
 *           循环结束
 *           返回
 *         path.pop(), used[1] = false
 *       循环 i=2: nums[2] = 2
 *         剪枝检查：i=2 > 0, nums[2] !== nums[1]，不跳过
 *         used[2] = false，可以使用
 *         used[2] = true, path.push(2) → path = [1, 2]
 *         backtracing([true, false, true])
 *           循环 i=0: used[0] = true，跳过
 *           循环 i=1: nums[1] = 1
 *             剪枝检查：i=1 > 0, nums[1] === nums[0], !used[0] = false
 *             不跳过，继续
 *             used[1] = false，可以使用
 *             used[1] = true, path.push(1) → path = [1, 2, 1]
 *             backtracing([true, true, true])
 *               路径长度 === 3，保存 [1, 2, 1] ✅
 *               返回
 *             path.pop(), used[1] = false
 *           循环结束
 *           返回
 *         path.pop(), used[2] = false
 *       循环结束
 *       返回
 *     path.pop(), used[0] = false
 *   循环 i=1: nums[1] = 1
 *     剪枝检查：i=1 > 0, nums[1] === nums[0], !used[0] = true
 *     条件：1 > 0 && 1 === 1 && true = true ✅
 *     continue，跳过 ❌（关键：避免重复）
 *   循环 i=2: nums[2] = 2
 *     剪枝检查：i=2 > 0, nums[2] !== nums[1]，不跳过
 *     used[2] = false，可以使用
 *     used[2] = true, path.push(2) → path = [2]
 *     backtracing([false, false, true])
 *       循环 i=0: nums[0] = 1
 *         剪枝检查：i=0，不满足 i > 0，继续
 *         used[0] = false，可以使用
 *         used[0] = true, path.push(1) → path = [2, 1]
 *         backtracing([true, false, true])
 *           循环 i=0: used[0] = true，跳过
 *           循环 i=1: nums[1] = 1
 *             剪枝检查：i=1 > 0, nums[1] === nums[0], !used[0] = false
 *             不跳过，继续
 *             used[1] = false，可以使用
 *             used[1] = true, path.push(1) → path = [2, 1, 1]
 *             backtracing([true, true, true])
 *               路径长度 === 3，保存 [2, 1, 1] ✅
 *               返回
 *             path.pop(), used[1] = false
 *           循环结束
 *           返回
 *         path.pop(), used[0] = false
 *       循环 i=1: nums[1] = 1
 *         剪枝检查：i=1 > 0, nums[1] === nums[0], !used[0] = true
 *         continue，跳过
 *       循环 i=2: used[2] = true，跳过
 *       循环结束
 *       返回
 *     path.pop(), used[2] = false
 *   循环结束
 *   返回
 *
 * 最终结果：[[1,1,2],[1,2,1],[2,1,1]]
 */

/**
 * ============================================
 * 关键理解：为什么 !used[i - 1] 能去重？
 * ============================================
 *
 * 【核心原理】
 *
 * 剪枝条件：i > 0 && nums[i] === nums[i - 1] && !used[i - 1]
 *
 * 这个条件确保：在同一层（同一位置），如果前一个相同元素未被使用，则跳过当前元素
 *
 *
 * 【为什么能去重？】
 *
 * 情况1：used[i - 1] = false（前一个相同元素未被使用）
 *   - 说明我们在同一层（同一位置）尝试选择
 *   - 如果选择 nums[i]，结果与选择 nums[i-1] 相同
 *   - 所以跳过，避免重复
 *
 * 情况2：used[i - 1] = true（前一个相同元素已被使用）
 *   - 说明前一个相同元素在上一层（前一个位置）已被使用
 *   - 当前层可以选择 nums[i]，因为位置不同，结果不同
 *   - 所以不跳过
 *
 *
 * 【示例说明】
 *
 * nums = [1, 1, 2]
 *
 * 第一层（选择第一个元素）：
 *   - 选择 nums[0] = 1：path = [1]
 *   - 选择 nums[1] = 1：path = [1]（重复！）
 *     → 因为 used[0] = false，所以跳过 nums[1]
 *
 * 第二层（在 path = [1] 的基础上选择第二个元素）：
 *   - 选择 nums[1] = 1：path = [1, 1]
 *     → 因为 used[0] = true（已在上一层使用），所以不跳过
 *   - 选择 nums[2] = 2：path = [1, 2]
 *
 *
 * 【对比：如果使用 used[i - 1] === true】
 *
 * 错误条件：i > 0 && nums[i] === nums[i - 1] && used[i - 1]
 *
 * 这会导致：
 *   - 第一层：选择 nums[0] = 1，used[0] = false，不跳过 ✅
 *   - 第一层：选择 nums[1] = 1，used[0] = false，不跳过 ❌（应该跳过）
 *   - 结果：会产生重复排列
 */

/**
 * ============================================
 * 方法2：使用 Set 去重（不推荐，效率较低）
 * ============================================
 */
var permuteUniqueSet = function (nums) {
	let result = [];
	let path = [];
	let used = new Array(nums.length).fill(false);

	function backtracing(used) {
		if (path.length === nums.length) {
			result.push([...path]);
			return;
		}

		let seen = new Set(); // 记录当前层已使用的值

		for (let i = 0; i < nums.length; i++) {
			// 如果当前元素已被使用，跳过
			if (used[i]) continue;

			// 如果当前值在当前层已使用过，跳过（去重）
			if (seen.has(nums[i])) continue;

			seen.add(nums[i]); // 标记当前值已使用
			used[i] = true;
			path.push(nums[i]);

			backtracing(used);

			path.pop();
			used[i] = false;
		}
	}

	backtracing([]);
	return result;
};

/**
 * ============================================
 * 方法对比
 * ============================================
 *
 * 方法1（排序 + 剪枝）：
 *   - 时间复杂度：O(n! × n)
 *   - 空间复杂度：O(n)
 *   - 优点：不需要额外空间，效率高
 *   - 缺点：需要先排序
 *
 * 方法2（Set 去重）：
 *   - 时间复杂度：O(n! × n × n)（Set 操作）
 *   - 空间复杂度：O(n)
 *   - 优点：不需要排序，逻辑简单
 *   - 缺点：效率较低，每层都要创建 Set
 *
 * 推荐使用方法1（排序 + 剪枝）
 */

/**
 * ============================================
 * 与全排列 I 的区别
 * ============================================
 *
 * 全排列 I（46题）：
 *   - 数组不含重复元素
 *   - 不需要去重逻辑
 *   - 只需要 used 数组标记已使用
 *
 * 全排列 II（47题）：
 *   - 数组可能含重复元素
 *   - 需要去重逻辑
 *   - 需要先排序
 *   - 需要额外的剪枝条件：!used[i - 1]
 */

/**
 * ============================================
 * 常见错误
 * ============================================
 *
 * 错误1：忘记排序
 *   ❌ 直接回溯，无法正确去重
 *   ✅ 先排序：nums.sort((a, b) => a - b)
 *
 * 错误2：剪枝条件错误
 *   ❌ if (i > 0 && nums[i] === nums[i - 1] && used[i - 1])
 *   ✅ if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1])
 *
 * 错误3：忘记初始化 used 数组
 *   ❌ backtracing(used)  // used 未定义
 *   ✅ backtracing([]) 或 backtracing(new Array(nums.length).fill(false))
 */
