// https://leetcode.cn/problems/permutations-ii/
// 给定一个可包含重复数字的序列 nums ，按任意顺序 返回所有不重复的全排列。

 

// 示例 1：

// 输入：nums = [1,1,2]
// 输出：
// [[1,1,2],
//  [1,2,1],
//  [2,1,1]]
// 示例 2：

// 输入：nums = [1,2,3]
// 输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
 


/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permuteUnique = function(nums) {
    const ans = []
    //需要让相等的元素相邻 以便后续的算法解题
    const sortArr = nums.sort((a,b)=>a -b)
    //正常回溯 依旧传递元素的使用情况
    //使用index当作key 
    function backtrack(box,usedMap) {
        if(box.length === sortArr.length) {
            ans.push(box)
            return 
        }

        for(var i = 0 ; i < sortArr.length; i++) {
            //需要做着重注意这里。
            //不仅仅判断了元素的状态， 左右相邻元素 相等时，左侧的元素没有使用过时跳过，相当于在树的 同层剪枝
            //只使用相等元素中的 从左到右的第一个元素 
            //eg:3个1 同级 会将右侧的两个元素的递归给跳过，也就是剪枝。避免生成重复元素
            //知识点总结/letcode算法题目练习/递归或回溯/题解图形/全排列2树形结构.jpg (看图)
            if(usedMap[i] ||(i > 0 && sortArr[i] === sortArr[i-1] && !usedMap[i - 1])){
                continue;
            }
            box.push(sortArr[i])
            usedMap[i] = true
            backtrack([...box],usedMap)
            box.pop()
            usedMap[i] = false
        }
    }

    backtrack([],{})
    return ans
};