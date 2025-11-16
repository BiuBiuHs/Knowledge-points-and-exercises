function mergeRange(arrs) {
	let sortedArrs = arrs.sort((a, b) => {
		let [leftA, leftB] = a;
		let [rightA, rightB] = b;
		return leftA - rightA;
	});

	let res = [];

	sortedArrs.forEach((item) => {
		if (res.length == 0 || res[res.length - 1][1] < item[0]) {
			res.push(item);
		} else {
			res[res.length - 1] = [
				res[res.length - 1][0],
				Math.max(res[res.length - 1][1], item[1]),
			];
		}
	});
	return res;
}

let intervals = [
	[1, 3],
	[2, 6],
	[8, 10],
	[15, 18],
];

// console.log(mergeRange(intervals));

function rotate(arr, count) {
	let n = arr.length;
	count = count % n;
	let temp = arr.slice(-count);

	for (var i = n - 1; i >= count; i--) {
		arr[i] = arr[i - count];
	}
	for (var i = 0; i < count; i++) {
		arr[i] = temp[i];
	}
	return arr;
}

var nums = [1, 2, 3, 4, 5, 6, 7];
console.log(rotate(nums, 3));

function productExceptSelf(nums) {
	let n = nums.length;
	let L = new Array(n);
	let R = new Array(n);
	let ans = new Arra(n);

	L[0] = 1;

	for (var i = 1; i < n; i++) {
		L[i] = nums[i - 1] * L[i - 1];
	}

	R[n - 1] = 1;
	for (var i = n - 2; i >= 0; i--) {
		R[i] = nums[i + 1] * R[i + 1];
	}
	for (var i = 0; i < n; i++) {
		ans[i] = L[i] * R[i];
	}
	return ans;
}

function reverseList(head) {
	let dummyHead = new ListNode(null);

	while (head) {
		let next = head.next;
		head.next = dummyHead.next;

		dummyHead.next = head;

		head = next;
	}
	return dummyHead.next;
}

function hasCycle(head) {
	let countMap = new Map();

	while (head) {
		if (countMap.has(head)) return true;
		countMap.set(head, head);
		head = head.next;
	}
	return false;
}
