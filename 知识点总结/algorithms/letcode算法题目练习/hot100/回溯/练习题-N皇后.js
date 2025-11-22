/**
 * 51. N 皇后
 * https://leetcode.cn/problems/n-queens/
 *
 * 题目：按照国际象棋的规则，皇后可以攻击与之处在同一行或同一列或同一斜线上的棋子。
 * n 皇后问题研究的是如何将 n 个皇后放置在 n×n 的棋盘上，并且使皇后彼此之间不能相互攻击。
 * 给你一个整数 n，返回所有不同的 n 皇后问题的解决方案。
 *
 * 示例：
 * 输入：n = 4
 * 输出：[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
 *
 * 解释：4 皇后问题存在两个不同的解法
 *
 * 提示：
 * - 1 <= n <= 9
 */

/**
 * 修正后的代码
 *
 * 原代码问题：
 * 1. backTrack(n,0,[]) 传入空数组，应该传入 cheseBoard
 * 2. transTwotoString 函数未定义
 * 3. cheseBoard.map() 这行代码没有意义
 * 4. 需要将二维数组转换为字符串数组
 */
var solveNQueens = function (n) {
	let res = [];
	let path = []; // 这个变量实际上没有用到
	let cheseBoard = new Array(n).fill(0).map(() => new Array(n).fill("."));

	/**
	 * 检查在 (row, col) 位置放置皇后是否有效
	 * @param {number} row - 行索引
	 * @param {number} col - 列索引
	 * @param {string[][]} cheseBoard - 棋盘
	 * @param {number} n - 棋盘大小
	 * @return {boolean} 是否有效
	 */
	function isValid(row, col, cheseBoard, n) {
		// 1. 检查同一列是否有皇后
		for (var i = 0; i < row; i++) {
			if (cheseBoard[i][col] == "Q") {
				return false;
			}
		}

		// 2. 检查左上对角线是否有皇后
		for (var i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
			if (cheseBoard[i][j] == "Q") {
				return false;
			}
		}

		// 3. 检查右上对角线是否有皇后
		for (var i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
			if (cheseBoard[i][j] == "Q") {
				return false;
			}
		}

		return true;
	}

	/**
	 * 将二维数组转换为字符串数组
	 * @param {string[][]} board - 二维数组棋盘
	 * @return {string[]} 字符串数组
	 */
	function transTwotoString(board) {
		return board.map((row) => row.join(""));
	}

	/**
	 * 回溯函数
	 * @param {number} n - 棋盘大小
	 * @param {number} row - 当前处理的行
	 * @param {string[][]} cheseBoard - 棋盘
	 */
	function backTrack(n, row, cheseBoard) {
		// 终止条件：已经处理完所有行
		if (row == n) {
			// 将二维数组转换为字符串数组并保存
			res.push(transTwotoString(cheseBoard));
			return;
		}

		// 尝试在当前行的每一列放置皇后
		for (var col = 0; col < n; col++) {
			// 检查当前位置是否有效
			if (isValid(row, col, cheseBoard, n)) {
				// 选择：放置皇后
				cheseBoard[row][col] = "Q";

				// 递归：处理下一行
				backTrack(n, row + 1, cheseBoard);

				// 回溯：撤销选择
				cheseBoard[row][col] = ".";
			}
		}
	}

	// 从第 0 行开始回溯，传入棋盘
	backTrack(n, 0, cheseBoard); // ✅ 修正：传入 cheseBoard 而不是 []
	return res;
};

// 测试
console.log("=== N 皇后问题 ===");
console.log("输入：n = 4");
console.log("输出：", solveNQueens(4));
console.log("期望：2 个解");

