// https://leetcode.cn/problems/kth-largest-element-in-an-array/description/


// 给定整数数组 nums 和整数 k，请返回数组中第 k 个最大的元素。

// 请注意，你需要找的是数组排序后的第 k 个最大的元素，而不是第 k 个不同的元素。

// 你必须设计并实现时间复杂度为 O(n) 的算法解决此问题。

 

// 示例 1:

// 输入: [3,2,1,5,6,4], k = 2
// 输出: 5
// 示例 2:

// 输入: [3,2,3,1,2,4,5,5,6], k = 4
// 输出: 4
 

// 提示：

// 1 <= k <= nums.length <= 105
// -104 <= nums[i] <= 104

/**
 * 使用快速排序来解题
 * 1.快排分割区间
 * 2.第k个最大的元素的下标即为 数组的长度 - k  （nums.length - k)
 */


/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findKthLargest = function(nums, k) {
    //快排分割区间
    const divide = (nums, l, r) => {   
        let middle = l++
        while(l <= r) {
            if(nums[l] <= nums[middle]) {
                l++
            }else{
                [nums[l],nums[r]]=[nums[r],nums[l]]
                r--
            }
        }
        [nums[middle] ,nums[r]] = [nums[r],nums[middle]]
        //返回的index 即为第一个元素在正确序列中的位置 
        return r
    }

    const quickSort = (nums, left, right) => {
        if(!Array.isArray(nums) || left >= right) {
            return nums[left]
        }
        const index = divide(nums, left, right)
        //目标下标为，target =  nums.length - k  
        //target < 当前元素的index 说明改元素在左边的区间中
        if(nums.length - k < index) {
            //快速排序左侧区间即可
            return quickSort(nums, left, index - 1)
        } else if(nums.length - k > index) {
            //快速排序右侧侧区间即可
            return quickSort(nums, index + 1, right)
        } else {
            //相等时即找到了 第k个最大的元素
            return nums[index]
        }
    }
    return quickSort(nums, 0, nums.length - 1)
};