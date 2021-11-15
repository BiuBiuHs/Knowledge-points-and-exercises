// CSS 不会阻塞 DOM 的解析，但会阻塞 DOM 渲染。
// JS 阻塞 DOM 解析，但浏览器会"偷看"DOM，预先下载相关资源。
// 浏览器遇到 <script>且没有defer或async属性的 标签时，会触发页面渲染，
// 因而如果前面CSS资源尚未加载完毕时，浏览器会等待它加载完毕在执行脚本。

//async
// 如果存在 async 属性，那么脚本及其所有依赖都会在延缓队列中执行，因此它们会被并行请求，并尽快解析和执行。


//defer
// 有 defer 属性的脚本会阻止 DOMContentLoaded 事件，直到脚本被加载并且解析完成。
// 所以 defer 会在触发 DOMContentLoaded (en-US) 事件前执行