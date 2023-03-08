// https://leetcode.cn/problems/longest-common-prefix/description/?languageTags=javascript
// 编写一个函数来查找字符串数组中的最长公共前缀。

// 如果不存在公共前缀，返回空字符串 ""。

 

// 示例 1：

// 输入：strs = ["flower","flow","flight"]
// 输出："fl"
// 示例 2：

// 输入：strs = ["dog","racecar","car"]
// 输出：""
// 解释：输入不存在公共前缀。
 

// 提示：

// 1 <= strs.length <= 200
// 0 <= strs[i].length <= 200
// strs[i] 仅由小写英文字母组成

/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function(strs) {
    if(!strs.length) return ''
    //先把数组的第一个当作答案 
    let ans = strs[0];
    //从下标1开始遍历 也就是数组的第二个元素
    for(var i = 1; i < strs.length ;i++){
        //遍历前一个字符串 与后一个字符串的 每一位字符 
        for(var j= 0; j < ans.length && j < strs[i].length; j++){
            // 不想等后 将字符串 从0 截取到j
            if(ans[j] != strs[i][j]){
                break;
            }
        }
        ans = ans.substr(0,j)
        //如果字符串是空的 说明没有相同的前缀 直接返回空即可满足题目要求
        if(ans === '')
        return ans
    }
    return ans
};