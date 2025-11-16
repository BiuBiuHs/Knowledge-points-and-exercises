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

// 定义一个函数 removeNthFromEnd，接受两个参数：链表的头结点 head 和一个整数 n
var removeNthFromEnd = function (head, n) {
	// 生成一个假头节点，值为 0，该节点指向头节点
	let dummyHead = new ListNode(0);
	// 伪节点的 next 指向链表的头节点
	dummyHead.next = head;
	// 设置快慢指针，都初始化为伪节点
	let fast = dummyHead,
		slow = dummyHead;

	// 快指针先走 n+1 步，这样快指针和慢指针之间保持 n 个节点的距离
	while (n--) {
		fast = fast.next;
	}

	// 快慢指针一起前进，直到快指针的 next 为 null，此时慢指针正好指向要删除节点的前一个节点
	while (fast && fast.next) {
		fast = fast.next;
		slow = slow.next;
	}

	// 删除慢指针的下一个节点
	slow.next = slow.next.next;

	// 返回新的头节点，即伪节点的 next
	return dummyHead.next;
};
