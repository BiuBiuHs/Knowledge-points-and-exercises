


//官方题解
// 使用标准回溯 需要将元素删除
/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function(n) {
    let ans = []
    var dfs = (str,left,right,ans,n )=>{
            if(str.length === 2*n){
                ans.push(str.join(''))
                return 
            }
            if(left < n){
                str.push('(')
                dfs(str,left+1,right,ans,n);
                str.length = str.length - 1
            }
            if(left > right){
                str.push(')');
                dfs(str,left,right + 1,ans,n)
                str.length = str.length - 1
            }
    } 
     dfs([],0,0,ans,n)
     return ans
};

//回溯算法。
function backtrack(ans,cur, left, right, n) {
    if(cur.length == n *2) {
        ans.push(cur.toString());
        return
    }

    if(left < n) {
        cur.push('(')
        backtrack(ans,cur,left + 1, right , n)
        cur.pop()
    }
    if(right < left){
        cur.push(')')
        backtrack(ans,cur,left, right +1, n)
        cur.pop()
    }
}


/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function(n) {
    const result = []
    generate(result ,'', 0, 0, n);
    return result;
};


//js巧妙解
var generateParenthesis = function(n) {
    let ans = []
    var dfs = (left,right,str )=>{
            if(str.length === 2 * n){
                ans.push(str)
                return 
            }
            //利用必须先选左括号 剪掉了以右括号 为首的非法字符组合路径
            if(left > 0){
                //利用不改变 str 来进行回溯
                dfs(left -1 ,right,str + '(');
            }
            //此处不能使用 left--替代 left -1 会导致当前作用域的left重新赋值，影响剪枝
            //
            if(left < right){
                dfs(left  ,right - 1,str + ')');
            }
    } 
     dfs(n,n,'')
     return ans
};


