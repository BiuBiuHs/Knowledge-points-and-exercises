
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
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var searchRange = function(nums, target) {

    const ans = [-1,-1]
    //target第一次出现的下标 
  function lowerBound(nums,target) {
      let left = 0 ,right = nums.length 
      while(left < right ) {
          const mid = Math.floor((left + right ) / 2) 
          if(nums[mid] < target) {
              left = mid + 1
          }else{
              right = mid
          }
      }
      return left
  }
  //第一个大于target的元素的下标
  function upperBound(nums,target) {
      let left = 0 ,right = nums.length 
      while(left < right ) {
          const mid = Math.floor((left + right ) / 2) 
          if(nums[mid] <= target) {
              left = mid + 1
          }else{
              right = mid
          }
      }
      return left
  }

  let ansL = lowerBound(nums,target)
  let ansR = upperBound(nums,target)

    console.log(ansL,'ansL')
    console.log(ansR,'ansR')
  //利用target如果在数组中 那么必定 ansL 与ansR不想等 
  //不在数组中 那么左右 必定不想等 
  if(ansL== ansR) return ans
  return [ansL,ansR - 1]
};

searchRange([5,6,7,7,8,9,9],5)
