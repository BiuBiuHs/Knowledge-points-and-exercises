// https://leetcode.cn/problems/longest-consecutive-sequence/description/?envType=study-plan-v2&envId=top-interview-150

// 给定一个未排序的整数数组 nums ，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。

// 请你设计并实现时间复杂度为 O(n) 的算法解决此问题。

 

// 示例 1：

// 输入：nums = [100,4,200,1,3,2]
// 输出：4
// 解释：最长数字连续序列是 [1, 2, 3, 4]。它的长度为 4。
// 示例 2：

// 输入：nums = [0,3,7,2,5,8,4,6,0,1]
// 输出：9
 

// 提示：

// 0 <= nums.length <= 105
// -109 <= nums[i] <= 109


// 题解 重点

// 如果已知有一个 x,x+1,x+2,⋯ ,x+y 的连续序列，而我们却重新从 x+1，x+2或者是 x+y处开始尝试匹配，那么得到的结果肯定不会优于枚举 x 为起点的答案，
// 因此我们在外层循环的时候碰到这种情况跳过即可。

// 那么怎么判断是否跳过呢？由于我们要枚举的数 x 一定是在数组中不存在前驱数 x−1 的，不然按照上面的分析我们会从 x−1 开始尝试匹配，
// 因此我们每次在哈希表中检查是否存在 x−1 即能判断是否需要跳过了。



/**
 * @param {number[]} nums
 * @return {number}
 */
var longestConsecutive = function(nums) {
    let setNum = new Set(nums)
    let longest = 0

    for(var item of setNum) {
        //下面的条件才能满足题目中的条件 时间复杂度为O(n)
        //当x -1 不存在时说明 此时的item元素 为序列的起点
        //存在 x - 1时说明此元素一定在某个序列的非起点位置 所以跳过此节点的遍历即可。
        if(!setNum.has(item - 1)) {
            let curNum = item 
            let curlongest = 1

            while(setNum.has(curNum + 1)) {
                curNum += 1
                curlongest++
            }
            longest = Math.max(longest,curlongest)
        }
    }
    return longest
};
