// https://leetcode.cn/problems/trapping-rain-water/solutions/692342/jie-yu-shui-by-leetcode-solution-tuvc/?envType=study-plan-v2&envId=top-interview-150


// 给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。

 

// 示例 1：



// 输入：height = [0,1,0,2,1,0,1,3,2,1,2,1]
// 输出：6
// 解释：上面是由数组 [0,1,0,2,1,0,1,3,2,1,2,1] 表示的高度图，在这种情况下，可以接 6 个单位的雨水（蓝色部分表示雨水）。 
// 示例 2：

// 输入：height = [4,2,0,3,2,5]
// 输出：9
 

//使用单调递减栈来求解 
var trap = function(height) {
    let ans = 0;
    const stack = [];
    const n = height.length;
    for (let i = 0; i < n; ++i) {
        //此条件维护单调递减栈 
        while (stack.length && height[i] > height[stack[stack.length - 1]]) {
            //栈顶元素为 坑或者说是能够容纳雨水的区域 
            const top = stack.pop()
            //控制栈中最少有两个元素 
            if (!stack.length) {
                break
            }
            //当取出栈顶元素后 此时栈中还有一个元素
            //此元素即为容器的左边
            const left = stack[stack.length - 1]
            //容器区域的宽度
            const currWidth = i - left - 1
            //height[i] 即为容器的右边 
            //取最小高度为容器的高
            //height[i] - height[top] 相当于是说 谁是容器的底 
            //相当于是 按照层来划分 计算雨水的容纳体积。
            const currHeight = Math.min(height[left], height[i]) - height[top]
            ans += currWidth * currHeight
        }
        stack.push(i)
    }
    return ans
}