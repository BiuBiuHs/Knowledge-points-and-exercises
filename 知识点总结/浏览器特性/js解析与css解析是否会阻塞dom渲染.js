// CSS 不会阻塞 DOM 的解析，但会阻塞 DOM 渲染。
// JS 阻塞 DOM 解析，但浏览器会"偷看"DOM，预先下载相关资源。
// 浏览器遇到 <script>且没有defer或async属性的 标签时，会触发页面渲染，

//css会阻塞js执行。
//如果js要读取某个cssdom的样式信息，但是此时css没有加载完成时，会阻塞后面的js执行。
// 因而如果前面CSS资源尚未加载完毕时，浏览器会等待它加载完毕在执行脚本。



//async 与defer 都是都是异步的下载。（相较于 HTML 解析）

//async
// 如果存在 async 属性，那么脚本及其所有依赖都会在延缓队列中执行，因此它们会被并行请求，并尽快解析和执行。

//这些script 的执行顺序是随机的 ，也就是说哪个script先加载完成哪个先执行。


//defer
//带有defer属性的 script 是按照加载顺序进行执行脚本的。
//但是 script.js 的执行要在所有元素解析完成之后
// 有 defer 属性的脚本会阻止 DOMContentLoaded 事件，直到脚本被加载并且解析完成。
// 所以 defer 会在触发 DOMContentLoaded (en-US) 事件前执行