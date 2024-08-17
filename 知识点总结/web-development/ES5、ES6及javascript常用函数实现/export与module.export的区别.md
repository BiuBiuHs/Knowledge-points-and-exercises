在浏览器端 js 里面，为了解决各模块变量冲突等问题，往往借助于 js 的闭包把左右模块相关的代码都包装在一个匿名函数里。而 Nodejs 编写模块相当的自由，开发者
只需要关注 require,exports,module 等几个变量就足够，而为了保持模块的可读性，很推荐把不同功能的代码块都写成独立模块，减少各模块耦合。

在 node 的 js 模块里可以直接调用 exports 和 module 两个“全局”变量，但是 exports 是 module.exports 的一个引用。

```
//plus.js
function plus(a,b){
  return a+b;
}
// 这样导出的 plus 是作为 exports 的一个方法被导出的
exports.plus = plus;

// main.js
var Plus = require('plus');
console.log(Plus.plus(1,2)); // 左边的 Plus 是 require 过来的模块名，右边的是它的 plus 方法。

```

在 node 编译的过程中，会把 js 模块封装成如下形式：
```
// require 是对 Node.js 实现查找模块的 Module._load 实例的引用
// __finename 和 __dirname 是 Node.js 在查找该模块后找到的模块名称和模块绝对路径
(function(exports,require,module,__filename,__dirname){
  function plus(a,b){
    return a+b;
  }
  exports.plus = plus;
})

```

为了将函数直接导出成模块，而不是模块的一个方法，需要

module.exports = plus;

```

// plus.js
function plus(a,b){
  return a+b ;
}
module.exports = plus;
// main.js
var plus = require('plus');
console.log(plus(1,2));
```
exports = module.exports = {};

exports 是 module.exports 的一个引用
module.exports 初始值为一个空对象 {}，所以 exports 初始值也是 {}
require 引用模块后，返回的是 module.exports 而不是 exports!!!!!
exports.xxx 相当于在导出对象上挂属性，该属性对调用模块直接可见
exports = 相当于给 exports 对象重新赋值，调用模块不能访问 exports 对象及其属性
如果此模块是一个类，就应该直接赋值 module.exports，这样调用者就是一个类构造器，可以直接 new 实例。


```
var name = 'rainbow';
exports.name = name;
exports.sayName = function(){
  console.log(name);
}
// 给 exports 赋值相当于给 module.exports 这个空对象添加了两个属性，相当于：
var name = 'rainbow';
module.exports.name = name;
module.exports.sayName = function(){
  console.log(name);
}

```

```

exports = function(){};
// 这样就是重新给 exports 赋值，它将不再是 module.exports 的引用，二者将无任何联系。
```
```
// index.js
var something = require('./requireMe');
something();
// requireMe.js
exports.something = function(){
  console.log('am a function');
}
// 以上代码会报错，因为 require 出来的 module.exports 是一个object，不能直接执行

//修改方式一
// requireMe.js
module.exports = function(){
   console.log('am a function');
}
// 当把代码改成上面这样，就不会报错，因为此时的 module.exports 是一个 function,可以直接执行。
// 修改方式二
// index.js
var something = require('./requireMe');
something.something();
// 因为这时候 require 出来的是一个 object，有一个 something 的属性，所以可以这样调用执行。
```



