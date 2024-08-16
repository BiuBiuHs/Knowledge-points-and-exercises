// #### Vue 问题记录

// ##### 定时器刷新 ，影响到某个 Vue 属性， 会导致某些问题,在接下来对页面进行操作， 或跳转时一定要将定时器清除。
var funName1 = setTimeout(function () {
  return;
}, 1000);

var funName2 = setInterval(function () {
  return fun2;
}, 1000);

//清除Timeout的定时器,传入id(创建定时器时会返回一个id)
clearTimeout(funName1);

//清除Interval的定时器,传入id(创建定时器时会返回一个id)
clearInterval(funName2);

//也可以使用return值 来清除
setTimeout(function () {
  console.log("33");
  return 33;
}, 3000);
clearTimeout(33);

// 在 Vue 当中引入图片问题 当对 img 中的 src 属性使用绑定时 需要使用 require 来引入图片

//商品 .js

const a = {
  subjectImg: require("../../assets/oppo-combination-buy/purchase_class_01.jpg"),
  subjectId: "math",
  subjectPriceImg: require("../../assets/oppo-combination-buy/purchase_class_-100.png"),
  priceZimg: require("../../assets/oppo-combination-buy/purchase_Price_298.png"),
};

//app.vue
// <img :src="product.subjectImg">
