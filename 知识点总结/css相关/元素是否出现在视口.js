
// 链接：https://juejin.cn/post/7194453607108837431
// 1. 知识铺垫：确定浏览器窗口的尺寸
// 有三种方法能够确定浏览器窗口的尺寸（浏览器的视口，不包括工具栏和滚动条）。
// 对于Internet Explorer、Chrome、Firefox、Opera 以及 Safari：
// window.innerHeight - 浏览器窗口的内部高度
// window.innerWidth - 浏览器窗口的内部宽度
// 复制代码
// 对于 Internet Explorer 8、7、6、5：
// document.documentElement.clientHeight
// document.documentElement.clientWidth    
// 复制代码
// 或者混杂模式（没有）下:
// document.body.clientHeight
// document.body.clientWidth
// 复制代码
// 实用的 JavaScript 方案（涵盖所有浏览器）：
var w=window.innerWidth
	|| document.documentElement.clientWidth
	|| document.body.clientWidth;

var h=window.innerHeight
	|| document.documentElement.clientHeight
	|| document.body.clientHeight;

// 一些其他 Window 方法：
// window.open() - 打开新窗口
// window.close() - 关闭当前窗口
// window.moveTo() - 移动当前窗口
// window.resizeTo() - 调整当前窗口的尺寸
// 复制代码
// scrollTop(): 方法设置或返回被选元素的垂直滚动条位置。
// 当用于返回位置时：
// 该方法返回==第一个==匹配元素的滚动条的垂直位置。
// 当用于设置位置时：
// 该方法设置==所有==匹配元素的滚动条的垂直位置。
// scrollHeight属性: 滚动的总高度，指的是包含滚动内容的元素大小（元素内容的总高度）。
// window.scrollBy(x,y)：x轴，y轴的一次滚动的距离。
// 2. 判断元素是否出现在视口：
// 方法一：offsetTop - scrollTop <= 视口高度
function isInViewPortOfOne (element) {
  // 获取可视窗口的高度。兼容所有浏览器
  const screenHeight = window.innerHeight || document.documentElement.clientHeight
  	 || document.body.clientHeight;
  // 获取滚动条滚动的高度
  const scrollTop = document.documentElement.scrollTop;
  // 获取元素偏移的高度。就是距离可视窗口的偏移量。
  const offsetTop = element.offsetTop;
  // 加100是为了提前加载
  return offsetTop - scrollTop <= screenHeight + 100;
}

// 方法二：getBoundingClientRect()
getBoundingClientRect() //返回值是一个 DOMRect对象，拥有left, top, right, bottom, x, y, width, height属性。
// 公式: el.getBoundingClientRect().top <= viewPortHeight
function isInViewPortOfTwo (el) {
    const screenHeight = window.innerHeight || document.documentElement.clientHeight
    	 || document.body.clientHeight;
    const top = el.getBoundingClientRect() && el.getBoundingClientRect().top;
    return top  <= screenHeight + 100;
}


// 方法三：IntersectionObserver
// io 为 IntersectionObserver对象 - 由IntersectionObserver()构造器创建
 var io = new IntersectionObserver((entries) => {
   // entries 为 IntersectionObserverEntry对像数组
   entries.forEach((item) => {
     // item 为 IntersectionObserverEntry对像
     // isIntersecting是一个Boolean值，判断目标元素当前是否可见
     if (item.isIntersecting) {
       // div 可见时 进行相关操作
       console.log(item.target.innerText);
       io.unobserve(item.target); //停止监听该div DOM节点
     }
   });
 }); // 不传options参数，默认根元素为浏览器视口
const divArr = [...document.querySelectorAll(".item")];
 divArr.forEach((div) => io.observe(div)); // 遍历监听所有div DOM节点
