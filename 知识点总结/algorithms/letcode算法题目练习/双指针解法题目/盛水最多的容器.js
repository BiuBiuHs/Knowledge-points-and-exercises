
// https://leetcode.cn/problems/container-with-most-water/description/


// 给定一个长度为 n 的整数数组 height 。有 n 条垂线，第 i 条线的两个端点是 (i, 0) 和 (i, height[i]) 。

// 找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。

// 返回容器可以储存的最大水量。

// 说明：你不能倾斜容器。




function maxArea (height) {

    let area = 0

    const left = 0
    const right = height.length -1

    while(left <= right) {
         area = Math.max(area,Math.min(height[left] ,height[right]) * (right -left))

         if(height[left] <= height[right]) {
            left++
         }else{
            right--
         }

    }

    return area

}