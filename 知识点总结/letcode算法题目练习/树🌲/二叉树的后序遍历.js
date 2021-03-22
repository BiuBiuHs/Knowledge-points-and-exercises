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
  if (!root) return [];
  let res = [];
  let stack = [];
  let prev = null;
  while (stack.length || root) { //当栈中有值 或者root 不为null 继续遍历
    while (root) {  //先遍历 左子节点 
      stack.push(root);
      root = root.left; //遍历 左子节点 
    }
    root = stack.pop(); //所有的左子节点 入栈后 开始出栈
    if (!root.right || root.right == prev) { //如果没有右子树 或右子树 之前遍历过 
      res.push(root.val); //将刚才出栈的节点 val记录下来
      prev = root; //记录之前遍历的节点
      root = null; //将节点重置为null
    } else {
      stack.push(root); //如果有右子节点说明 还没有遍历完毕 将刚才pop出来的节点 继续入栈 
      root = root.right; //并且遍历它的右子节点
    }
  }
  return res;
};
