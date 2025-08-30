// function nodumpLongest(str) {
// 	let hashMap = new Map();

// 	let n = str.length;
// 	let ans = 0;
// 	let left = 0;
// 	for (var i = 0; i < n; i++) {
// 		while (hashMap.get(str[i]) > left) {
// 			left = hashMap.get(str[i]);
// 		}
// 		hashMap.set(str[i], i);
// 		ans = Math.max(ans, i - left);
// 	}
// 	return ans;
// }

// console.log(nodumpLongest("abcabcbb"));

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var subarraySum = function (nums, k) {
	let count = 0;

	for (var i = 0; i < nums.length; i++) {
		let sum = 0;
		for (var end = i; end >= 0; end--) {
			sum += nums[end];
			if (sum === k) count++;
		}
	}
	return count;
};
console.log(subarraySum([1, 3, 2], 3));
