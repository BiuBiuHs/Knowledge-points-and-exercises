// https://leetcode.cn/problems/reverse-nodes-in-k-group/
// 给你链表的头节点 head ，每 k 个节点一组进行翻转，请你返回修改后的链表。

// k 是一个正整数，它的值小于或等于链表的长度。如果节点总数不是 k 的整数倍，那么请将最后剩余的节点保持原有顺序。

// 你不能只是单纯的改变节点内部的值，而是需要实际进行节点交换。

// 示例 1：

// 输入：head = [1,2,3,4,5], k = 2
// 输出：[2,1,4,3,5]
// 示例 2：

// 输入：head = [1,2,3,4,5], k = 3
// 输出：[3,2,1,4,5]

// 提示：
// 链表中的节点数目为 n
// 1 <= k <= n <= 5000
// 0 <= Node.val <= 1000

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

/**
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */
function reverseKGroup(head, k) {
	if (!head || k === 1) return head

	let dummy = new ListNode(0)
	dummy.next = head
	let prev = dummy

	while (head) {
		let tail = prev
		// 检查剩余节点是否有k个
		for (let i = 0; i < k; i++) {
			tail = tail.next
			if (!tail) return dummy.next
		}

		let next = tail.next
		;[head, tail] = reverseList(head, tail)

		// 连接翻转后的部分
		prev.next = head
		tail.next = next
		prev = tail
		head = tail.next
	}

	return dummy.next
}

// 翻转链表的辅助函数
function reverseList(head, tail) {
	let prev = tail.next
	let p = head
	while (prev !== tail) {
		let next = p.next
		p.next = prev
		prev = p
		p = next
	}
	return [tail, head]
}
