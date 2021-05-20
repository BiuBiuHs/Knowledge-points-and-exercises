// https://juejin.cn/post/6844903877947424782#heading-9

// 那么为什么会产生这个问题呢？主要是跟一个东西有关，DPR(devicePixelRatio) 设备像素比，
// 它是默认缩放为100%的情况下，设备像素和CSS像素的比值。
// window.devicePixelRatio=物理像素 /CSS像素
// 复制代码目前主流的屏幕DPR=2 （iPhone 8）,或者3 （iPhone 8 Plus）。拿2倍屏来说，设备的物理像素要实现1像素，
// 而DPR=2，所以css 像素只能是 0.5。

//使用伪元素

// .setOnePx{
//     position: relative;
//     &::after{
//       position: absolute;
//       content: '';
//       background-color: #e5e5e5;
//       display: block;
//       width: 100%;
//       height: 1px; /*no*/
//       transform: scale(1, 0.5);
//       top: 0;
//       left: 0;
//     }
//   }
  

// 设置viewpoint

// <html>
//   <head>
//       <title>1px question</title>
//       <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
//       <meta name="viewport" id="WebViewport" content="initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">        
//       <style>
//           html {
//               font-size: 1px;
//           }            
//           * {
//               padding: 0;
//               margin: 0;
//           }
//           .top_b {
//               border-bottom: 1px solid #E5E5E5;
//           }

//           .a,.b {
//                       box-sizing: border-box;
//               margin-top: 1rem;
//               padding: 1rem;                
//               font-size: 1.4rem;
//           }

//           .a {
//               width: 100%;
//           }

//           .b {
//               background: #f5f5f5;
//               width: 100%;
//           }
//       </style>
//       <script>
//           var viewport = document.querySelector("meta[name=viewport]");
//           //下面是根据设备像素设置viewport
//           if (window.devicePixelRatio == 1) {
//               viewport.setAttribute('content', 'width=device-width,initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no');
//           }
//           if (window.devicePixelRatio == 2) {
//               viewport.setAttribute('content', 'width=device-width,initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, user-scalable=no');
//           }
//           if (window.devicePixelRatio == 3) {
//               viewport.setAttribute('content', 'width=device-width,initial-scale=0.3333333333333333, maximum-scale=0.3333333333333333, minimum-scale=0.3333333333333333, user-scalable=no');
//           }
//           var docEl = document.documentElement;
//           var fontsize = 32* (docEl.clientWidth / 750) + 'px';
//           docEl.style.fontSize = fontsize;
//       </script>
//   </head>
//   <body>
//       <div class="top_b a">下面的底边宽度是虚拟1像素的</div>
//       <div class="b">上面的边框宽度是虚拟1像素的</div>
//   </body>
// </html>