/**
 * ============================================
 * 原代码问题分析
 * ============================================
 *
 * 【问题1】backTrack(n,0,[]) 传入空数组
 * ❌ 错误：backTrack(n, 0, [])
 * ✅ 正确：backTrack(n, 0, cheseBoard)
 *
 * 原因：
 * - 函数签名是 backTrack(n, row, cheseBoard)
 * - 第三个参数应该是棋盘数组，而不是空数组
 * - 传入空数组会导致无法正确访问和修改棋盘
 *
 *
 * 【问题2】transTwotoString 函数未定义
 * ❌ 错误：函数未定义，会导致运行时错误
 * ✅ 正确：需要实现这个函数
 *
 * 实现：
 * function transTwotoString(board) {
 *     return board.map(row => row.join(''));
 * }
 *
 *
 * 【问题3】cheseBoard.map() 这行代码没有意义
 * ❌ 错误：cheseBoard.map() 没有赋值，也没有使用返回值
 * ✅ 正确：删除这行代码，或者使用 transTwotoString
 *
 *
 * 【问题4】变量 path 未使用
 * - path 变量定义了但没有使用
 * - 可以删除，不影响功能
 */

/**
 * ============================================
 * 算法执行过程详解（以 n = 4 为例）
 * ============================================
 *
 * 回溯树状图（简化）：
 *
 *                   开始 row=0
 *                  /  |  |  \
 *                /    |  |    \
 *            col=0  col=1 col=2 col=3
 *              |      |    |     |
 *            [Q...]  [.Q..] [..Q.] [...Q]
 *              |      |    |     |
 *            row=1  row=1 row=1 row=1
 *              |      |    |     |
 *            ...    ...  ...   ...
 *
 *
 * 详细执行流程（第一个解）：
 *
 * backTrack(4, 0, cheseBoard)
 *   row = 0
 *   循环 col=0:
 *     isValid(0, 0, cheseBoard, 4)
 *       检查列：无冲突 ✅
 *       检查左上对角线：无冲突 ✅
 *       检查右上对角线：无冲突 ✅
 *     返回 true
 *     cheseBoard[0][0] = 'Q'
 *     backTrack(4, 1, cheseBoard)
 *       row = 1
 *       循环 col=0:
 *         isValid(1, 0, cheseBoard, 4)
 *           检查列：cheseBoard[0][0] == 'Q' ❌ 冲突
 *         返回 false
 *       循环 col=1:
 *         isValid(1, 1, cheseBoard, 4)
 *           检查列：无冲突 ✅
 *           检查左上对角线：cheseBoard[0][0] == 'Q' ❌ 冲突
 *         返回 false
 *       循环 col=2:
 *         isValid(1, 2, cheseBoard, 4)
 *           检查列：无冲突 ✅
 *           检查左上对角线：无冲突 ✅
 *           检查右上对角线：无冲突 ✅
 *         返回 true
 *         cheseBoard[1][2] = 'Q'
 *         backTrack(4, 2, cheseBoard)
 *           row = 2
 *           循环 col=0:
 *             isValid(2, 0, cheseBoard, 4)
 *               检查列：cheseBoard[0][0] == 'Q' ❌ 冲突
 *           循环 col=1:
 *             isValid(2, 1, cheseBoard, 4)
 *               检查列：无冲突 ✅
 *               检查左上对角线：无冲突 ✅
 *               检查右上对角线：cheseBoard[1][2] == 'Q' ❌ 冲突
 *           循环 col=2:
 *             isValid(2, 2, cheseBoard, 4)
 *               检查列：无冲突 ✅
 *               检查左上对角线：cheseBoard[1][1] == '.' ✅
 *               检查右上对角线：cheseBoard[1][3] == '.' ✅
 *               但是！检查列时发现：cheseBoard[1][2] == 'Q' ❌
 *               等等，这里检查逻辑有问题...
 *               实际上应该检查：同一列是否有皇后
 *               检查列：cheseBoard[0][2] == '.' ✅
 *               检查列：cheseBoard[1][2] == 'Q' ❌ 冲突
 *           循环 col=3:
 *             isValid(2, 3, cheseBoard, 4)
 *               检查列：无冲突 ✅
 *               检查左上对角线：cheseBoard[1][2] == 'Q' ❌ 冲突
 *           回溯：cheseBoard[1][2] = '.'
 *         回溯：cheseBoard[0][0] = '.'
 *       继续尝试 col=3...
 *
 * 最终找到两个解：
 * 解1：[".Q..","...Q","Q...","..Q."]
 * 解2：["..Q.","Q...","...Q",".Q.."]
 */

