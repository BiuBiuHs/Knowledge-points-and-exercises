// https://leetcode-cn.com/problems/non-decreasing-array/


/**
 * @param {number[]} nums
 * @return {boolean}
 */
//pa nums [4,2,3]
 var checkPossibility = function(nums) {

    function isSorted (arr){
        for(var i = 0;i < arr.length - 1;i++){
            if(arr[i] > arr[i+1]) return false
        }
        return true
    }
    var n = nums.length
    //n-1 需要取数组中的 第i位 与第n+1 位 所以这里做边界处理 
    for(var i = 0;i < n - 1; i++){
        var x = nums[i] //取值
        var y = nums[i + 1]
        if(x > y){  //如果发生了一次降值  例如 第i位是 4 第i+1 位是 2 就是降值   
            nums[i] = y //先讲小的那个数 放到前面 也就是 将4 替换成2  [2,2,3]
            if(isSorted(nums)){
                //遍历数组 判断数组是否满足是非降序  
                return true
            }
            //上述条件不满足 先还原第i位的值 
            nums[i] = x
            nums[i + 1] = x //再将 2替换成4 也就是4，4，3
            return isSorted(nums)
        }
    }
    return true
};

