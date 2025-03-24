
Object.prototype.toString 方法可以返回一个表示对象类型的字符串。通过调用 Object.prototype.toString.call(value)，可以更具体地确定对象的类型。

let obj = {};
let arr = [];
let date = new Date();
let reg = /test/;
let nullValue = null;
let num = 42;
let str = "hello";
let func = function() {};

console.log(Object.prototype.toString.call(obj));  // "[object Object]"
console.log(Object.prototype.toString.call(arr));  // "[object Array]"
console.log(Object.prototype.toString.call(date)); // "[object Date]"
console.log(Object.prototype.toString.call(reg));  // "[object RegExp]"
console.log(Object.prototype.toString.call(nullValue)); // "[object Null]"
console.log(Object.prototype.toString.call(num));  // "[object Number]"
console.log(Object.prototype.toString.call(str));  // "[object String]"
console.log(Object.prototype.toString.call(func)); // "[object Function]"

//为什么 Object.prototype.toString 方法可以区分具体类型

Object.prototype.toString 方法可以区分具体类型的原因在于它的实现方式。Object.prototype.toString 是一个内置方法，它返回一个表示对象类型的字符串。这个方法在内部使用了对象的内部属性 [[@Class]]，这个属性标识了对象的具体类型。

内部属性 [[@Class]]
在 ECMAScript 规范中，每个对象都有一个内部属性 [[@Class]]，这个属性是一个字符串，表示对象的类型。例如：

对于普通对象，[[Class]] 是 "Object"。
对于数组，[[Class]] 是 "Array"。
对于日期对象，[[Class]] 是 "Date"。
对于正则表达式对象，[[Class]] 是 "RegExp"。
对于 null，虽然 typeof null 返回 "object"，但 Object.prototype.toString 会返回 "[object Null]"。
对于 undefined，虽然 typeof undefined 返回 "undefined"，但 Object.prototype.toString 会返回 "[object Undefined]"。

typeof 用于区分基础数据类型

let undefinedValue;
let booleanValue = true;
let stringValue = "hello";
let numberValue = 42;
let bigintValue = 123n;
let symbolValue = Symbol("foo");
let objectValue = {};
let arrayValue = [];
let nullValue = null;
let functionValue = function() {};

console.log(typeof undefinedValue); // "undefined"
console.log(typeof booleanValue);   // "boolean"
console.log(typeof stringValue);    // "string"
console.log(typeof numberValue);    // "number"
console.log(typeof bigintValue);    // "bigint"
console.log(typeof symbolValue);    // "symbol"
console.log(typeof objectValue);    // "object"
console.log(typeof arrayValue);     // "object"
console.log(typeof nullValue);      // "object"
console.log(typeof functionValue);  // "function"
