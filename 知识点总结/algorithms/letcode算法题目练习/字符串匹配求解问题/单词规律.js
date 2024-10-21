/**
 * @param {string} pattern
 * @param {string} s
 * @return {boolean}
 */
var wordPattern = function (pattern, s) {
	const left = new Map();
	const right = new Map();
	let wordArr = s.split(" ");
	if (pattern.length !== wordArr.length) return false;
	for (var i = 0; i < pattern.length; i++) {
		const x = pattern[i];
		const y = wordArr[i];
		if (
			(left.has(x) && left.get(x) !== y) ||
			(right.has(y) && right.get(y) !== x)
		)
			return false;
		left.set(x, y);
		right.set(y, x);
	}
	return true;
};