/**
 * ============================================
 * 优化版本：使用一维数组记录列位置
 * ============================================
 *
 * 优化思路：
 * - 使用一维数组记录每行皇后的列位置
 * - 简化冲突检查逻辑
 * - 减少空间复杂度
 */
var solveNQueensOptimized = function (n) {
	let res = [];
	// 使用一维数组：queens[i] 表示第 i 行皇后所在的列
	let queens = new Array(n).fill(-1);

	/**
	 * 检查在 (row, col) 位置放置皇后是否有效
	 */
	function isValid(row, col) {
		for (let i = 0; i < row; i++) {
			// 检查同一列
			if (queens[i] === col) {
				return false;
			}
			// 检查对角线：行差 == 列差
			if (Math.abs(row - i) === Math.abs(col - queens[i])) {
				return false;
			}
		}
		return true;
	}

	/**
	 * 将结果转换为字符串数组
	 */
	function buildBoard() {
		let board = [];
		for (let i = 0; i < n; i++) {
			let row = new Array(n).fill(".");
			row[queens[i]] = "Q";
			board.push(row.join(""));
		}
		return board;
	}

	function backtrack(row) {
		if (row === n) {
			res.push(buildBoard());
			return;
		}

		for (let col = 0; col < n; col++) {
			if (isValid(row, col)) {
				queens[row] = col;
				backtrack(row + 1);
				queens[row] = -1; // 回溯
			}
		}
	}

	backtrack(0);
	return res;
};

/**
 * ============================================
 * 关键理解点
 * ============================================
 *
 * 1. 为什么只需要检查上方？
 *    - 因为我们是按行从上到下放置皇后
 *    - 当前行下方还没有放置皇后，所以只需要检查上方
 *
 * 2. 如何检查对角线冲突？
 *    - 左上对角线：行减1，列减1
 *    - 右上对角线：行减1，列加1
 *    - 或者：|row1 - row2| === |col1 - col2|
 *
 * 3. 回溯的关键：
 *    - 放置皇后：cheseBoard[row][col] = 'Q'
 *    - 递归：backTrack(n, row + 1, cheseBoard)
 *    - 回溯：cheseBoard[row][col] = '.'
 *
 * 4. 时间复杂度：O(n!)
 *    - 最坏情况需要尝试所有排列
 *
 * 5. 空间复杂度：O(n²)
 *    - 棋盘空间：n × n
 *    - 递归深度：O(n)
 */

/**
 * ============================================
 * 常见错误
 * ============================================
 *
 * 错误1：传入错误的参数
 *   ❌ backTrack(n, 0, [])
 *   ✅ backTrack(n, 0, cheseBoard)
 *
 * 错误2：忘记实现转换函数
 *   ❌ res.push(transTwotoString(cheseBoard))  // 函数未定义
 *   ✅ 实现 transTwotoString 函数
 *
 * 错误3：忘记回溯
 *   ❌ cheseBoard[row][col] = 'Q'
 *      backTrack(n, row + 1, cheseBoard)
 *      // 缺少回溯
 *   ✅ cheseBoard[row][col] = 'Q'
 *      backTrack(n, row + 1, cheseBoard)
 *      cheseBoard[row][col] = '.'  // 回溯
 *
 * 错误4：检查逻辑错误
 *   ❌ 检查所有方向（包括下方）
 *   ✅ 只检查上方（行、列、对角线）
 */

// 测试优化版本
console.log("\n=== 优化版本 ===");
console.log("输入：n = 4");
console.log("输出：", solveNQueensOptimized(4));
