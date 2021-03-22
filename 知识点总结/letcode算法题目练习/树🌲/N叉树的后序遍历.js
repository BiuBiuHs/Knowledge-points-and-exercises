// 链接：https://leetcode-cn.com/problems/n-ary-tree-postorder-traversal
// 给定一个 N 叉树，返回其节点值的后序遍历。

// 例如，给定一个 3叉树 :

//

//

// 返回其后序遍历: [5,6,3,2,4,1].

//

// 说明: 递归法很简单，你可以使用迭代法完成此题吗?

/**
 * // Definition for a Node.
 * function Node(val,children) {
 *    this.val = val;
 *    this.children = children;
 * };
 */
// 递归法
/**
 * @param {Node} root
 * @return {number[]}
 */
var postorder = function (root) {
  let array = [];
  var dfs = function (node) {
    if (node === null) return;
    for (let i = 0; i < node.children.length; i++) {
      dfs(node.children[i]);
    }
    array.push(node.val);
    return;
  };
  dfs(root);
  return array;
};

//迭代法 后序遍历N叉树

/**
 * // Definition for a Node.
 * function Node(val,children) {
 *    this.val = val;
 *    this.children = children;
 * };
 */

/**
 * @param {Node} root
 * @return {number[]}
 */
var postorder = function (root) {
  if (root === null) return [];
  let treeArray = [];
  let stack = [root];
  while (stack.length) {
    let node = stack.pop();
    if (node.children.length > 0) {
      stack = stack.concat(node.children);
    }
    treeArray.unshift(node.val);
  }
  return treeArray;
};
