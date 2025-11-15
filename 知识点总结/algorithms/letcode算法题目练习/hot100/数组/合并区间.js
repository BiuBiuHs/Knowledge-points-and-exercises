// https://leetcode.cn/problems/merge-intervals/submissions/594905076/?envType=study-plan-v2&envId=top-interview-150
// 以数组 intervals 表示若干个区间的集合，其中单个区间为 intervals[i] = [starti, endi] 。请你合并所有重叠的区间，并返回 一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间 。

// 示例 1：

// 输入：intervals = [[1,3],[2,6],[8,10],[15,18]]
// 输出：[[1,6],[8,10],[15,18]]
// 解释：区间 [1,3] 和 [2,6] 重叠, 将它们合并为 [1,6].
// 示例 2：

// 输入：intervals = [[1,4],[4,5]]
// 输出：[[1,5]]
// 解释：区间 [1,4] 和 [4,5] 可被视为重叠区间。

// 提示：

// 1 <= intervals.length <= 104
// intervals[i].length == 2
// 0 <= starti <= endi <= 104

/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function (intervals) {
	intervals.sort((left, right) => {
		//根据区间的左侧排序 从小到大
		return left[0] - right[0];
	});

	let ans = [];

	for (var item of intervals) {
		//结果集为空 或者
		// 结果集中的最后一项的右区间 小于 当前区间数组的左区间时
		// 说明此时 结果集的最后一项 与当前区间项 没有交集 直接将当前区间项 放到结果集中
		if (ans.length == 0 || ans[ans.length - 1][1] < item[0]) {
			ans.push(item);
		} else {
			//否则说明此时有交集
			//判断进行合并 ，用结果集的最后一项 与当前区间项进行合并。
			ans[ans.length - 1] = [
				//左区间用 结果集的最后一项的开区间即可
				ans[ans.length - 1][0],
				//右区间 需要取更大的值 需要对比一下
				Math.max(item[1], ans[ans.length - 1][1]),
			];
		}
	}
	return ans;
};
