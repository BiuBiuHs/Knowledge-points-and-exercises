/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
//递归
var postorderTraversal = function (root) {
  let res = [];
  var dfs = function (node) {
    if (!node) return null;
    dfs(node.left);
    dfs(node.right);
    res.push(node.val);
  };
  dfs(root);
  return res;
};

//迭代
var postorderTraversal = function (root) {
  let res = [];
  let stack = [];
  let prev = null;
  if (!root) return res;
  while (stack.length || root) {
    while (root) {
      stack.push(root);
      root = root.left;
    }
    root = stack.pop();
    if (!root.right || root.right == prev) {
      res.push(root.val);
      prev = root;
      root = null;
    } else {
      stack.push(root);
      root = root.right;
    }
  }
  return res;
};
