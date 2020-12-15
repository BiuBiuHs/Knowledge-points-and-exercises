/**
 * https://leetcode-cn.com/problems/maximum-sum-circular-subarray/submissions/
 * @param {number[]} A
 * @return {number}
 */
var maxSubarraySumCircular = function(A) {
    let max = A[0]
    let tempSum = 0 
    let sumArr = 0
    // 第一种情况 最大自序在正常数组中
    //求解正常 数组的 最大子序和 
    for (var cur of A){
        sumArr += cur
        if (tempSum < 0){  // 和小于0  对结果有负向作用 替换为数组中的第i个 元素
            tempSum = cur
        }else{
            tempSum +=cur // 大于0 对结果有正向作用 ,与数组的第i个元素 相加 
        }
        max = Math.max(max,tempSum)
    }
    /**
     * //第二种情况  最大子序列 在环形数组中
     * 最大子序列 在环形数组中 那么A[0] 与A[A.length-1] 一定被选中
     * 只用求出 A[1]～A[A.length-2] 数组的 最小和 
     * 用数组所有元素之和 减去最小和 便得到 包含A[0] 与A[A.length-1]在内的最大子序列的 和
     */
    // 求出A[1]～A[A.length-2] 数组的 最小和
    let min = A[1]
    let tempMin = 0
    for(var j = 1;j<A.length-1;j++){
        if(tempMin>0){
            tempMin = A[j]

        }else{
            tempMin += A[j]
        }
        min = Math.min(min , tempMin)
    }
    //选出 正常数组的最大子序和 与 特殊情况中的最大子序和的 最大值 即为结果
    return Math.max(max , sumArr - min)

};