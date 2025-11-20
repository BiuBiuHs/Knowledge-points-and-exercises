function isPstr(s, start, end) {
	let left = start;
	let right = end;
	while (left < right) {
		if (s[left] !== s[right]) return false;
		left++;
		right--;
	}
	return true;
}

function allPstring(s) {
	let res = [];

	function backTrack(startIndex, tempArr) {
		if (startIndex >= s.length) {
			console.log([...tempArr]);
			res.push([...tempArr]);
			return;
		}
		for (var i = startIndex; i < s.length; i++) {
			if (!isPstr(s, startIndex, i)) continue;
			let curStr = s.slice(startIndex, i + 1);
			tempArr.push(curStr);
			backTrack(i + 1, tempArr);
			tempArr.pop();
		}
	}
	backTrack(0, []);
	return res;
}

console.log(allPstring("aab"));
