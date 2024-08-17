// https://leetcode.cn/problems/remove-duplicates-from-sorted-list/
// 给定一个已排序的链表的头 head ， 删除所有重复的元素，使每个元素只出现一次 。返回 已排序的链表 。

 

// 示例 1：


// 输入：head = [1,1,2]
// 输出：[1,2]
// 示例 2：


// 输入：head = [1,1,2,3,3]
// 输出：[1,2,3]
 

// 提示：

// 链表中节点数目在范围 [0, 300] 内
// -100 <= Node.val <= 100
// 题目数据保证链表已经按升序 排列


//解题思路

//1.创建伪头节点 
//2.创建指针 指向头节点 
//3.向新创建的链表 按照顺序插入节点
//4.插入的条件就是 新链表的尾部节点值与当前节点的值不一致
//5.最后别忘了将 尾部加入null节点值
//6.返回dummy节点的next 即可
var deleteDuplicates = function(head) {
    const dummy = new ListNode(null)
    let slow = dummy
    while(head ) {
        //这一步很重要
         const next = head.next
         //此处为什么不用 head.val !== head.next.val 
         //因为head.next 可能为null 会报错
        if(slow.val!= head.val) {
            slow.next = head
            slow = slow.next 
        }
        //重新给head赋值 
         head = next
        
    }
    slow.next = null
    return dummy.next
    
   };
   
   