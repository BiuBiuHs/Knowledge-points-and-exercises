// https://leetcode.cn/problems/merge-two-sorted-lists/description/
// 将两个升序链表合并为一个新的 升序 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。 

 

// 示例 1：


// 输入：l1 = [1,2,4], l2 = [1,3,4]
// 输出：[1,1,2,3,4,4]
// 示例 2：

// 输入：l1 = [], l2 = []
// 输出：[]
// 示例 3：

// 输入：l1 = [], l2 = [0]
// 输出：[0]
 

// 提示：

// 两个链表的节点数目范围是 [0, 50]
// -100 <= Node.val <= 100
// l1 和 l2 均按 非递减顺序 排列


//解法一 利用迭代 
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
var mergeTwoLists = function(list1, list2) {
    let prevHead = new ListNode(0)
    let prev = prevHead
    //从链表头部开始访问 
    while(list1 !==null && list2 !==null){
        //判断当前指针元素的大小 并进行合并
        if(list1.val < list2.val){
            //使用prev链表进行合并 
            prev.next = list1
            list1 = list1.next
        }else{
            prev.next = list2
            list2 = list2.next
        }
        //将元素添加到链表后 ，将指针指向最新的元素 
        prev = prev.next
    }
    //当便利到最后 while循环结束的条件是 list1 或者list2 中某一个链表的节点已经全部添加最终的链表中
    //但是还剩下另外一个链表中的元素还没有添加到 结果链表中 ，直接将后续的链表指针修改就可以完成合并。
    prev.next = list1 !== null?list1:list2;
    return prevHead.next
   };

   //递归 

   var mergeTwoLists = (l1,l2) =>{
    if(l1===null){
        //终止条件
        return l2
    }else if(l2 === null){
        //终止条件
        return l1
    }else if(l1.val < l2.val){
        //从l1 或者l2 的开头开始构造新的链表
        l1.next = mergeTwoLists(l1.next,l2)
        return l1

    }else {
        l2.next = mergeTwoLists(l1,l2.next)
        return l2
    }
   }