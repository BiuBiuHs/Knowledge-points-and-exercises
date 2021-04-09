// 链接：https://leetcode-cn.com/problems/valid-parenthesis-string
// 给定一个只包含三种字符的字符串：（ ，） 和 *，写一个函数来检验这个字符串是否为有效字符串。有效字符串具有如下规则：

// 任何左括号 ( 必须有相应的右括号 )。
// 任何右括号 ) 必须有相应的左括号 ( 。
// 左括号 ( 必须在对应的右括号之前 )。
// * 可以被视为单个右括号 ) ，或单个左括号 ( ，或一个空字符串。
// 一个空字符串也被视为有效字符串。
// 示例 1:

// 输入: "()"
// 输出: True
// 示例 2:

// 输入: "(*)"
// 输出: True
// 示例 3:

// 输入: "(*))"
// 输出: True
// 注意:

// 字符串大小将在 [1，100] 范围内。

/**
 * 
 * 解题思路 
 * 1.遍历字符串s 使用两个数组 分别保存 左括号 与 星 的index
 * 2.当遍历到右括号时 优先匹配 最近的 （ ,如果左括号数组中没有 则匹配最近的 *  如果都没有值 则返回false
 * 3.遍历完成后 可能存在 左括号 与 星数组中仍然有值
 * 4.此时进行（ 与* 进行匹配 ，如果长度不相等 直接返回false
 * 5.如果 （ 的位置 在 * 的右边 例如“*（” 此时不能匹配 返回false
 * 6.最终完全匹配则返回 true
 */

/**
 * @param {string} s
 * @return {boolean}
 */
 var checkValidString = function(s) {

    let left = [], star = [];
        for(let i=0;i<s.length;i++){
            if(s[i] == "(") left.push(i);
            if(s[i] == "*") star.push(i);
            if(s[i] == ")") {
                if(left.length == 0){
                    if(star.length == 0) return false;
                    star.pop();
                }else {
                    left.pop();
                }
            }
        }
        if(left.length > star.length) return false;
        while(left.length && star.length){
            if(left.pop() > star.pop()) return false;
        }
        return true;
    };