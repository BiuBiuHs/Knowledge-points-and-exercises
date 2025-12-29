function splitToTarget(k, str) {
	const s = str;
	const arr = s.split("-");
	const prefix = arr.shift();
	const postfix = arr
		.join("")
		.match(new RegExp(`.{1,${k}}`, "g"))
		.map((str) => {
			let upperCase = 0;
			let lowerCase = 0;
			[...str].forEach((char) => {
				if (/[a-z]/.test(char)) lowerCase++;
				if (/[A-Z]/.test(char)) upperCase++;
			});
			if (upperCase > lowerCase) {
				return str.toUpperCase();
			}
			if (lowerCase > upperCase) {
				return str.toLowerCase();
			}
			return str;
		})
		.join("-");

	console.log(prefix + "-" + postfix);
}

console.log(splitToTarget(3, "12abc-abCABc-4aB@"));
