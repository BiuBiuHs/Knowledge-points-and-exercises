
// https://leetcode.cn/problems/permutations/

// 给定一个不含重复数字的数组 nums ，返回其 所有可能的全排列 。你可以 按任意顺序 返回答案。

 

// 示例 1：

// 输入：nums = [1,2,3]
// 输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
// 示例 2：

// 输入：nums = [0,1]
// 输出：[[0,1],[1,0]]
// 示例 3：

// 输入：nums = [1]
// 输出：[[1]]
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permute = function(nums) {
    const ans = []

    //用箱子来装数字 
     function backtrack(box,usedMap){
        //递归的终止条件为 盒子中的数字长度与 所给定的数组长度相等时 
         if(box.length === nums.length ){
             ans.push(box)
             return 
         }
         //所有的数字都可以使用 但是不能重复
         //所以每次都从数组的0 开始
        for(var i = 0; i <nums.length ; i++) {
            //由于需要知道哪些元素 已经使用过了 所以需要一个map来记录 
            // map的key 可以是数组下标 index 也可以是 数组的第i个值（此时需要数组中咩有重复元素）
            //如果当前这个元素使用过则跳过 不放到box中
            //可以将回溯或者暴力算法理解为一颗N叉树。 记录使用的元素状态，就是去掉树中的一些不必要分支。来保证结果的正确性。
            if(usedMap[nums[i]]) continue;
            //当前元素没有使用过 放到box中
            box.push(nums[i])
            //记录使用状态
            usedMap[nums[i]] = true
            //进行下一步的递归 ，并且将box 拷贝一份来调用，由于box是一个引用 ，如果不拷贝会导致，最终的结果不正确 记录为一个空数组
            //传入元素使用的记录
            backtrack([...box],usedMap)
            //等待递归结束后，进行回溯，将之前此轮调用栈放到box中的元素拿出来
            box.pop()
            //并且恢复元素的使用状态
            usedMap[nums[i]] = false


        }
     }
     //调用回溯函数
     backtrack([],{})
     //返回结果
     return ans 
    };