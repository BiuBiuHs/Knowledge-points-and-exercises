// https://leetcode.cn/problems/swap-nodes-in-pairs/


/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
//递归
var swapPairs = function(head) {
if(head === null || head.next === null){
    return head;
}
//两两节点 进行递归
const newHead = head.next;
head.next = swapPairs(newHead.next)
newHead.next = head;
return newHead 
};

//迭代 利用链表进行节点交换
var swapPairs = function(head) {
    let dummyHead = new ListNode(0)
    dummyHead.next = head 
    let temp = dummyHead;
    while(temp.next !== null && temp.next.next!==null){
        const node1 = temp.next
        const node2 = temp.next.next;
        temp.next = node2
        node1.next = node2.next
        node2.next = node1;
        temp = node1
    }
    return dummyHead.next
    
    };