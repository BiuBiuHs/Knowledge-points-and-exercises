

// https://leetcode.cn/problems/longest-valid-parentheses/description/


// 给你一个只包含 '(' 和 ')' 的字符串，找出最长有效（格式正确且连续）括号子串的长度。

 

// 示例 1：

// 输入：s = "(()"
// 输出：2
// 解释：最长有效括号子串是 "()"
// 示例 2：

// 输入：s = ")()())"
// 输出：4
// 解释：最长有效括号子串是 "()()"
// 示例 3：

// 输入：s = ""
// 输出：0
 

// 提示：

// 0 <= s.length <= 3 * 104
// s[i] 为 '(' 或 ')'
/**
 * @param {string} s
 * @return {number}
 */
var longestValidParentheses = function(s) {
    let stack = []
    //预先向数组中push一个-1 来避免第一个符号是左括号的问题
    /**因为判断条件为
     * 1.将碰到的左括号都push到栈中
     * 2.碰到右括号时 将栈顶元素弹出 
     * 3.此时再判断栈如果为空 则保存的是 最后一个没有匹配的右括号的下标 
     *
     * 所以栈底元素 一直都是保存的最后一个没有匹配的右括号的下标 
     * 因此要预先在stack中放置一个元素 -1 
    */
    stack.push(-1)
    let maxans = 0

    for(var i = 0; i < s.length; i++) {
            if(s[i]==='('){
                stack.push(i)
            }else{
                stack.pop();
                if(!stack.length){
                    stack.push(i)
                }else{
                    maxans = Math.max(maxans,i - stack[stack.length - 1 ])
                }
            }
    }
    return maxans

};