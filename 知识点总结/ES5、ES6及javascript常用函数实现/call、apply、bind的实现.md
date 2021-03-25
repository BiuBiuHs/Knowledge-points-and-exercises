

```
Function.prototype.myCall= function(obj,...args){
    const fn = Symbol('fn') //是的fn属性独一无二 不会重复 防止fn 覆盖已有属性
    const obj = obj ||window
    obj[fn]= this //this 就是此时调用的函数 function XXX 赋给传入的对象obj的fn属性
    const res = obj[fn](...args)
    delete obj[fn]
    return res
}
```

## 实现apply apply接受一个数组作为参数

```
Function.prototype.myApply = function(obj,args){
    const fn = Symbol("fn");
    const obj = obj || window
    obj[fn] = this 
    const res = obj[fn](...args)
    delete obj[fn]
    return res

}
```

## 实现bind 

* bind()除了this还接收其他参数，bind()返回的函数也接收参数，这两部分的参数都要传给返回的函数
* new的优先级：如果bind绑定后的函数被new了，那么此时this指向就发生改变。此时的this就是当前函数的实例
* 没有保留原函数在原型链上的属性和方法



```
//不考虑 new操作符实现
Function.prototype.bind2 = function (context) {

    var self = this;
    // 获取bind2函数从第二个参数到最后一个参数
    var args = Array.prototype.slice.call(arguments, 1);

    return function () {
        // 这个时候的arguments是指bind返回的函数传入的参数
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(context, args.concat(bindArgs));
    }

}

// 考虑 bind 后的函数 使用new操作符
Function.prototype.bind2 = function (context) {

    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);

    var fNOP = function () {};

    var fBound = function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
    }

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
}

```