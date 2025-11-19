/**
 * 22. 括号生成
 * https://leetcode.cn/problems/generate-parentheses/
 * 
 * 题目：数字 n 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且有效的括号组合。
 * 
 * 示例：
 * 输入：n = 3
 * 输出：["((()))","(()())","(())()","()(())","()()()"]
 * 
 * 提示：
 * - 1 <= n <= 8
 */

/**
 * 方法1：回溯模板
 */
function generateParenthesis(n) {
    // TODO: 实现回溯算法
    let res = [];
    
    function backtrack(str, left, right) {
        // 1. 终止条件：字符串长度达到 2*n
        
        // 2. 剪枝：右括号数量不能超过左括号
        
        // 3. 选择1：添加左括号（如果 left < n）
        
        // 4. 选择2：添加右括号（如果 right < left）
    }
    
    backtrack("", 0, 0);
    return res;
}

// 测试
console.log("=== 括号生成问题 ===");
console.log("输入：n = 3");
console.log("输出：", generateParenthesis(3));
console.log("期望：['((()))','(()())','(())()','()(())','()()()']");

/**
 * ============================================
 * 参考答案
 * ============================================
 */
function generateParenthesisAnswer(n) {
    let res = [];
    
    function backtrack(str, left, right) {
        // 1. 终止条件：字符串长度达到 2*n
        if (str.length === 2 * n) {
            res.push(str);
            return;
        }
        
        // 2. 选择1：添加左括号（如果还可以添加）
        if (left < n) {
            // 使用新字符串，不需要回溯
            backtrack(str + "(", left + 1, right);
        }
        
        // 3. 选择2：添加右括号（如果右括号数量小于左括号）
        if (right < left) {
            backtrack(str + ")", left, right + 1);
        }
    }
    
    backtrack("", 0, 0);
    return res;
}

/**
 * 方法2：使用数组（需要回溯）
 */
function generateParenthesisAnswer2(n) {
    let res = [];
    let path = [];
    
    function backtrack(left, right) {
        if (path.length === 2 * n) {
            res.push(path.join(""));
            return;
        }
        
        if (left < n) {
            path.push("(");
            backtrack(left + 1, right);
            path.pop();  // 回溯
        }
        
        if (right < left) {
            path.push(")");
            backtrack(left, right + 1);
            path.pop();  // 回溯
        }
    }
    
    backtrack(0, 0);
    return res;
}

