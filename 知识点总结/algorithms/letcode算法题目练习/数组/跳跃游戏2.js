
// 45. https://leetcode-cn.com/problems/jump-game-ii/
// 给你一个非负整数数组 nums ，你最初位于数组的第一个位置。

// 数组中的每个元素代表你在该位置可以跳跃的最大长度。

// 你的目标是使用最少的跳跃次数到达数组的最后一个位置。

// 假设你总是可以到达数组的最后一个位置。

//  

// 示例 1:

// 输入: nums = [2,3,1,1,4]
// 输出: 2
// 解释: 跳到最后一个位置的最小跳跃数是 2。
//      从下标为 0 跳到下标为 1 的位置，跳 1 步，然后跳 3 步到达数组的最后一个位置。
// 示例 2:

// 输入: nums = [2,3,0,1,4]
// 输出: 2
//  

// 提示:

// 1 <= nums.length <= 104
// 0 <= nums[i] <= 1000


/**
 * @param {number[]} nums
 * @return {number}
 */
 var jump = function(nums) {
    let position = nums.length - 1   //数组长度
    let step = 0;
    while(position>0){ // 当最后一位大于0时 
        for(var i = 0; i < position; i++){
            if(i + nums[i]>= position){ //倒推每次从左到右遍历数组 找到能跳跃的position的位置的最小的数组下标  也就是跳跃到终点的上一步 
                position = i //更新终点为i 也就是倒推 上一步 
                step++
                break;
            }
        }
    }
   return step
   
   };