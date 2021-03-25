
// https://leetcode-cn.com/problems/132-pattern/
// 给你一个整数数组 nums ，数组中共有 n 个整数。132 模式的子序列 由三个整数 nums[i]、nums[j] 和 nums[k] 组成，并同时满足：i < j < k 和 nums[i] < nums[k] < nums[j] 。

// 如果 nums 中存在 132 模式的子序列 ，返回 true ；否则，返回 false 。

//  

// 进阶：很容易想到时间复杂度为 O(n^2) 的解决方案，你可以设计一个时间复杂度为 O(n logn) 或 O(n) 的解决方案吗？

//  

// 示例 1：

// 输入：nums = [1,2,3,4]
// 输出：false
// 解释：序列中不存在 132 模式的子序列。
// 示例 2：

// 输入：nums = [3,1,4,2]
// 输出：true
// 解释：序列中有 1 个 132 模式的子序列： [1, 4, 2] 。
// 示例 3：

// 输入：nums = [-1,3,2,0]
// 输出：true
// 解释：序列中有 3 个 132 模式的的子序列：[-1, 3, 2]、[-1, 3, 0] 和 [-1, 2, 0] 。
//  

// 提示：

// n == nums.length
// 1 <= n <= 104
// -109 <= nums[i] <= 109

/**
 * @param {number[]} nums
 * @return {boolean}
 */
 var find132pattern = function(nums) {
    let n = nums.length
    let stack = [nums[n-1]]  //从右向左遍历数组 先将数组的最后一个元素放入栈中 
    let max_k = -Number.MAX_SAFE_INTEGER; //max_k代表的是第二大的元素  一开始定义为无穷小

    for(let i = n-2;i >= 0;--i){ //从倒数n-2 开始向前遍历
        if(nums[i] < max_k) return true  //如果数组中存在元素比 第二大的元素 小 则找到了1 也说明此时有元素满足 132 模式
        while(stack.length && nums[i] > stack[stack.length-1]){ //维护一个单调栈 ，最后的元素是最大的元素 
            max_k = stack[stack.length-1] //如果存在元素比栈中元素大 则将栈中元素出栈 并且记录下来 并更新第二大元素 k
            stack.pop() 
        }
        if(nums[i] > max_k ){  //第i个元素大于 第二大的元素k 将最大的元素 入栈
            stack.push(nums[i])
        }
    }
    return false //遍历完成都没有 满足条件则 返回false
};