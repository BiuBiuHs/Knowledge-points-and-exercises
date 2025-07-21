### new运算符进行了什么操作

new 运算接受一个构造器和一组调用参数，实际上做了几件事：以构造器的 prototype 属性（注意与私有字段[[prototype]]的区分）为原型，创建新对象；将 this 和调用参数传给构造器，执行；如果构造器返回的是对象，则返回，否则返回第一步创建的对象。

 ``` javascript
 //https://github.com/mqyqingfeng/Blog/issues/13

 // 最终版的代码
function myNew(Constructor, ...args) {
    // 1. 创建一个新的空对象
    const obj = {};

    // 2. 设置新对象的原型
    Object.setPrototypeOf(obj, Constructor.prototype);
    // 或者使用 obj.__proto__ = Constructor.prototype;

    // 3 & 4. 绑定 this 并执行构造函数
    const result = Constructor.apply(obj, args);

    // 5. 判断返回值
    if (result && (typeof result === 'object' || typeof result === 'function')) {
        return result;
    }
    return obj;
}
 
 ```

#### instanceof 是通过判断对象的 prototype 链来确定这个对象是否是某个类的实例，而不关心对象与类的自身结构

   所有的对象都是 Object的实例
