/**
 * LeetCode 27. 移除元素
 * https://leetcode.cn/problems/remove-element/
 *
 * 给你一个数组 nums 和一个值 val，你需要原地移除所有数值等于 val 的元素，并返回移除后数组的新长度。
 * 不要使用额外的数组空间，你必须仅使用 O(1) 额外空间并原地修改输入数组。
 * 元素的顺序可以改变。你不需要考虑数组中超出新长度后面的元素。
 *
 * 示例 1：
 * 输入：nums = [3,2,2,3], val = 3
 * 输出：2, nums = [2,2,_,_]
 * 解释：函数应该返回新的长度 2，并且 nums 中的前两个元素均为 2。
 * 你不需要考虑数组中超出新长度后面的元素。例如，函数返回的新长度为 2，
 * 而 nums = [2,2,3,3] 或 nums = [2,2,0,0]，也会被视作正确答案。
 *
 * 示例 2：
 * 输入：nums = [0,1,2,2,3,0,4,2], val = 2
 * 输出：5, nums = [0,1,3,0,4,_,_,_]
 * 解释：函数应该返回新的长度 5，并且 nums 中的前五个元素为 0,1,3,0,4。
 * 注意这五个元素可以任意顺序返回。你不需要考虑数组中超出新长度后面的元素。
 *
 * 提示：
 * 0 <= nums.length <= 100
 * 0 <= nums[i] <= 50
 * 0 <= val <= 100
 */

// ============================================
// 方法一：快慢双指针（推荐）
// ============================================
// 时间复杂度：O(n)
// 空间复杂度：O(1)

/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function (nums, val) {
	// slow: 慢指针，指向下一个要填充的位置
	// fast: 快指针，用于遍历数组
	let slow = 0;

	for (let fast = 0; fast < nums.length; fast++) {
		// 如果快指针指向的元素不等于 val
		// 就把它复制到慢指针位置，然后慢指针前进
		if (nums[fast] !== val) {
			nums[slow] = nums[fast];
			slow++;
		}
		// 如果快指针指向的元素等于 val，只移动快指针，跳过该元素
	}

	// 慢指针的位置就是新数组的长度
	return slow;
};

// 执行流程示例：
// nums = [3,2,2,3], val = 3
//
// 初始：slow = 0, fast = 0
// nums = [3,2,2,3]
//         ↑
//       s,f
//
// fast = 0: nums[0] = 3 === val, 只移动 fast
// slow = 0, fast = 1
// nums = [3,2,2,3]
//         ↑ ↑
//         s f
//
// fast = 1: nums[1] = 2 !== val, nums[slow] = nums[fast], slow++
// slow = 1, fast = 2
// nums = [2,2,2,3]
//           ↑ ↑
//           s f
//
// fast = 2: nums[2] = 2 !== val, nums[slow] = nums[fast], slow++
// slow = 2, fast = 3
// nums = [2,2,2,3]
//             ↑ ↑
//             s f
//
// fast = 3: nums[3] = 3 === val, 只移动 fast
// slow = 2, fast = 4 (结束)
// nums = [2,2,2,3]
//             ↑
//             s
//
// 返回 slow = 2

// ============================================
// 方法二：左右双指针（优化版）
// ============================================
// 适用于要删除的元素很少的情况
// 时间复杂度：O(n) 最坏情况，但平均情况下更优
// 空间复杂度：O(1)

var removeElement2 = function (nums, val) {
	let left = 0;
	let right = nums.length - 1;

	while (left <= right) {
		if (nums[left] === val) {
			// 如果左指针指向要删除的元素
			// 用右指针的元素覆盖它
			nums[left] = nums[right];
			right--;
		} else {
			// 如果左指针指向的不是要删除的元素，继续前进
			left++;
		}
	}

	return left;
};

