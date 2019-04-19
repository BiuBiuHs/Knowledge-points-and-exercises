###  new运算符进行了什么操作

 ```
 function newSymbol (obj){
 
 //创建了一个空的对象
    var F={};
    //设置新对象的__proto__属性指向构造函数的prototype对象
    F.__proto__=obj.prototype;
    //用新对象来调用函数
    obj.func.call(F);
    //最后将它返回
    return F;
    
 }
 
 ```
 #### instanceof 是通过判断对象的 prototype 链来确定这个对象是否是某个类的实例，而不关心对象与类的自身结构。
   所有的对象都是 Object的实例
