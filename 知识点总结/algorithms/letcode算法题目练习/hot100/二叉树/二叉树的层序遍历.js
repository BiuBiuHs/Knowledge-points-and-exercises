function bfs(root) {
	if (!root) return [];
	let queue = [root];
	const ans = [];

	while (queue.length) {
		let n = queue.length;
		const temp = [];
		for (var i = 0; i < n; i++) {
			const { left, right, value } = queue.shift();
			temp.push(value);
			if (left) queue.push(left);
			if (right) queue.push(right);
		}
		ans.push(temp);
	}
	return ans;
}
