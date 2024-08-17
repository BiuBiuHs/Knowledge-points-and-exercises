
// https://leetcode.cn/problems/longest-palindromic-substring/description/
// 给你一个字符串 s，找到 s 中最长的回文子串。

// 如果字符串的反序与原始字符串相同，则该字符串称为回文字符串。

 

// 示例 1：

// 输入：s = "babad"
// 输出："bab"
// 解释："aba" 同样是符合题意的答案。
// 示例 2：

// 输入：s = "cbbd"
// 输出："bb"
 

// 提示：

// 1 <= s.length <= 1000
// s 仅由数字和英文字母组成


//解法1 中心扩散法 
/**
 * 遍历一次数组即可得到题解，但是耗费空间 需要对每个位置都进行枚举
 * 把第i个数组的字符串当作 最长回文字符串的中心字符，向两侧进行扩散，并且保证左右的字符串相等，或左侧（右侧）的字符串与中心位置的字符相等
 * 
 * 遍历方式为从内部向外扩散，如果某个字符串的子字符串都是回文，那么此字符串一定是回文字符串。
 * 
 */

/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function(s) {
    //边界条件 s小于2时一定是回文字符串 
    if(s.length <2 ) return s 
    let strlen = s.length;
    let left = 0;
    let right = 0;
    let maxLen = 0;
    let maxStart = 0;
    let len = 1;

    for( let i = 0;i < strlen ;i++){
        left = i - 1;
        right = i + 1;

        //满足左侧与中心位置字符相等
        while (left >= 0 && s.charAt(left)===s.charAt(i)){
            left--;
            len++
        }
        //满足右侧与中心位置字符相等
        while(right < strlen && s.charAt(right)=== s.charAt(i) )
        {
            len++;
            right++
        }
        //当左右都不与中心相等时，判断左右的两个字符是否相当
        while(left >= 0 &&right < strlen && s.charAt(left)===s.charAt(right) ){
            left--;
            right++;
            len+=2
        }
        //判断此时是否是最长的回文
        if(len > maxLen){
            maxLen = len;
            maxStart = left
        }
        len = 1
    }
    return s.substring(maxStart +1 ,maxStart + maxLen +1)
};


//TODO 动态规划解法，后续补充 