
/**
 * 给定一个数组 格式为
 * [
 * [1,2],
 * [1,5],
 * [7,9],
 * ]
 * 求数组中不重复区间的个数
 */


function findDifArea(intervals) {

    //首先用[start,end] 数组中的end元素进行排序，保证数组中有一种有序关系 
    //按照end升序排序
    intervals.sort((a,b)=> a[1] - b[1] )
    //因为end有序，所以记录上一次遍历的数组的最大值
    let maxEnd = Number.MIN_VALUE
    //ans
    let ans = 0
    const len = intervals.length 
    //遍历数组 
    for(var i = 0 ; i <  len ; i++) {
        const [start,end ] = intervals[i]
        //数组的左边界都比上一次记录的最大值大时说明 说明对比的 两个区间不重复 
        if(maxEnd <= start) {
            //更新最大值
            maxEnd = end
            ans++
        }
    }
    return count 
}

//变种题
// https://leetcode.cn/problems/non-overlapping-intervals/

function findDifArea(intervals) {

    if (!intervals.length) {
        return 0;
    }
    
    //首先用[start,end] 数组中的end元素进行排序，保证数组中有一种有序关系 
    //按照end升序排序
    //注意使用贪心 必须要用end来生序排列
    intervals.sort((a,b)=> a[1] - b[1] )
    //因为end有序，所以记录上一次遍历的数组的最大值
    //注意此处初始值
    let maxEnd = intervals[0][1]
    //ans 注意此处初始值
    let ans = 1
    const len = intervals.length 
    //遍历数组 
    // 注意此处 i的 初始值
    for(var i = 1 ; i <  len ; i++) {
        const [start,end ] = intervals[i]
        //数组的左边界都比上一次记录的最大值大时说明 说明对比的 两个区间不重复 
        if(maxEnd <= start) {
            //更新最大值
            maxEnd = end
            ans++
        }
    }
    return  len - ans 
}