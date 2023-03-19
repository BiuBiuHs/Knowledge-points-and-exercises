
// https://leetcode.cn/problems/3sum-closest/description/
// 给你一个长度为 n 的整数数组 nums 和 一个目标值 target。请你从 nums 中选出三个整数，使它们的和与 target 最接近。

// 返回这三个数的和。

// 假定每组输入只存在恰好一个解。

 

// 示例 1：

// 输入：nums = [-1,2,1,-4], target = 1
// 输出：2
// 解释：与 target 最接近的和是 2 (-1 + 2 + 1 = 2) 。
// 示例 2：

// 输入：nums = [0,0,0], target = 1
// 输出：0
 

// 提示：

// 3 <= nums.length <= 1000
// -1000 <= nums[i] <= 1000
// -104 <= target <= 104


var threeSumClosest = function(nums, target) {
    let N = nums.length
    let res = Number.MAX_SAFE_INTEGER  //负无穷
    nums.sort((a, b) => a - b)//从小到大排序
    for (let i = 0; i < N; i++) { //以当前位置的元素开始 遍历整个数组
        //双指针 
        let left = i + 1  //i 的下一个元素
        let right = N - 1 // 数组最后一个元素
        while (left < right) { //终止条件
            //三者之和
            let sum = nums[i] + nums[left] + nums[right]
            //比较绝对值 
            if (Math.abs(sum - target) < Math.abs(res - target)) {
                res = sum
            }
            //如果三者之和小于目标 则左指针++
            if (sum < target) {
                left++
            } else if (sum > target) { //大于目标值 右指针 -- 
                right--
            } else {
                return sum
            }
        }
    }
    return res
};
