// 链接：https://leetcode-cn.com/problems/valid-parentheses

// 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。

// 有效字符串需满足：

// 左括号必须用相同类型的右括号闭合。
// 左括号必须以正确的顺序闭合。
//

// 示例 1：

// 输入：s = "()"
// 输出：true
// 示例 2：

// 输入：s = "()[]{}"
// 输出：true
// 示例 3：

// 输入：s = "(]"
// 输出：false
// 示例 4：

// 输入：s = "([)]"
// 输出：false
// 示例 5：

// 输入：s = "{[]}"
// 输出：true
//

// 提示：

// 1 <= s.length <= 104
// s 仅由括号 '()[]{}' 组成

// 这是一个经典的括号匹配问题，我们可以使用栈来解决。以下是 JavaScript 实现和详细解释：

/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
	const stack = []
	const bracketMap = {
		')': '(',
		'}': '{',
		']': '[',
	}

	for (let char of s) {
		if (!bracketMap[char]) {
			// 如果是开括号，入栈
			stack.push(char)
		} else {
			// 如果是闭括号
			if (
				stack.length === 0 ||
				stack[stack.length - 1] !== bracketMap[char]
			) {
				return false
			}
			stack.pop()
		}
	}

	// 检查栈是否为空
	return stack.length === 0
}

// 测试
console.log(isValid('()')) // true
console.log(isValid('()[]{}')) // true
console.log(isValid('(]')) // false
console.log(isValid('([)]')) // false
console.log(isValid('{[]}')) // true

// 算法解释：

// 1. 我们使用一个栈来存储开括号。

// 2. 创建一个映射 `bracketMap`，用于快速查找闭括号对应的开括号。

// 3. 遍历字符串中的每个字符：

//    - 如果是开括号（'(', '{', '['），直接入栈。

//    - 如果是闭括号（')', '}', ']'）：
//      - 检查栈是否为空。如果为空，说明没有匹配的开括号，返回 false。
//      - 检查栈顶元素是否与当前闭括号匹配。如果不匹配，返回 false。
//      - 如果匹配，将栈顶元素弹出（消除一对匹配的括号）。

// 4. 遍历完成后，检查栈是否为空：
//    - 如果栈为空，说明所有括号都匹配，返回 true。
//    - 如果栈不为空，说明有未匹配的开括号，返回 false。

// 算法复杂度：

// - 时间复杂度：O(n)，其中 n 是字符串的长度。我们只需要遍历字符串一次。
// - 空间复杂度：O(n)，在最坏情况下（例如 "((((("），我们需要将所有字符都推入栈中。

// 这个解法的优点：

// 1. 简洁高效：使用栈可以很自然地处理括号的嵌套结构。
// 2. 易于扩展：如果需要增加新的括号类型，只需在 `bracketMap` 中添加新的键值对。
// 3. 提前返回：在发现无效情况时立即返回 false，不需要处理整个字符串。

// 这种使用栈的方法是解决括号匹配问题的标准做法，也是很多其他字符串处理问题的基础。理解这个算法对于掌握栈的应用非常有帮助。
