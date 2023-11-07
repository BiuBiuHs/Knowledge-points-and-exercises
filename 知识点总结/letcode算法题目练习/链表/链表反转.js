// https://leetcode-cn.com/problems/reverse-linked-list/submissions/
/**
 * 
 206. 反转链表
反转一个单链表。

示例:

输入: 1->2->3->4->5->NULL
输出: 5->4->3->2->1->NULL
进阶:
你可以迭代或递归地反转链表。你能否用两种方法解决这道题？
 */

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
//迭代
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
 var reverseList = function(head) {
    let curr = head
    let prev = null 
    while(curr){
        const next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev
};
//使用假头进行反转 
var rerverse = function (head) {
    const dummy = new ListNode()
    while(head) {
        const back = head.next;
        head.next  = dummy.next 
        dummy.next = head
        head = back
    }
    return dummy.next
}

//递归

var reverseList = function(head) {
    if (head == null || head.next == null) {
        return head;
    }
    const newHead = reverseList(head.next);
    head.next.next = head;
    head.next = null;
    return newHead;
};


