// https://leetcode.cn/problems/rotate-list/description/?envType=study-plan-v2&envId=top-interview-150


// 给你一个链表的头节点 head ，旋转链表，将链表每个节点向右移动 k 个位置。
// 输入：head = [1,2,3,4,5], k = 2
// 输出：[4,5,1,2,3]


//思路
// 记给定链表的长度为 n，注意到当向右移动的次数 k≥n 时，我们仅需要向右移动 k mod n 次即可。因为每 n次移动都会让链表变为原状。
// 这样我们可以知道，新链表的最后一个节点为原链表的第 (n−1)−(k mod n) 个节点（从 0 开始计数）。

// 这样，我们可以先将给定的链表连接成环，然后将指定位置断开。

// 具体代码中，我们首先计算出链表的长度 n，并找到该链表的末尾节点，将其与头节点相连。这样就得到了闭合为环的链表。
// 然后我们找到新链表的最后一个节点（即原链表的第 (n−1)−(k mod n)个节点），将当前闭合为环的链表断开，即可得到我们所需要的结果。

// 特别地，当链表长度不大于 1，或者 k 为 n 的倍数时，新链表将与原链表相同，我们无需进行任何处理。


/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */
var rotateRight = function(head, k) {
    //及时终止循环或遍历
    if (k === 0 || !head || !head.next) {
        return head;
    }

    let count = 1
    let cur = head 
    //统计链表节点个数 
    while(cur.next) {
        cur = cur.next
        count++
    }
    //计算 要断开的位置
    const add = count - k % count
  
    // 如果是链表的整数倍说明不用对链表进行任何操作
      if(add == count) return head 
  
      //首尾相连 成环
      cur.next = head 
      //用计算出来的位置 进行遍历 
      while(add) {
          cur = cur.next
          add--
      }
      //断开链表 返回结果即可
      const back = cur.next 
      cur.next = null
      return back
  };