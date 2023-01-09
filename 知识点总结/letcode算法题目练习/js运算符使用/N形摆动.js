// https://leetcode.cn/problems/reverse-integer/description/?q=javascript&orderBy=most_relevant

// 给你一个 32 位的有符号整数 x ，返回将 x 中的数字部分反转后的结果。

// 如果反转后整数超过 32 位的有符号整数的范围 [−231,  231 − 1] ，就返回 0。

// 假设环境不允许存储 64 位整数（有符号或无符号）。
 

// 示例 1：

// 输入：x = 123
// 输出：321
// 示例 2：

// 输入：x = -123
// 输出：-321
// 示例 3：

// 输入：x = 120
// 输出：21
// 示例 4：

// 输入：x = 0
// 输出：0
 

// 提示：

// -231 <= x <= 231 - 1

//题解及解释
// result * 10 + x % 10 取出末位 x % 10（负数结果还是负数，无需关心正负），拼接到 result 中。
// x / 10 去除末位，| 0 强制转换为32位有符号整数。
// 通过 | 0 取整，无论正负，只移除小数点部分（正数向下取整，负数向上取整）。
// result | 0 超过32位的整数转换结果不等于自身，可用作溢出判断。
// 运算过程:

// x	result
// 123	0
// 12	3
// 1	32
// 0	321


/**
 * @param {number} x
 * @return {number}
 */
var reverse = function(x) {
    let result = 0;
    while(x !== 0) {
        result = result * 10 + x % 10;
        x = (x / 10) | 0;
    }
    return (result | 0) === result ? result : 0;
};

