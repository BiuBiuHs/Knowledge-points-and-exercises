function flattenObject(obj, prefix = "") {
	const result = {};

	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			const newKey = prefix ? `${prefix}.${key}` : key;
			if (
				typeof obj[key] === "object" &&
				obj[key] !== null &&
				!Array.isArray(obj[key])
			) {
				Object.assign(result, flattenObject(obj[key], newKey));
			} else {
				result[newKey] = obj[key];
			}
		}
	}

	return result;
}

const nestedObject = {
	a: {
		b: {
			c: 1,
		},
	},
	d: 2,
};

const flattenedObject = flattenObject(nestedObject);

console.log(flattenedObject);
// 输出: { 'a.b.c': 1, d: 2 }
