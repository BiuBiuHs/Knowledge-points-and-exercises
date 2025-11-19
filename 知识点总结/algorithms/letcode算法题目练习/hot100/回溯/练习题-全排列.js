/**
 * 46. 全排列
 * https://leetcode.cn/problems/permutations/
 * 
 * 题目：给定一个不含重复数字的数组 nums，返回其所有可能的全排列。
 * 
 * 示例：
 * 输入：nums = [1,2,3]
 * 输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
 * 
 * 提示：
 * - 1 <= nums.length <= 6
 * - -10 <= nums[i] <= 10
 * - nums 中的所有整数互不相同
 */

/**
 * 方法1：回溯模板（使用 used 数组）
 */
function permute(nums) {
    // TODO: 实现回溯算法
    let res = [];
    let path = [];
    let used = new Array(nums.length).fill(false);
    
    function backtrack() {
        // 1. 终止条件：路径长度等于数组长度
        
        // 2. 选择循环：遍历所有元素
        
        // 3. 处理节点（记得标记 used）
        
        // 4. 递归
        
        // 5. 回溯（记得撤销 used）
    }
    
    backtrack();
    return res;
}

/**
 * 方法2：回溯模板（使用 path.includes 判断）
 */
function permute2(nums) {
    // TODO: 实现回溯算法
    let res = [];
    let path = [];
    
    function backtrack() {
        // 1. 终止条件
        
        // 2. 选择循环
        
        // 3. 处理节点（判断是否已包含）
        
        // 4. 递归
        
        // 5. 回溯
    }
    
    backtrack();
    return res;
}

// 测试
console.log("=== 全排列问题 ===");
console.log("输入：[1,2,3]");
console.log("输出：", permute([1,2,3]));
console.log("期望：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]");

/**
 * ============================================
 * 参考答案
 * ============================================
 */

/**
 * 方法1：使用 used 数组（推荐，效率更高）
 */
function permuteAnswer(nums) {
    let res = [];
    let path = [];
    let used = new Array(nums.length).fill(false);
    
    function backtrack() {
        // 1. 终止条件：路径长度等于数组长度
        if (path.length === nums.length) {
            res.push([...path]);
            return;
        }
        
        // 2. 选择循环：遍历所有元素（全排列需要遍历所有）
        for (let i = 0; i < nums.length; i++) {
            // 剪枝：跳过已使用的元素
            if (used[i]) continue;
            
            // 3. 处理节点：选择当前元素
            path.push(nums[i]);
            used[i] = true;
            
            // 4. 递归：继续选择下一个元素
            backtrack();
            
            // 5. 回溯：撤销选择
            path.pop();
            used[i] = false;
        }
    }
    
    backtrack();
    return res;
}

/**
 * 方法2：使用 path.includes（简单但效率较低）
 */
function permuteAnswer2(nums) {
    let res = [];
    let path = [];
    
    function backtrack() {
        if (path.length === nums.length) {
            res.push([...path]);
            return;
        }
        
        for (let i = 0; i < nums.length; i++) {
            // 剪枝：跳过已包含的元素
            if (path.includes(nums[i])) continue;
            
            path.push(nums[i]);
            backtrack();
            path.pop();
        }
    }
    
    backtrack();
    return res;
}

