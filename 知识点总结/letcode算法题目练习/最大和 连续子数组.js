// 题目：
//     给定一个整数数组 nums ，找到一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

//     示例:

//     输入: [-2,1,-3,4,-1,2,1,-5,4],
//     输出: 6
//     解释: 连续子数组 [4,-1,2,1] 的和最大，为 6。

//     来源：力扣（LeetCode）
//     链接：https://leetcode-cn.com/problems/maximum-subarray
//     著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

// 题解 ：
// 1. 遍历数组 当前最大连续子序列和为 sum，最终结果为 ans 
// 2. 如果 当前值 sum < 0 说明对最终结果 有负向影响, 将数组下一位 数字赋值给 sum ,sum = num
// 3. 如果 sum > 0 说明对结果有正向的影响，sum与数组中下一位元素相加  sum += num
// 4. 每次比较 当前数组之和sum 和ans的大小 将较大的值 赋给ans
// 5. 最大连续和 的数组 永远以正数开始 
// 6. 时间复杂度 O(n) 只需要遍历一遍数组即可 空间复杂度 O(1)常数级别的空间
// 7. for of 与 for in的区别, for of一般用于遍历数组 num 就代表数组中的元素值, for in一般用于遍历对象 num代表的是数组的下标 nums[num] 才可以访问 数组元素具体的值

function maxSubArray (nums){
    var ans = nums[0]
    var sum = 0
    for (const num of nums ){
        if(sum > 0 ){
            sum += num
        }else{
            sum = num
        }
        ans = Math.max(sum ,ans)
    }
    return ans
}


