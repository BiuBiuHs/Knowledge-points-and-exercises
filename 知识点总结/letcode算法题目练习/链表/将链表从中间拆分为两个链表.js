// 给定一个链表，需要把链表从中间拆分成长度相等的两半（如果链表长度为奇数，那么拆分之后，前半部分长度更长一点）。



//还是用双指针  寻找链表的中间节点

var deleteMiddle = function(head) {
    //需要注意这里的特殊条件 不满足直接返回null即可
    if(!head.next) return null
     function findMiddle (head) {
         let dummy = new ListNode()
         dummy.next = head
         let slow = head 
         let fast = head 
         //快指针每次走两步，慢指针 每次走一步 
         //当快指针不满足条件时 ，slow指针恰好指向中间节点 
         while(fast&&fast.next) {
            prev = slow 
            slow = slow.next 
            fast = fast.next.next
         }
         //奇数时 fast恰好指向最后一个节点
         //slow指向中间节点

         //偶数时 fast指向null
         //slow的前置节点 prev 是中间节点 
         return fast ? slow : prev 
     }

     const mid = findMiddle(head)
     const next = mid.next
    mid.next = null

     return [head,next]
};