// 执行流程示例：
// nums = [3,2,2,3], val = 3
//
// 初始：left = 0, right = 3
// nums = [3,2,2,3]
//         ↑     ↑
//         l     r
//
// left = 0: nums[0] = 3 === val, nums[left] = nums[right], right--
// left = 0, right = 2
// nums = [3,2,2,3]
//         ↑   ↑
//         l   r
//
// left = 0: nums[0] = 3 !== val, left++
// left = 1, right = 2
// nums = [3,2,2,3]
//           ↑ ↑
//           l r
//
// left = 1: nums[1] = 2 !== val, left++
// left = 2, right = 2
// nums = [3,2,2,3]
//             ↑
//            l,r
//
// left = 2: nums[2] = 2 !== val, left++
// left = 3, right = 2 (left > right, 结束)
//
// 返回 left = 3

// ============================================
// 方法三：使用 filter（非原地修改，不符合题意，仅供参考）
// ============================================
// 时间复杂度：O(n)
// 空间复杂度：O(n)

var removeElement3 = function (nums, val) {
	// 注意：这种方法创建了新数组，不符合题目要求的"原地修改"
	const filtered = nums.filter((num) => num !== val);

	// 将过滤后的元素复制回原数组
	for (let i = 0; i < filtered.length; i++) {
		nums[i] = filtered[i];
	}

	return filtered.length;
};

// ============================================
// 测试用例
// ============================================

console.log("===== 测试用例 =====");

// 测试用例 1
let nums1 = [3, 2, 2, 3];
let result1 = removeElement(nums1, 3);
console.log("测试 1:");
console.log("输入: nums = [3,2,2,3], val = 3");
console.log("输出:", result1);
console.log("数组:", nums1.slice(0, result1));
console.log("预期: 2, [2,2]");
console.log("");

// 测试用例 2
let nums2 = [0, 1, 2, 2, 3, 0, 4, 2];
let result2 = removeElement(nums2, 2);
console.log("测试 2:");
console.log("输入: nums = [0,1,2,2,3,0,4,2], val = 2");
console.log("输出:", result2);
console.log("数组:", nums2.slice(0, result2));
console.log("预期: 5, [0,1,3,0,4]");
console.log("");

// 测试用例 3：空数组
let nums3 = [];
let result3 = removeElement(nums3, 1);
console.log("测试 3:");
console.log("输入: nums = [], val = 1");
console.log("输出:", result3);
console.log("数组:", nums3.slice(0, result3));
console.log("预期: 0, []");
console.log("");

// 测试用例 4：所有元素都需要移除
let nums4 = [1, 1, 1, 1];
let result4 = removeElement(nums4, 1);
console.log("测试 4:");
console.log("输入: nums = [1,1,1,1], val = 1");
console.log("输出:", result4);
console.log("数组:", nums4.slice(0, result4));
console.log("预期: 0, []");
console.log("");

// 测试用例 5：没有元素需要移除
let nums5 = [1, 2, 3, 4];
let result5 = removeElement(nums5, 5);
console.log("测试 5:");
console.log("输入: nums = [1,2,3,4], val = 5");
console.log("输出:", result5);
console.log("数组:", nums5.slice(0, result5));
console.log("预期: 4, [1,2,3,4]");

// ============================================
// 题解总结
// ============================================

/**
 * 双指针解法对比：
 *
 * 1. 快慢指针（方法一）：
 *    - 慢指针 slow：指向下一个要填充的位置
 *    - 快指针 fast：遍历整个数组
 *    - 当 fast 指向的元素不等于 val 时，复制到 slow 位置
 *    - 适用于大部分情况
 *
 * 2. 左右指针（方法二）：
 *    - 左指针 left：从左向右遍历
 *    - 右指针 right：指向数组末尾
 *    - 当 left 指向 val 时，用 right 的值覆盖
 *    - 优势：当要删除的元素很少时，移动次数更少
 *    - 缺点：不保证元素的相对顺序
 *
 * 选择建议：
 * - 需要保持相对顺序：使用方法一（快慢指针）
 * - 要删除的元素很少：使用方法二（左右指针）
 * - 大部分情况：方法一更通用
 */
