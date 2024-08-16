// https://leetcode.cn/problems/reorder-list/description/

// 给定一个单链表 L 的头节点 head ，单链表 L 表示为：

// L0 → L1 → … → Ln - 1 → Ln
// 请将其重新排列后变为：

// L0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → …
// 不能只是单纯的改变节点内部的值，而是需要实际的进行节点交换。

 

// 示例 1：



// 输入：head = [1,2,3,4]
// 输出：[1,4,2,3]
// 示例 2：



// 输入：head = [1,2,3,4,5]
// 输出：[1,5,2,4,3]
 

// 提示：

// 链表的长度范围为 [1, 5 * 104]
// 1 <= node.val <= 1000



//寻找链表中间的节点 
function findMid (head) {
    const dummy = new ListNode()
    dummy.next = head
    let slow = head
    let fast = head 
    let prev = null
    while(fast&&fast.next) {
        prev = slow
        slow = slow.next
        fast = fast.next.next
    }

    return fast ? slow : prev
}

//反转链表 
function reverse (list) {
    const dummy = new ListNode()
    let cur = dummy 
    while(list) {
        const back = list.next
        list.next = cur.next
        cur.next = list
        list = back
    }
    return dummy.next

}

var reorderList = function(head) {


let mid = findMid(head)
let back = mid.next 
mid.next = null;

let reverseBack = reverse(back)

 const dummy = new ListNode()
 let curPoint = dummy
 let left = head 
 let right = reverseBack

 console.log(left,'left')
 console.log(right,'right')

 //两条链表按顺序取元素连接到新链表上
 while(left&&right) {
    //此处冗余逻辑见下方改写 
     const leftBack = left.next
     const rightBack = right.next
     left.next = right
     curPoint.next = left 
     curPoint = right 
     right = rightBack
     left = leftBack
 }

 curPoint.next = left ? left :null 

return dummy.next


//改写更简洁的方式 
while(left && right ) {
    //保存后置节点 
    let leftBack = left.next 
    let rightBack = right.next 

    /**
     *  1.取出两个链表的第一个节点按照规则连接
     *  2.连接后 立即移动指针道下一个节点 也就是后置及诶单
     *  即可免去上方的写法 
     */
    left.next = right 
    left = leftBack

    right.next = left 
    right = rightBack
}




};