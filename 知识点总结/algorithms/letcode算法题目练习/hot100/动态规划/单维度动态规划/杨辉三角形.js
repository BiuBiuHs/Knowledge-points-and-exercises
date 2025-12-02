// 给定一个非负索引 rowIndex，返回「杨辉三角」的第 rowIndex 行。

// 在「杨辉三角」中，每个数是它左上方和右上方的数的和。

/**
 * 生成杨辉三角的前 numRows 行
 * @param {number} numRows - 杨辉三角的行数
 * @return {number[][]} - 生成的杨辉三角
 */
var generate = function (numRows) {
	// 初始化结果数组，用于存储杨辉三角的每一行
	let result = [];

	// 外层循环，遍历每一行
	for (let i = 0; i < numRows; i++) {
		// 初始化当前行，长度为 i + 1，并且所有元素初始值为 1
		let curRow = new Array(i + 1).fill(1);

		// 内层循环，计算当前行的中间元素
		for (let j = 1; j < curRow.length - 1; j++) {
			// 当前行的第 j 个元素等于上一行的第 (j-1) 个元素和第 j 个元素之和
			curRow[j] = result[i - 1][j - 1] + result[i - 1][j];
		}

		// 将当前行添加到结果数组中
		result.push(curRow);
	}

	// 返回结果数组
	return result;
};
