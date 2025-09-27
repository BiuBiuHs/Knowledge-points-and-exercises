function queue(len) {
	if (!Number.isInteger(len) || len <= 0)
		throw new Error("len must be a positive integer");
	var queueArr = new Array(len);
	let header = 0; // 指向队头元素位置
	let tail = 0; // 指向下一个可写入位置
	let count = 0; // 当前元素数量

	function enqueue(item) {
		// 队满
		if (count === len) return false;
		queueArr[tail] = item;
		tail = (tail + 1) % len;
		count++;
		return true;
	}

	function dequeue() {
		// 队空
		if (count === 0) return undefined;
		const item = queueArr[header];
		queueArr[header] = undefined; // 可选：便于 GC
		header = (header + 1) % len;
		count--;
		return item;
	}

	function peek() {
		return count === 0 ? undefined : queueArr[header];
	}

	function isEmpty() {
		return count === 0;
	}

	function isFull() {
		return count === len;
	}

	function size() {
		return count;
	}

	return { enqueue, dequeue, peek, isEmpty, isFull, size };
}

let myQueue = queue(3);
myQueue.enqueue(1);
myQueue.enqueue(2);
myQueue.enqueue(3);

console.log(myQueue.isFull(), "myQueue");
