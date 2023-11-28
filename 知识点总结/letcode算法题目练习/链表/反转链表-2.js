// https://leetcode.cn/problems/reverse-linked-list-ii/?envType=study-plan-v2&envId=top-interview-150
// 给你单链表的头指针 head 和两个整数 left 和 right ，其中 left <= right 。请你反转从位置 left 到位置 right 的链表节点，返回 反转后的链表 。

// 输入：head = [1,2,3,4,5], left = 2, right = 4
// 输出：[1,4,3,2,5]


/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} left
 * @param {number} right
 * @return {ListNode}
 */
var reverseBetween = function(head, left, right) {
    const dummy = new ListNode()
    let tail  =  dummy
    let prev = dummy
    let count = 1
    while(head) {
        const back = head.next
        if(left <= count && count <= right) {
            if(left === count ) tail = head
            head.next = prev.next 
            prev.next = head 
            head = back
        }else{
            tail.next = head 
            tail = tail.next 
            head = back 
            prev = tail 
    
        }
        count++
    }
    //一定要将尾部 设置为null
    tail.next = null
    
    return dummy.next
    };