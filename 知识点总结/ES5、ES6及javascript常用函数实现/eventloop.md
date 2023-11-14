// 宏任务
//定时器


//微任务
// 除了then以外，还有几个事件也被记为微任务：
//promise.then
// process.nextTick
// promises
// Object.observe
// MutationObserver


#### Node.js中的eventLoop
![](https://user-gold-cdn.xitu.io/2018/6/29/1644b17495b10980?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

1. timers：执行满足条件的setTimeout、setInterval回调。
2. I/O callbacks：是否有已完成的I/O操作的回调函数，来自上一轮的poll残留。
3. idle，prepare：可忽略
4. poll：等待还没完成的I/O事件，会因timers和超时时间等结束等待。
5. check：执行setImmediate的回调。
6. close callbacks：关闭所有的closing handles，一些onclose事件。

//老版本的node存在与浏览器的eventloop 执行顺序不一致的问题 ，后续越来越趋近于统一标准，向浏览器的执行顺序靠近。


真正的执行顺序
* 清空当前循环内的Timers Queue，清空NextTick Queue，清空Microtask Queue。
* 清空当前循环内的I/O Queue，清空NextTick Queue，清空Microtask Queue。
* 清空当前循环内的Check Queu，清空NextTick Queue，清空Microtask Queue。
* 清空当前循环内的Close Queu，清空NextTick Queue，清空Microtask Queue。
* 进入下轮循环。

可以看出，`nextTick` 优先级比 `promise` 等microtask高。`setTimeout` 和 `setInterval` 优先级比 `setImmediate` 高。