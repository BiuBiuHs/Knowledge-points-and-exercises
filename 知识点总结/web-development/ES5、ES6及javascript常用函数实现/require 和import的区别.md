### require/exports 是运行时动态加载，
### import/export 是静态编译

>CommonJS 加载的是一个对象（即 module.exports 属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。- 阮一峰

### require/exports 输出的是一个值的拷贝，import/export 模块输出的是值的引用

* require/exports 输出的是值的拷贝。也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。
* import/export 模块输出的是值的引用。JS 引擎对脚本静态分析的时候，遇到模块加载命令import，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。

**若文件引用的模块值改变，require 引入的模块值不会改变，而 import 引入的模块值会改变**

### 加载顺序 
 * 由于是编译时加载，所以import命令会提升到整个模块的头部 最先加载 
 ________

### exports 是对 module.exports 的引用，相当于

    exports = module.exports = {};

### 在不改变 exports 指向的情况下，使用 exports 和 module.exports 没有区别；如果将 exports 指向了其他对象，exports 改变不会改变模块输出值。示例如下：

        //utils.js
        let a = 100;

        exports.a = 200;
        console.log(module.exports) //{a : 200}
        exports = {a:300}; //exports 指向其他内存区

        //test.js

        var a = require('./utils');
        console.log(a) // 打印为 {a : 200}

## **import/export 不能对引入模块重新赋值/定义**