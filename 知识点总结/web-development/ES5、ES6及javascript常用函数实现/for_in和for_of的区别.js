
// 简单来说就是它们两者都可以用于遍历，不过for in遍历的是数组的索引（index），
// 而for of遍历的是数组元素值（value）


//使用for in会遍历数组所有的可枚举属性，包括原型，如果不想遍历原型方法和属性的话，
//可以在循环内部判断一下，使用hasOwnProperty()方法可以判断某属性是不是该对象的实例属性

var arr = [1,2,3]
Array.prototype.a = 123
    
for (let index in arr) {
  let res = arr[index]
  console.log(res)
}
//1 2 3 123

for(let index in arr) {
    if(arr.hasOwnProperty(index)){
        let res = arr[index]
  		console.log(res)
    }
}
// 1 2 3


//for of遍历的是数组元素值，而且for of遍历的只是数组内的元素，不包括原型属性和索引

var arr = [1,2,3]
arr.a = 123
Array.prototype.a = 123
    
for (let value of arr) {
  console.log(value)
}
//1 2 3

// for of适用遍历数/数组对象/字符串/map/set等拥有迭代器对象（iterator）的集合，
// 但是不能遍历对象，因为没有迭代器对象，但如果想遍历对象的属性，你可以用for in循环（这也是它的本职工作）或用内建的Object.keys()方法


// for in遍历的是数组的索引（即键名），而for of遍历的是数组元素值

// for in总是得到对象的key或数组、字符串的下标

// for of总是得到对象的value或数组、字符串的值