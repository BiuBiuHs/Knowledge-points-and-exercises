// https://leetcode.cn/problems/sliding-window-maximum/
// 给你一个整数数组 nums，有一个大小为 k 的滑动窗口从数组的最左侧移动到数组的最右侧。
// 你只可以看到在滑动窗口内的 k 个数字。滑动窗口每次只向右移动一位。

// 返回 滑动窗口中的最大值 。


// 示例 1：

// 输入：nums = [1,3,-1,-3,5,3,6,7], k = 3
// 输出：[3,3,5,5,6,7]
// 解释：
// 滑动窗口的位置                最大值
// ---------------               -----
// [1  3  -1] -3  5  3  6  7       3
//  1 [3  -1  -3] 5  3  6  7       3
//  1  3 [-1  -3  5] 3  6  7       5
//  1  3  -1 [-3  5  3] 6  7       5
//  1  3  -1  -3 [5  3  6] 7       6
//  1  3  -1  -3  5 [3  6  7]      7
// 示例 2：

// 输入：nums = [1], k = 1
// 输出：[1]



/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var maxSlidingWindow = function(nums, k) {
    const queue = []
    const ans =[]
  const enqueue =function (val)  {
    //使用单调递减队列 来维护最大值
      while(queue.length && queue[queue.length -1] < val){
          queue.pop()
      }
      queue.push(val)
  }

  //出队时机 是保证当前元素与对头元素相等时出队 
  //由于单调递减队列的性质导致 队头头一定是最大的元素 
  //下方就是单调递减队
  //eg：【9，8，6】
  const dequeue = function  (val) {
    //要注意这里出栈每次只会弹出一个元素 且需要是最大的元素才会出栈
      if(queue.length && val == queue[0]){
          queue.shift()
      }
  }
  for(var i =0; i < nums.length; i++) {
      var cur = nums[i]
      enqueue(cur)
      //保证队中有k 个元素 （因为元素 可能由于单调递减队的特性 导致不再队列中）
      if(i < k - 1) {
          continue;
      }
      //将队头元素放到 暂时的答案当中 ，即为当前区域最大的元素
      ans.push(queue[0])
      //为什么取值为 i - k +1 
      //因为当A[i]时 进队必须要保证 A【i-k】个元素出队 这样才能保证队列中的元素最多有 k 个。
      dequeue( nums[i - k +1])

  }
  return ans 
 };