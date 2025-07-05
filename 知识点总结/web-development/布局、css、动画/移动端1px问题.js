// https://juejin.cn/post/6844903877947424782#heading-9

// 那么为什么会产生这个问题呢？主要是跟一个东西有关，DPR(devicePixelRatio) 设备像素比，
// 它是默认缩放为100%的情况下，设备像素和CSS像素的比值。
// window.devicePixelRatio=物理像素 /CSS像素
// 复制代码目前主流的屏幕DPR=2 （iPhone 8）,或者3 （iPhone 8 Plus）。
// 也就是说在 dpi =2 的设备上 1 css像素 对应的是2 *2 的像素点 比看起来更宽

// 设置viewpoint
```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>1px Line Example</title>
  <style>


// 为什么默认设置为 16px
// 兼容性：大多数浏览器的默认字体大小是 16px，这样设置可以确保在没有特殊样式的情况下，文本的显示效果一致。
// 简单：16px 是一个方便的基准值，因为 1rem 等于 16px，可以直接使用 rem 单位进行布局，而不需要复杂的换算。
    html {
      font-size: 16px; /* 默认字体大小 */
    }
    .line {
      border: 0.05rem solid black; /* 1px 线条 */
    }
  </style>
</head>
<body>
  <div class="line"></div>
  <script>
    function setRemUnit() {
      const html = document.documentElement;
      const width = html.clientWidth;
      //设置为十分之一 是为了方便计算的策略
      const rem = width / 10; // 根据屏幕宽度动态设置根元素的字体大小
      html.style.fontSize = rem + 'px';
    }

    // 初始化设置
    setRemUnit();

    // 监听窗口大小变化
    window.addEventListener('resize', setRemUnit);
  </script>
</body>
</html>

```;

// 配合webpack 的插件实现自动px转换为rem

// const path = require('path');

// module.exports = {
//   entry: './src/index.js',
//   output: {
//     filename: 'bundle.js',
//     path: path.resolve(__dirname, 'dist')
//   },
//   module: {
//     rules: [
//       {
//         test: /\.css$/,
//         use: [
//           'style-loader',
//           'css-loader',
//           {
//             loader: 'postcss-loader',
//             options: {
//               postcssOptions: {
//                 plugins: [
//                   'postcss-preset-env',
//                   [
//                     'postcss-pxtorem',
//                     {
//                       rootValue: 16, // 根元素的字体大小
//                       propList: ['*'], // 需要转换的属性
//                       selectorBlackList: ['.ignore'], // 忽略的类名
//                       minPixelValue: 1 // 最小转换值
//                     }
//                   ]
//                 ]
//               }
//             }
//           }
//         ]
//       }
//     ]
//   }
// };
