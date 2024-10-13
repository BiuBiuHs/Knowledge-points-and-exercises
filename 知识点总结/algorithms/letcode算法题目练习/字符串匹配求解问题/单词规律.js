/**
 * @param {string} pattern
 * @param {string} s
 * @return {boolean}
 */
var wordPattern = function (pattern, s) {
	const left = {}
	const right = {}
	let wordArr = s.split(' ')
	console.log(1, wordArr)
	if (pattern.length !== wordArr.length) return false
	console.log(2)
	for (var i = 0; i < pattern.length; i++) {
		const x = pattern[i]
		const y = wordArr[i]
		console.log(x, y, 'x,y')
		if (
			(left[x] !== undefined && left[x] !== y) ||
			(right[y] !== undefined && right[y] !== x)
		) {
			console.log(3)
			return false
		}

		left[x] = y
		right[y] = x
	}
	return true
}

console.log(wordPattern('abba', 'dog cat cat dog'), 'result')
