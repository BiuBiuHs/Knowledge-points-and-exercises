/**
 * @param {number} target
 * @param {number[]} nums
 * @return {number}
 */
var minSubArrayLen = function (target, nums) {
	let sum = 0;
	let start = 0;
	let end = 0;
	let n = nums.length;
	let ans = Number.MAX_VALUE; // 初始化答案为最大值

	while (end < n) {
		sum += nums[end]; // 扩大窗口，累加和
		while (sum >= target) {
			// 当和大于等于目标值时，尝试缩小窗口
			ans = Math.min(end - start + 1, ans); // 更新最小子数组长度
			sum -= nums[start]; // 从和中减去窗口左端的值
			start++; // 移动窗口左端
		}
		end++; // 移动窗口右端
	}

	// 如果没有找到符合条件的子数组，返回0；否则返回最小长度
	return ans == Number.MAX_VALUE ? 0 : ans;
};
