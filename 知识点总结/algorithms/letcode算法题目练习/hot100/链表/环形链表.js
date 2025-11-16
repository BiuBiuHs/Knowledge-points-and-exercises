// https://leetcode.cn/problems/linked-list-cycle/description/?envType=study-plan-v2&envId=top-interview-150

// 给你一个链表的头节点 head ，判断链表中是否有环。

// 如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。注意：pos 不作为参数进行传递 。仅仅是为了标识链表的实际情况。

// 如果链表中存在环 ，则返回 true 。 否则，返回 false 。

/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

//使用双指针判断
//快慢指针也常用于 寻找中间节点使用。
/**
 * @param {ListNode} head
 * @return {boolean}
 */
var hasCycle = function (head) {
	if (head == null || head.next == null) {
		return false;
	}
	let slow = head;
	let fast = head.next;
	//有环结构则一定相遇。
	while (slow !== fast) {
		//如果没有环结构 则fast一定会先到尾 此时说明不会相遇也没有环结构。
		if (fast == null || fast.next == null) {
			return false;
		}
		slow = slow.next;
		fast = fast.next.next;
	}
	return true;
};

//哈希表 或者set

var hasCycle = function (head) {
	let countMap = new Map();
	while (head) {
		if (countMap.has(head)) return true;
		countMap.set(head, head);
		head = head.next;
	}

	return false;
};
