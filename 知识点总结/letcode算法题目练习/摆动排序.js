/**
 * https://leetcode-cn.com/problems/wiggle-sort-ii/submissions/
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var wiggleSort = function(nums) {
    //倒序排列 取出数组后一半元素（较小的值）【3，2，1】 nums中剩余的时较大的值 【6，5，4】
    //倒叙排列 防止出现 多个相同元素 导致的 规则不匹配问题
    let nums2 = nums.sort((a,b) => b-a).splice(nums.length%2 == 0 ? nums.length/2:(nums.length-1)/2)
    var startIndex = 0 //初始插入位置
    let nums2Len = nums2.length //要插入的数组的长度
   for(var i = 0 ;i < nums2Len;i++ ){ //循环要插入的数组长度
       nums.splice(startIndex,0 ,nums2[i]) //使用改变原数组的方法 插入数字
        startIndex +=2 //按照规则进行插入
   }
   return nums
};