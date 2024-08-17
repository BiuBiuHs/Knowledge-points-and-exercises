#### call、apply和bind函数存在的区别:
bind返回对应函数, 便于稍后调用； apply, call则是立即调用。

除此外, 在 ES6 的箭头函数下, call 和 apply 将失效, 对于箭头函数来说:
func.call(obj,arg1,arg2,arg3...) //必须将每个参数都一一指定、传入
func.apply(obj,[arg1,arg2...]) //传递一个参数数组即可

箭头函数体内的 this 对象, 就是定义时所在的对象, 而不是使用时所在的对象;所以不需要类似于var _this = this这种丑陋的写法
箭头函数不可以当作构造函数，也就是说不可以使用 new 命令, 否则会抛出一个错误
箭头函数不可以使用 arguments 对象,，该对象在函数体内不存在. 如果要用, 可以用 Rest 参数代替
不可以使用 yield 命令, 因此箭头函数不能用作 Generator 函数，