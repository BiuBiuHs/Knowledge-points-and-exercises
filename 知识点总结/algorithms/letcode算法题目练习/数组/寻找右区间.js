// 给你一个区间数组 intervals ，其中 intervals[i] = [starti, endi] ，且每个 starti 都 不同 。

// 区间 i 的 右侧区间 可以记作区间 j ，并满足 startj >= endi ，且 startj 最小化 。注意 i 可能等于 j 。

// 返回一个由每个区间 i 的 右侧区间 在 intervals 中对应下标组成的数组。如果某个区间 i 不存在对应的 右侧区间 ，则下标 i 处的值设为 -1 。

// 示例 1：

// 输入：intervals = [[1,2]]
// 输出：[-1]
// 解释：集合中只有一个区间，所以输出-1。
// 示例 2：

// 输入：intervals = [[3,4],[2,3],[1,2]]
// 输出：[-1,0,1]
// 解释：对于 [3,4] ，没有满足条件的“右侧”区间。
// 对于 [2,3] ，区间[3,4]具有最小的“右”起点;
// 对于 [1,2] ，区间[2,3]具有最小的“右”起点。

/**
 * @param {number[][]} intervals
 * @return {number[]}
 */
var findRightInterval = function (intervals) {
	const n = intervals.length
	// 创建一个数组，包含每个区间的起始时间和索引，并按起始时间排序
	const starts = intervals
		.map((interval, index) => [interval[0], index])
		.sort((a, b) => a[0] - b[0])
	// 初始化结果数组，默认值为-1（表示没有找到下一个区间）
	const result = new Array(n).fill(-1)

	for (let i = 0; i < n; i++) {
		const end = intervals[i][1]
		let left = 0,
			right = n

		// 使用二分查找寻找第一个起始时间大于或等于当前区间结束时间的区间
		while (left < right) {
			const mid = Math.floor((left + right) / 2)
			if (starts[mid][0] >= end) {
				right = mid
			} else {
				left = mid + 1
			}
		}

		// 如果找到了符合条件的区间，更新结果数组
		if (left < n) {
			result[i] = starts[left][1]
		}
	}

	return result
}
