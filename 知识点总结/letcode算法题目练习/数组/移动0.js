// https://leetcode.cn/problems/move-zeroes/


// 给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。

// 请注意 ，必须在不复制数组的情况下原地对数组进行操作。

 

// 示例 1:

// 输入: nums = [0,1,0,3,12]
// 输出: [1,3,12,0,0]
// 示例 2:

// 输入: nums = [0]
// 输出: [0]
 

// 提示:

// 1 <= nums.length <= 104
// -231 <= nums[i] <= 231 - 1
 

// 进阶：你能尽量减少完成的操作次数吗？



/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
//双指针
//注意到以下性质：
// 左指针左边均为非零数；

// 右指针左边直到左指针处均为零。

// 因此每次交换，都是将左指针的零与右指针的非零数交换，且非零数的相对顺序并未改变。
var moveZeroes = function(nums) {
    let slow=0
    let fast =0
    //终止条件
    //快指针大于数组长度时终止
    while(fast < nums.length ) {
        if(nums[fast]!=0) {
            [nums[slow],nums[fast]] = [nums[fast],nums[slow]]
            slow++
            fast++
        }else{
            fast++
        }
    }
};