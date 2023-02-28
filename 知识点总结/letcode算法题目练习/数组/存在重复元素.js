// 给定一个整数数组，判断是否存在重复元素。

// 如果存在一值在数组中出现至少两次，函数返回 true 。如果数组中每个元素都不相同，则返回 false 。

//  

// 示例 1:

// 输入: [1,2,3,1]
// 输出: true
// 示例 2:

// 输入: [1,2,3,4]
// 输出: false
// 示例 3:

// 输入: [1,1,1,3,3,4,3,2,4,2]
// 输出: true
// 通过次数429,608提交次数773,649


// 链接：https://leetcode-cn.com/problems/contains-duplicate



/**
 * @param {number[]} nums
 * @return {boolean}
 */

//暴力枚举
 var containsDuplicate = function(nums) {

    for(var left=0;left<nums.length;left++){ //left从0开始 

        let right = nums.length -1  //每次都从数组最后开始遍历
        while(left < right){ 
            if(nums[left]===nums[right]){ //存在
                return true
            }else{
            right--
            }
        }
        //left 右移一位再次便利 left+1 到数组结尾
    }
    return false
    };