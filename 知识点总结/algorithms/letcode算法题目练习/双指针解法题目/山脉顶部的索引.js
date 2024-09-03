// 符合下列属性的数组 arr 称为 山峰数组（山脉数组） ：

// arr.length >= 3
// 存在 i（0 < i < arr.length - 1）使得：
// arr[0] < arr[1] < ... arr[i-1] < arr[i]
// arr[i] > arr[i+1] > ... > arr[arr.length - 1]
// 给定由整数组成的山峰数组 arr ，返回任何满足 arr[0] < arr[1] < ... arr[i - 1] < arr[i] > arr[i + 1] > ... > arr[arr.length - 1] 的下标 i ，即山峰顶部。

// 示例 1：

// 输入：arr = [0,1,0]
// 输出：1
// 示例 2：

// 输入：arr = [1,3,5,4,2]
// 输出：2

/**
 * @param {number[]} arr
 * @return {number}
 */
var peakIndexInMountainArray = function (arr) {
	let left = 0
	let right = arr.length - 1
	while (left < right) {
		let mid = Math.floor((left + right) / 2)
		if (arr[mid] < arr[mid + 1]) {
			left = mid + 1
		} else {
			right = mid
		}
	}
	return left
}
