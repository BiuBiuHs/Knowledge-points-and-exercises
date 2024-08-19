const is = (val1, val2) => {
	if (val1 === val2) {
		// 处理 +0 === -0
		return val1 !== 0 || 1 / val1 === 1 / val2
	} else {
		// 处理NaN，利用NaN !== NaN 的特型
		return val1 !== val1 && val2 !== val2
	}
}

// 首先看一下对于NaN的处理，处理NaN的是建立在val1 !== val2的基础之上，若是传入的是两个不同的数据且存在不为NaN的数据时，
// 那么x !== x恒等为false，那么is函数最终返回false，若是都为NaN时，在JS中有且仅有NaN !== NaN返回true

// 看一下对于+0 === -0的处理逻辑，由于在严格相等中+0 === -0返回的是true，因为进入if逻辑中包含前述情况，
// 由于Object.is属于对严格相等的功能补全，进入此逻辑中的其他情况都会返回true，因此return逻辑主要是处理+0、-0

//在react的useEffect 中 对于deps（依赖项的比较就是使用object.is）
/**
 * 
    1.object.is 的比较是浅比较 

    2.对于值类型，对比值是否相同 

    3.对于引用类型，则比较是否是相同的引用地址 ，相同则返回true 不同则为false 

   
 */

object.is(window, window) //true
object.is({}, {}) //false
// 基本比较
console.log(Object.is(5, 5)) // true
console.log(Object.is(5, '5')) // false
console.log(Object.is(true, true)) // true
console.log(Object.is(null, null)) // true

// NaN 的比较
console.log(Object.is(NaN, NaN)) // true
console.log(NaN === NaN) // false

// +0 和 -0 的比较
console.log(Object.is(0, -0)) // false
console.log(0 === -0) // true

// 对象比较
let obj = { a: 1 }
console.log(Object.is(obj, obj)) // true
console.log(Object.is(obj, { a: 1 })) // false

// 函数比较
let func = () => {}
console.log(Object.is(func, func)) // true
console.log(Object.is(func, () => {})) // false
