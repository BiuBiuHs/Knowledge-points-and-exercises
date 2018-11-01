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
