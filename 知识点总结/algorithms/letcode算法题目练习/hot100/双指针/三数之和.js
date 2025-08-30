/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function (nums) {
	//先给数组排序 好跳过重复数字
	nums.sort((a, b) => a - b);
	let n = nums.length;
	const ans = [];

	//从第一位开始 ，注意结束条件 因为要找到三个数
	for (var i = 0; i < n - 2; i++) {
		const x = nums[i];
		//跳过相同的数字 ，注意条件 需要i大于1
		if (i > 0 && x === nums[i - 1]) continue;

		// 左边指向 第一个数字x的右侧
		// 右指针指向数组最后一位
		let j = i + 1;
		let k = n - 1;
		//双指针 结束条件
		while (j < k) {
			//当前三数的和
			let curSum = x + nums[j] + nums[k];

			//如果当前和 大于0 说明右侧的数值过大
			if (curSum > 0) {
				k--;
			} else if (curSum < 0) {
				//如果当前和 小于0 说明左侧的数值过小
				j++;
			} else {
				//等于0 则将三个数字放到结果中
				ans.push([x, nums[j], nums[k]]);
				// 此时结果已经满足了等于0
				//应该将指针再向中间移动一下 去除重复的元素
				j++;
				k--;
				// 去除重复的元素 且左指针 小于右指针
				//才能保证结果正确 且不重复
				while (j < k && nums[j] === nums[j - 1]) j++;
				while (j < k && nums[k] === nums[k + 1]) k--;
			}
		}
	}
	return ans;
};
