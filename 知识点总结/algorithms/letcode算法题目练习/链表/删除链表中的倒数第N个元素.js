// 链接：https://leetcode-cn.com/problems/remove-nth-node-from-end-of-list
// 给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。

// 进阶：你能尝试使用一趟扫描实现吗？

//

// 示例 1：

// 输入：head = [1,2,3,4,5], n = 2
// 输出：[1,2,3,5]
// 示例 2：

// 输入：head = [1], n = 1
// 输出：[]
// 示例 3：

// 输入：head = [1,2], n = 1
// 输出：[1]
//

// 提示：

// 链表中结点的数目为 sz
// 1 <= sz <= 30
// 0 <= Node.val <= 100
// 1 <= n <= sz

//添加一个伪节点
var removeNthFromEnd = function (head, n) {
	//生成一个假头
	let dummyHead = new ListNode(0) //伪节点 该节点指向头节点
	dummyHead.next = head
	let fast = dummyHead,
		slow = dummyHead //设置快慢指针
	// 快先走 n+1 步
	while (n--) {
		fast = fast.next
	}
	// fast、slow 一起前进
	while (fast && fast.next) {
		fast = fast.next
		slow = slow.next
	}
	slow.next = slow.next.next
	return dummyHead.next
}
