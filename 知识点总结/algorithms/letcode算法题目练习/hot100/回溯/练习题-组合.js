/**
 * 77. 组合
 * https://leetcode.cn/problems/combinations/
 * 
 * 题目：给定两个整数 n 和 k，返回 1...n 中所有可能的 k 个数的组合。
 * 
 * 示例：
 * 输入：n = 4, k = 2
 * 输出：[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]
 * 
 * 提示：
 * - 1 <= n <= 20
 * - 1 <= k <= n
 */

/**
 * 方法1：回溯模板
 */
function combine(n, k) {
    // TODO: 实现回溯算法
    let res = [];
    let path = [];
    
    function backtrack(start) {
        // 1. 终止条件：路径长度达到 k
        
        // 2. 选择循环：从 start 到 n
        
        // 3. 处理节点
        
        // 4. 递归
        
        // 5. 回溯
    }
    
    backtrack(1);
    return res;
}

// 测试
console.log("=== 组合问题 ===");
console.log("输入：n = 4, k = 2");
console.log("输出：", combine(4, 2));
console.log("期望：[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]");

/**
 * ============================================
 * 参考答案
 * ============================================
 */
function combineAnswer(n, k) {
    let res = [];
    let path = [];
    
    function backtrack(start) {
        // 1. 终止条件：路径长度达到 k
        if (path.length === k) {
            res.push([...path]);
            return;
        }
        
        // 2. 选择循环：从 start 到 n
        for (let i = start; i <= n; i++) {
            // 3. 处理节点：选择当前数字
            path.push(i);
            
            // 4. 递归：继续选择下一个数字
            backtrack(i + 1);
            
            // 5. 回溯：撤销选择
            path.pop();
        }
    }
    
    backtrack(1);
    return res;
}

/**
 * 优化版本：剪枝优化
 * 当剩余元素不足时，提前终止
 */
function combineOptimized(n, k) {
    let res = [];
    let path = [];
    
    function backtrack(start) {
        // 剪枝：剩余元素不足
        if (path.length + (n - start + 1) < k) {
            return;
        }
        
        if (path.length === k) {
            res.push([...path]);
            return;
        }
        
        for (let i = start; i <= n; i++) {
            path.push(i);
            backtrack(i + 1);
            path.pop();
        }
    }
    
    backtrack(1);
    return res;
}

