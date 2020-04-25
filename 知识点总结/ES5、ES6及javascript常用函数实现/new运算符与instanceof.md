###  new运算符进行了什么操作

new 运算接受一个构造器和一组调用参数，实际上做了几件事：以构造器的 prototype 属性（注意与私有字段[[prototype]]的区分）为原型，创建新对象；将 this 和调用参数传给构造器，执行；如果构造器返回的是对象，则返回，否则返回第一步创建的对象。

 ```
 function newSymbol (obj){
 
 //创建了一个空的对象
    var F={};
    //设置新对象的__proto__属性指向构造函数的prototype对象
    F.__proto__=obj.prototype;
    //用新对象来调用函数
    var res = obj.func.call(F); //如果函数执行后返回的是一个对象 那么返回执行结果res 否则返回之前创建的F对象
    //最后将它返回  
    return res.isObject()?res :F
    
 }
 
 ```
 #### instanceof 是通过判断对象的 prototype 链来确定这个对象是否是某个类的实例，而不关心对象与类的自身结构。
   所有的对象都是 Object的实例
