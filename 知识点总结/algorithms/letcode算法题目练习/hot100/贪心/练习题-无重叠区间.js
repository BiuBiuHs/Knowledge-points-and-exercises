/**
 * 435. 无重叠区间
 * https://leetcode.cn/problems/non-overlapping-intervals/
 * 
 * 题目：给定一个区间的集合 intervals，其中 intervals[i] = [starti, endi]。
 * 返回需要移除区间的最小数量，使剩余区间互不重叠。
 * 
 * 示例：
 * 输入：intervals = [[1,2],[2,3],[3,4],[1,3]]
 * 输出：1
 * 解释：移除 [1,3] 后，剩下的区间没有重叠。
 * 
 * 输入：intervals = [[1,2],[1,2],[1,2]]
 * 输出：2
 * 解释：你需要移除两个 [1,2] 来使剩下的区间没有重叠。
 * 
 * 输入：intervals = [[1,2],[2,3]]
 * 输出：0
 * 解释：你不需要移除任何区间，因为它们已经是无重叠的了。
 * 
 * 提示：
 * - 1 <= intervals.length <= 10^5
 * - intervals[i].length == 2
 * - -5 * 10^4 <= starti < endi <= 5 * 10^4
 */

/**
 * 方法1：贪心算法（按结束时间排序）
 * 
 * 核心思想：
 * 1. 按照区间的结束时间排序
 * 2. 贪心选择：总是选择结束时间最早的区间（这样可以为后续区间留出更多空间）
 * 3. 如果当前区间与已选择的区间重叠，则移除当前区间
 * 
 * 贪心策略：
 * - 按结束时间排序后，选择结束时间最早的区间
 * - 这样可以保证后续有更多的选择空间
 */
var eraseOverlapIntervals = function(intervals) {
    if (intervals.length === 0) return 0;
    
    // 1. 按照区间的结束时间排序
    intervals.sort((a, b) => a[1] - b[1]);
    
    let count = 0;        // 需要移除的区间数量
    let prevEnd = intervals[0][1];  // 前一个保留区间的结束时间
    
    // 2. 遍历区间，贪心选择
    for (let i = 1; i < intervals.length; i++) {
        let current = intervals[i];
        
        // 如果当前区间与前一个保留区间重叠
        if (current[0] < prevEnd) {
            // 移除当前区间（计数加1）
            count++;
        } else {
            // 保留当前区间，更新前一个保留区间的结束时间
            prevEnd = current[1];
        }
    }
    
    return count;
};

// 测试
console.log("=== 无重叠区间问题 ===");
console.log("输入：intervals = [[1,2],[2,3],[3,4],[1,3]]");
console.log("输出：", eraseOverlapIntervals([[1,2],[2,3],[3,4],[1,3]]));
console.log("期望：1");

console.log("\n输入：intervals = [[1,2],[1,2],[1,2]]");
console.log("输出：", eraseOverlapIntervals([[1,2],[1,2],[1,2]]));
console.log("期望：2");

console.log("\n输入：intervals = [[1,2],[2,3]]");
console.log("输出：", eraseOverlapIntervals([[1,2],[2,3]]));
console.log("期望：0");

/**
 * ============================================
 * 算法执行过程详解（以 intervals = [[1,2],[2,3],[3,4],[1,3]] 为例）
 * ============================================
 * 
 * 排序后（按结束时间）：intervals = [[1,2],[2,3],[1,3],[3,4]]
 * 
 * 执行过程：
 * 
 * 初始：prevEnd = intervals[0][1] = 2, count = 0
 * 
 * i = 1: current = [2,3]
 *   current[0] = 2 >= prevEnd = 2 ✅ 不重叠
 *   prevEnd = 3
 *   count = 0
 * 
 * i = 2: current = [1,3]
 *   current[0] = 1 < prevEnd = 3 ❌ 重叠
 *   count = 1（移除 [1,3]）
 *   prevEnd = 3（不变）
 * 
 * i = 3: current = [3,4]
 *   current[0] = 3 >= prevEnd = 3 ✅ 不重叠（边界情况：相等不算重叠）
 *   prevEnd = 4
 *   count = 1
 * 
 * 最终结果：count = 1
 */

/**
 * ============================================
 * 贪心策略证明
 * ============================================
 * 
 * 【为什么按结束时间排序？】
 * 
 * 如果我们按开始时间排序，可能会选择开始时间早但结束时间晚的区间，
 * 这样会占用更多的时间，导致后续区间无法选择。
 * 
 * 按结束时间排序，我们总是选择结束时间最早的区间，这样可以：
 * - 为后续区间留出更多的时间空间
 * - 最大化保留的区间数量
 * 
 * 【贪心选择性质】
 * 
 * 假设存在一个最优解，其中选择的第一个区间不是结束时间最早的。
 * 
 * 设最优解选择的第一个区间是 [a, b]，结束时间最早的区间是 [c, d]（d < b）。
 * 
 * 如果 [c, d] 与后续区间不冲突，那么可以用 [c, d] 替换 [a, b]：
 * - [c, d] 结束时间更早，为后续区间留出更多空间
 * - 替换后的解不会更差
 * 
 * 如果 [c, d] 与后续区间冲突，那么 [a, b] 也会冲突（因为 d < b），矛盾。
 * 
 * 所以，总是选择结束时间最早的区间是最优的。
 * 
 * 【最优子结构】
 * 
 * 如果前 i 个区间的最优解是保留 count 个区间，那么前 i+1 个区间的最优解
 * 可以通过前 i 个区间的最优解和 intervals[i] 得到。
 */

/**
 * ============================================
 * 方法2：按开始时间排序（对比，不推荐）
 * ============================================
 * 
 * 如果按开始时间排序，需要反向思考：
 * - 从后往前遍历
 * - 选择开始时间最晚的区间
 */
var eraseOverlapIntervals2 = function(intervals) {
    if (intervals.length === 0) return 0;
    
    // 按开始时间排序（降序）
    intervals.sort((a, b) => b[0] - a[0]);
    
    let count = 0;
    let prevStart = intervals[0][0];
    
    for (let i = 1; i < intervals.length; i++) {
        let current = intervals[i];
        
        if (current[1] > prevStart) {
            count++;
        } else {
            prevStart = current[0];
        }
    }
    
    return count;
};

/**
 * ============================================
 * 方法3：计算最多保留的区间数（等价问题）
 * ============================================
 * 
 * 问题等价于：最多能保留多少个不重叠的区间？
 * 答案 = 总区间数 - 最多保留的区间数
 */
var eraseOverlapIntervals3 = function(intervals) {
    if (intervals.length === 0) return 0;
    
    intervals.sort((a, b) => a[1] - b[1]);
    
    let count = 1;  // 至少可以保留第一个区间
    let prevEnd = intervals[0][1];
    
    for (let i = 1; i < intervals.length; i++) {
        let current = intervals[i];
        
        if (current[0] >= prevEnd) {
            count++;
            prevEnd = current[1];
        }
    }
    
    return intervals.length - count;
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
 * 空间复杂度：O(1)
 * - 只使用了常数额外空间（如果允许修改原数组）
 * - 或者 O(n)（如果需要创建新数组）
 */

