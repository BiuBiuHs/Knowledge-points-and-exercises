// https://leetcode-cn.com/problems/verify-preorder-serialization-of-a-binary-tree/submissions/

// 序列化二叉树的一种方法是使用前序遍历。当我们遇到一个非空节点时，我们可以记录下这个节点的值。如果它是一个空节点，我们可以使用一个标记值记录，例如 #。

//      _9_
//     /   \
//    3     2
//   / \   / \
//  4   1  #  6
// / \ / \   / \
// # # # #   # #
// 例如，上面的二叉树可以被序列化为字符串 "9,3,4,#,#,1,#,#,2,#,6,#,#"，其中 # 代表一个空节点。

// 给定一串以逗号分隔的序列，验证它是否是正确的二叉树的前序序列化。编写一个在不重构树的条件下的可行算法。

// 每个以逗号分隔的字符或为一个整数或为一个表示 null 指针的 '#' 。

// 你可以认为输入格式总是有效的，例如它永远不会包含两个连续的逗号，比如 "1,,3" 。

// 示例 1:

// 输入: "9,3,4,#,#,1,#,#,2,#,6,#,#"
// 输出: true
// 示例 2:

// 输入: "1,#"
// 输出: false
// 示例 3:

// 输入: "9,#,#,1"
// 输出: false

/**
 * @param {string} preorder
 * @return {boolean}
 */
var isValidSerialization = function (preorder) {
  let n = preorder.length; //获取字符串长度
  let i = 0; //从字符串的第一位开始遍历 下标为0
  let stack = [1]; //先在栈中放入根结点 的数量为 1
  while (i < n) {
    //遍历字符串
    if (!stack.length) {
      //如果字符串还未遍历完成 栈中却没有元素 代表 没有前驱节点 无法成功组成二叉树
      return false;
    }

    if (preorder[i] === ",") {
      ++i;
    } else if (preorder[i] == "#") {
      //空元素 消耗一个长度 ，并且不向栈中添加节点 因为没有子节点
      stack[stack.length - 1]--;
      if (stack[stack.length - 1] == 0) {
        stack.pop();
      }
      ++i;
    } else {
      while (i < n && preorder[i] !== ",") {
        //但遍历到一个数字时 消耗一个长度 ，此节点有两个子节点 因此向栈中放入2 ，代表有两个子节点
        ++i;
      }
      stack[stack.length - 1]--;
      if (stack[stack.length - 1] == 0) {
        //当最后的元素 为0 时代表 该节点遍历完成，出栈
        stack.pop();
      }
      stack.push(2); //向栈内放入元素
      ++i; //继续遍历
    }
  }
  return stack.length == 0; //最后判断栈中是否有元素即可 有元素说明没有组成二叉树，返回false ，无元素 则标示组成了二叉树，返回true
};
