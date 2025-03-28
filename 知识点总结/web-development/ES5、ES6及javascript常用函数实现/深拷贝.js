// ### 深拷贝的实现

// #### 1.深拷贝1.0

// 辅助判断函数  判断是否是一个object
// 由于null 在typeof 下也是object 所以不使用 Object.prototype.toString.call 进行判断
function isObject(obj) {
	return typeof obj === "object" && obj != null;
}
function deepClone(obj) {
	if (!isObject(obj)) return obj;
	let result = Array.isArray(obj) ? [] : {};
	for (var key in obj) {
		if (Object.prototype.hasOwnproperty.call(obj, key)) {
			if (isObject(obj[key])) {
				result[key] = deepClone(obj[key]);
			} else {
				result[key] = obj[key];
			}
		}
	}
	return result;
}

// #### 2.考虑循环引用的深拷贝 2.0

// 我们知道 JSON 无法深拷贝循环引用，遇到这种情况会抛出异常。

a.circleRef = a;

JSON.parse(JSON.stringify(a));
// TypeError: Converting circular structure to JSON

// ### 1、使用哈希表
// 解决方案很简单，其实就是循环检测，我们设置一个数组或者哈希表存储已拷贝过的对象，当检测到当前对象已存在于哈希表中时，取出该值并返回即可

function cloneDeep3(source, hash = new WeakMap()) {
	if (!isObject(source)) return source;
	if (hash.has(source)) return hash.get(source); // 新增代码，查哈希表

	var target = Array.isArray(source) ? [] : {};
	hash.set(source, target); // 新增代码，哈希表设值

	for (var key in source) {
		//注意此处 因为for in会变遍历对象上所有的属性 包括原型上的属性 所以下方要加判断
		if (Object.prototype.hasOwnProperty.call(source, key)) {
			if (isObject(source[key])) {
				target[key] = cloneDeep3(source[key], hash); // 新增代码，传入哈希表
			} else {
				target[key] = source[key];
			}
		}
	}
	return target;
}

///其他深拷贝 实现方式

function deepClone(obj, map = new WeakMap()) {
	if (obj === null || typeof obj !== "object") return obj;
	const temp = map.get(obj);
	if (temp) return temp;

	// 其他包装类型
	switch (Object.prototype.toString.call(obj)) {
		case "[object String]":
		case "[object Number]":
		case "[object Boolean]":
		case "[object RegExp]":
		case "[object Date]":
		case "[object Error]":
			return new obj.constructor(obj.valueOf());
	}

	const resObj = obj instanceof Array ? [] : {};
	map.set(obj, resObj);
	for (let k in obj) {
		// for in 会遍历到原型链上的属性，但是原型链上的属性其实是公用的
		if (obj.hasOwnProperty(k)) {
			if (isObject(obj[k])) {
				resObj[k] = deepClone(obj[k], map);
			} else {
				resObj[k] = obj[k];
			}
		}
	}
	return resObj;
}

const obj = {
	a: [1, 2, 3],
	b: {
		c: 1,
	},
	c: 1,
	date: new Date(),
	regExp: new RegExp(/a/),
	fn: () => {
		console.log("fn");
	},
	symbol: Symbol(),
};
obj.self = obj;

const resObj = deepClone(obj);
console.log(resObj);
