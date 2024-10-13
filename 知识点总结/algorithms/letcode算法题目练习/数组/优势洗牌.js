// 给定两个长度相等的数组 nums1 和 nums2，nums1 相对于 nums2 的优势可以用满足 nums1[i] > nums2[i] 的索引 i 的数目来描述。

// 返回 nums1 的任意排列，使其相对于 nums2 的优势最大化。

// 示例 1：

// 输入：nums1 = [2,7,11,15], nums2 = [1,10,4,11]
// 输出：[2,11,7,15]
// 示例 2：

// 输入：nums1 = [12,24,8,32], nums2 = [13,25,32,11]
// 输出：[24,32,8,12]

/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var advantageCount = function (nums1, nums2) {
	let res = []
	// 将nums2中的元素与其索引配对，并按照元素值降序排序
	const sortedNums2 = nums2
		.map((item, index) => [item, index])
		.sort((a, b) => b[0] - a[0])

	// 对nums1进行升序排序
	let sortednums1 = nums1.sort((a, b) => a - b)
	let left = 0
	let right = nums1.length - 1

	// 遍历排序后的nums2，为每个元素在nums1中找到合适的匹配
	for (var [num, index] of sortedNums2) {
		if (sortednums1[right] > num) {
			// 如果nums1中最大的元素大于当前nums2元素，选择该元素
			res[index] = sortednums1[right]
			right--
		} else {
			// 否则选择nums1中最小的元素
			res[index] = sortednums1[left]
			left++
		}
	}
	return res
}
