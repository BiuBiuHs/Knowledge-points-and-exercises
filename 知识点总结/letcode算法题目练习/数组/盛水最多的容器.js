
// https://leetcode-cn.com/problems/container-with-most-water/
// 给你 n 个非负整数 a1，a2，...，an，每个数代表坐标中的一个点 (i, ai) 。在坐标内画 n 条垂直线，垂直线 i 的两个端点分别为 (i, ai) 和 (i, 0) 。找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。

// 说明：你不能倾斜容器。

//  

// 示例 1：



// 输入：[1,8,6,2,5,4,8,3,7]
// 输出：49 
// 解释：图中垂直线代表输入数组 [1,8,6,2,5,4,8,3,7]。在此情况下，容器能够容纳水（表示为蓝色部分）的最大值为 49。
// 示例 2：

// 输入：height = [1,1]
// 输出：1
// 示例 3：

// 输入：height = [4,3,2,1,4]
// 输出：16
// 示例 4：

// 输入：height = [1,2,1]
// 输出：2
//  

// 提示：

// n == height.length
// 2 <= n <= 105
// 0 <= height[i] <= 104

//题解 

// 在初始时，左右指针分别指向数组的左右两端，它们可以容纳的水量为min(1,7)∗8=8

// 此时我们需要移动一个指针。移动哪一个呢？直觉告诉我们，应该移动对应数字较小的那个指针（即此时的左指针）。这是因为，由于容纳的水量是由
// 两个指针指向的数字中较小值∗指针之间的距离
// 决定的。如果我们移动数字较大的那个指针，那么前者「两个指针指向的数字中较小值」不会增加，后者「指针之间的距离」会减小，那么这个乘积会减小。因此，我们移动数字较大的那个指针是不合理的。因此，我们移动 数字较小的那个指针。


//使用双指针 比较左右指针指向的值 谁更小 则谁+1 或-1 也就是移动一位 
/**
 * @param {number[]} height
 * @return {number}
 */


//方法一：双指针
 var maxArea = function(height) {
    let maxArea = 0
    let left = 0; let right = height.length -1 //左右指针 
      while(left<right){ 
            let currentArea = Math.min(height[left],height[right]) * (right -left) //右指针减去 左指针 就是宽度  左右指针更小的值 决定容器的高度 决定容器的容积
    
               maxArea = Math.max(currentArea, maxArea) //每次都计算容积 保留最大的体积 作为结果 
               if(height[left] <= height[right]){ //比较左右指针指向的值 谁更小 则谁+1 或-1 也就是移动一位 
                   ++left
               }else{
                   --right         
                }
            }
    return maxArea
    
    
    };