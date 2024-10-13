// 给定一个非负索引 rowIndex，返回「杨辉三角」的第 rowIndex 行。

// 在「杨辉三角」中，每个数是它左上方和右上方的数的和。

/**
 * @param {number} rowIndex
 * @return {number[]}
 */ function getRows(rowIndex) {
	// 初始化一个二维数组来存储杨辉三角
	const c = new Array(rowIndex + 1).fill(0)

	for (let i = 0; i <= rowIndex; i++) {
		// 为每一行创建一个新数组
		c[i] = new Array(i + 1).fill(0)

		// 每行的第一个和最后一个元素都是1
		c[i][0] = c[i][i] = 1

		// 计算当前行的其他元素
		for (let j = 1; j < i; j++) {
			// 每个数是它上方两数之和
			c[i][j] = c[i - 1][j - 1] + c[i - 1][j]
		}
	}

	// 返回指定行的数组
	return c[rowIndex]
}
