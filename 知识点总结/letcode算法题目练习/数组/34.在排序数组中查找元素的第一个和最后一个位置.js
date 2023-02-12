
// 链接：https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array

// 给定一个按照升序排列的整数数组 nums，和一个目标值 target。找出给定目标值在数组中的开始位置和结束位置。 

// 如果数组中不存在目标值 target，返回 [-1, -1]。

// 进阶：

// 你可以设计并实现时间复杂度为 O(log n) 的算法解决此问题吗？
//  

// 示例 1：

// 输入：nums = [5,7,7,8,8,10], target = 8
// 输出：[3,4]
// 示例 2：

// 输入：nums = [5,7,7,8,8,10], target = 6
// 输出：[-1,-1]
// 示例 3：

// 输入：nums = [], target = 0
// 输出：[-1,-1]
//  

// 提示：

// 0 <= nums.length <= 105
// -109 <= nums[i] <= 109
// nums 是一个非递减数组
// -109 <= target <= 109


//升序排列数组查找元素  使用时间复杂度为 O(log n) 的算法来解决 二分法最为合适 

var reNums = function (nums,target,lower) {  //lower为true时 是找初始位置 也就是元素第一次出现的index
    var left = 0 
    var right = nums.length -1 
    var ans = nums.length
    while(left <= right){ //循环终止条件
        let mid = Math.floor((left + right) / 2) //二分 取中间的index 
        if(nums[mid] > target || (lower && nums[mid] >= target)){ //当前位置的元素大于、等于 目标（target）元素时说明目标元素在左区间 此时改变右侧指针
            right = mid -  1
            ans = mid
        }else{ //当前元素小于目标元素 说明目标元素在右区间 改变左侧指针 
            left = mid + 1 
        }
    }
    return ans 
}


/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var searchRange = function(nums, target) {
    let ans = [-1,-1];
    let leftIndex = reNums(nums,target,true) //寻找元素第一次出现的位置 
    let rightIndex = reNums(nums,target,false) - 1 //寻找第一个大于target的元素的index 那么此时的nums[index - 1] 就应该等于target 
    if(leftIndex <= rightIndex &&rightIndex < nums.length && nums[leftIndex]===target && nums[rightIndex]===target){
        //校验一下 题目的必需条件  满足则返回结果 否则返回【-1,-1】
        return [leftIndex,rightIndex]
    }
    return ans
};