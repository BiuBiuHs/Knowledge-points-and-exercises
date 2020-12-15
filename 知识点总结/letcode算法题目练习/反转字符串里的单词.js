/**
 * https://leetcode-cn.com/problems/reverse-words-in-a-string/comments/
 * @param {string} s
 * @return {string}
 */
var reverseWords = function(s) {
    let arrS = s.trim().split(' ')
    let result = []
    for(var i = arrS.length-1; i>=0; i--){
        result.push(arrS[i])
    }
   result =  result.filter((e)=>e!=='')
    return result.join(' ')
};