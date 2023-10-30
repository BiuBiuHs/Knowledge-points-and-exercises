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
    //创建新节点 0 当作初始节点
    let dummyHead = new ListNode(0)
    //与原来的链表 相连
    dummyHead.next = head
    //相当于指针 指向当前的的头节点  
    let temp = dummyHead;
    //需要判断当前节点的后两个节点是否存在 才能够进行节点反转
    while(temp.next !== null && temp.next.next!==null){
        //取到后两个节点
        const node1 = temp.next
        const node2 = temp.next.next;
        //进行节点交换 
        //先链接 头
        temp.next = node2
        //再连接尾部节点
        node1.next = node2.next
        //最后连接中间节点 
        node2.next = node1;
        //将指针移向反转完成后的节点 
        temp = node1
    }
    return dummyHead.next
    
    };