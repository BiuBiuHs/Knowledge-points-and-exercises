/**
 * JavaScript会阻塞DOM的解析和渲染。当浏览器在解析HTML文档，构建DOM树的过程中，
 * 如果遇到了<script>标签（没有defer或async属性），浏览器会暂停DOM的构建，转而去下载并执行JavaScript代码。
 * 这是因为JavaScript有可能会改变DOM结构（例如通过document.write），所以浏览器必须停下来，
 * 等待JavaScript代码执行完毕后再继续。
 *
 * CSS不会阻塞DOM的解析，但会阻塞DOM的渲染。
 * 当浏览器在解析HTML，构建DOM的过程中，如果遇到了<link rel="stylesheet">标签，浏览器会并行下载CSS文件，
 * 但在CSS下载并解析完成之前，
 * 浏览器不会进行页面的渲染。这是为了防止用户看到样式闪烁（也就是先看到没有样式的页面，然后突然变成有样式的页面）。 */

/**
 * CSS会阻塞JavaScript的执行。当浏览器在解析HTML文档，构建DOM树的过程中，如果遇到了<script>标签，
 * 浏览器会检查此时是否有尚未完成的CSS样式表加载。如果有，浏览器会暂停JavaScript的执行，直到所有CSS样式表都加载并解析完成。
 * 这是因为JavaScript可能会查询和操作CSS样式，所以必须确保CSS先加载完成。
 *
 * 这种情况下，CSS会阻塞JavaScript的执行，但不会阻塞DOM的解析。
 */

//async 与defer 都是都是异步的下载。（相较于 HTML 解析）

//async
// 如果存在 async 属性，那么脚本及其所有依赖都会在延缓队列中执行，因此它们会被并行请求，并尽快解析和执行。

//这些script 的执行顺序是随机的 ，也就是说哪个script先加载完成哪个先执行。

//defer
//带有defer属性的 script 是按照加载顺序进行执行脚本的。
//但是 script.js 的执行要在所有元素解析完成之后
// 有 defer 属性的脚本会阻止 DOMContentLoaded 事件，直到脚本被加载并且解析完成。
// 所以 defer 会在触发 DOMContentLoaded (en-US) 事件前执行
