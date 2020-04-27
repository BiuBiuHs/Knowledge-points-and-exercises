## 原型链的核心只需要记住三点：

* 每个对象都有__proto__属性，该属性指向其原型对象，在调用实例的方法和属性时，如果在实例对象上找不到，就会往原型对象上找
* 构造函数的prototype属性也指向实例的原型对象
* 原型对象的constructor属性指向构造函数
![](https://user-gold-cdn.xitu.io/2020/4/4/17144d68b7d0eea1?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

