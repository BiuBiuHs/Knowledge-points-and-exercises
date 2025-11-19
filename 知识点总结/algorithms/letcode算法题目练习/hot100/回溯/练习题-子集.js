/**
 * 78. 子集
 * https://leetcode.cn/problems/subsets/
 * 
 * 题目：给定一个不含重复元素的整数数组 nums，返回该数组所有可能的子集（幂集）。
 * 
 * 示例：
 * 输入：nums = [1,2,3]
 * 输出：[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
 * 
 * 提示：
 * - 解集不能包含重复的子集
 * - 你可以按任意顺序返回解集
 */

/**
 * 方法1：回溯模板（推荐）
 */
function subsets(nums) {
    // TODO: 实现回溯算法
    let res = [];
    let path = [];
    
    function backtrack(start) {
        // 1. 终止条件：每个节点都是结果
        
        // 2. 选择循环
        
        // 3. 处理节点
        
        // 4. 递归
        
        // 5. 回溯
    }
    
    backtrack(0);
    return res;
}

/**
 * 方法2：迭代法（扩展）
 */
function subsetsIterative(nums) {
    let res = [[]];
    
    for (let num of nums) {
        let newSubsets = [];
        for (let subset of res) {
            newSubsets.push([...subset, num]);
        }
        res = [...res, ...newSubsets];
    }
    
    return res;
}

// 测试
console.log("=== 子集问题 ===");
console.log("输入：[1,2,3]");
console.log("输出：", subsets([1,2,3]));
console.log("期望：[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]");

/**
 * ============================================
 * 参考答案
 * ============================================
 */
function subsetsAnswer(nums) {
    let res = [];
    let path = [];
    
    function backtrack(start) {
        // 1. 终止条件：每个节点都是结果（子集问题特殊）
        res.push([...path]);
        
        // 2. 选择循环：从 start 开始，避免重复
        for (let i = start; i < nums.length; i++) {
            // 3. 处理节点：选择当前元素
            path.push(nums[i]);
            
            // 4. 递归：继续探索下一层
            backtrack(i + 1);
            
            // 5. 回溯：撤销选择
            path.pop();
        }
    }
    
    backtrack(0);
    return res;
}

