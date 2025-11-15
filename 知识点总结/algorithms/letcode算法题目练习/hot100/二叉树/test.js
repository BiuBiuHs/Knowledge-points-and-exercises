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
