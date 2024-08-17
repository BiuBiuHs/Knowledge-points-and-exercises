###  new运算符进行了什么操作

new 运算接受一个构造器和一组调用参数，实际上做了几件事：以构造器的 prototype 属性（注意与私有字段[[prototype]]的区分）为原型，创建新对象；将 this 和调用参数传给构造器，执行；如果构造器返回的是对象，则返回，否则返回第一步创建的对象。

 ```
 //https://github.com/mqyqingfeng/Blog/issues/13

 // 最终版的代码
function objectFactory() {

    var obj = new Object(),//创建一个新的对象

    Constructor = [].shift.call(arguments);

    obj.__proto__ = Constructor.prototype;

    var ret = Constructor.apply(obj, arguments);

    return typeof ret === 'object' ? ret : obj;

};
 
 ```
 #### instanceof 是通过判断对象的 prototype 链来确定这个对象是否是某个类的实例，而不关心对象与类的自身结构。
   所有的对象都是 Object的实例
