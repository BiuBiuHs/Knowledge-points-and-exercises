/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
//广度优先遍历 在临时栈中存放所有的后序节点 
//在queue中存放当前层的节点 
/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function (root) {
  if (!root) return 0;
  let stack = [root];
  let res = 0;
  while (stack.length) {
    let temp = [];
    while (stack.length) {
      let cur = stack.pop();
      if (cur && cur.left) temp.push(cur.left);
      if (cur && cur.right) temp.push(cur.right);
    }
    stack = temp; //每次当前层遍历完成 将下一层的节点放入 
    ++res; //深度+1
  }
  return res;
};

//递归 二叉树的后序遍历
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function (root) {
  if (root == null) return 0;
  return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
};
