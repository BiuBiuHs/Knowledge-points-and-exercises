/**
 * 56. 合并区间
 * https://leetcode.cn/problems/merge-intervals/
 * 
 * 题目：以数组 intervals 表示若干个区间的集合，其中单个区间为 intervals[i] = [starti, endi]。
 * 请你合并所有重叠的区间，并返回一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间。
 * 
 * 示例：
 * 输入：intervals = [[1,3],[2,6],[8,10],[15,18]]
 * 输出：[[1,6],[8,10],[15,18]]
 * 解释：区间 [1,3] 和 [2,6] 重叠, 将它们合并为 [1,6]。
 * 
 * 输入：intervals = [[1,4],[4,5]]
 * 输出：[[1,5]]
 * 解释：区间 [1,4] 和 [4,5] 可被视为重叠区间。
 * 
 * 提示：
 * - 1 <= intervals.length <= 10^4
 * - intervals[i].length == 2
 * - 0 <= starti <= endi <= 10^4
 */

/**
 * 方法1：贪心算法（排序 + 合并）
 * 
 * 核心思想：
 * 1. 按照区间的起始位置排序
 * 2. 遍历区间，如果当前区间与前一个区间重叠，则合并
 * 3. 如果不重叠，则添加新区间
 * 
 * 贪心策略：
 * - 按起始位置排序后，只需要考虑相邻区间是否重叠
 * - 如果重叠，总是合并到当前已知的最右边界（贪心选择）
 */
var merge = function(intervals) {
    // 1. 按照区间的起始位置排序
    intervals.sort((a, b) => a[0] - b[0]);
    
    let result = [];
    let prev = intervals[0];  // 前一个区间
    
    // 2. 遍历区间，合并重叠的区间
    for (let i = 1; i < intervals.length; i++) {
        let current = intervals[i];
        
        // 判断是否重叠：当前区间的起始位置 <= 前一个区间的结束位置
        if (current[0] <= prev[1]) {
            // 重叠：合并区间（贪心选择：取最大的结束位置）
            prev[1] = Math.max(prev[1], current[1]);
        } else {
            // 不重叠：添加前一个区间，更新 prev
            result.push(prev);
            prev = current;
        }
    }
    
    // 3. 添加最后一个区间
    result.push(prev);
    
    return result;
};

// 测试
console.log("=== 合并区间问题 ===");
console.log("输入：intervals = [[1,3],[2,6],[8,10],[15,18]]");
console.log("输出：", merge([[1,3],[2,6],[8,10],[15,18]]));
console.log("期望：[[1,6],[8,10],[15,18]]");

console.log("\n输入：intervals = [[1,4],[4,5]]");
console.log("输出：", merge([[1,4],[4,5]]));
console.log("期望：[[1,5]]");

/**
 * ============================================
 * 算法执行过程详解（以 intervals = [[1,3],[2,6],[8,10],[15,18]] 为例）
 * ============================================
 * 
 * 排序后：intervals = [[1,3],[2,6],[8,10],[15,18]]
 * 
 * 执行过程：
 * 
 * 初始：prev = [1,3], result = []
 * 
 * i = 1: current = [2,6]
 *   current[0] = 2 <= prev[1] = 3 ✅ 重叠
 *   prev[1] = max(3, 6) = 6
 *   prev = [1,6]
 * 
 * i = 2: current = [8,10]
 *   current[0] = 8 > prev[1] = 6 ❌ 不重叠
 *   result.push([1,6])
 *   prev = [8,10]
 * 
 * i = 3: current = [15,18]
 *   current[0] = 15 > prev[1] = 10 ❌ 不重叠
 *   result.push([8,10])
 *   prev = [15,18]
 * 
 * 循环结束，result.push([15,18])
 * 
 * 最终结果：[[1,6],[8,10],[15,18]]
 */

/**
 * ============================================
 * 贪心策略证明
 * ============================================
 * 
 * 【为什么按起始位置排序？】
 * 
 * 排序后，如果两个区间重叠，它们一定是相邻的（或已经合并）。
 * 这样我们只需要考虑相邻区间，简化了问题。
 * 
 * 【贪心选择性质】
 * 
 * 假设当前区间是 [a, b]，下一个区间是 [c, d]。
 * 如果 c <= b（重叠），我们需要合并。
 * 
 * 贪心策略：合并后的区间是 [a, max(b, d)]。
 * 
 * 证明：如果存在一个更优的合并方式，比如 [a, k] (k < max(b, d))，
 * 那么：
 * - 如果 k < d，那么区间 [c, d] 没有被完全覆盖，矛盾
 * - 如果 k < b，那么区间 [a, b] 没有被完全覆盖，矛盾
 * 
 * 所以 max(b, d) 是最优选择。
 * 
 * 【最优子结构】
 * 
 * 如果前 i 个区间的最优合并是 result，那么前 i+1 个区间的最优合并
 * 可以通过 result 和 intervals[i] 合并得到。
 */

/**
 * ============================================
 * 方法2：使用结果数组直接操作
 * ============================================
 */
var merge2 = function(intervals) {
    if (intervals.length === 0) return [];
    
    intervals.sort((a, b) => a[0] - b[0]);
    
    let result = [intervals[0]];
    
    for (let i = 1; i < intervals.length; i++) {
        let current = intervals[i];
        let last = result[result.length - 1];
        
        if (current[0] <= last[1]) {
            // 重叠：合并
            last[1] = Math.max(last[1], current[1]);
        } else {
            // 不重叠：添加新区间
            result.push(current);
        }
    }
    
    return result;
};

/**
 * ============================================
 * 时间复杂度与空间复杂度
 * ============================================
 * 
 * 时间复杂度：O(n log n)
 * - 排序：O(n log n)
 * - 遍历：O(n)
 * - 总时间：O(n log n)
 * 
 * 空间复杂度：O(1) 或 O(n)
 * - 如果允许修改原数组：O(1)
 * - 如果不允许修改原数组：O(n)（存储结果）
 */

