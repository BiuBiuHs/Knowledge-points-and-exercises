// https://leetcode-cn.com/problems/remove-duplicate-letters/

// 给你一个字符串 s ，请你去除字符串中重复的字母，使得每个字母只出现一次。需保证 返回结果的字典序最小（要求不能打乱其他字符的相对位置）。

// 注意：该题与 1081 https://leetcode-cn.com/problems/smallest-subsequence-of-distinct-characters 相同

//  

// 示例 1：

// 输入：s = "bcabc"
// 输出："abc"
// 示例 2：

// 输入：s = "cbacdcbc"
// 输出："acdb"
//  使用栈 这种数据结构操作 遍历数组 适用于 遍历 重复字母 以及 前后字符匹配（例如：括号（）） 

var removeDuplicateLetters = function(s) {
    const vis = new Array(26).fill(0);
    const num = _.countBy(s);
    
    const sb = new Array();
    for (let i = 0; i < s.length; i++) {
        const ch = s[i];
        if (!vis[ch.charCodeAt() - 'a'.charCodeAt()]) {
            while (sb.length > 0 && sb[sb.length - 1] > ch) {
                if (num[sb[sb.length - 1]] > 0) {
                    vis[sb[sb.length - 1].charCodeAt() - 'a'.charCodeAt()] = 0;
                    sb.pop();
                } else {
                    break;
                }
            }
            vis[ch.charCodeAt() - 'a'.charCodeAt()] = 1;
            sb.push(ch);
        }
        num[ch]--;
    }
    return sb.join('');
};

