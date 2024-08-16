## setTimeout缺点

* 「造成无用的函数运行开销：」
也就是过度绘制，同时因为更新图像的频率和屏幕的刷新重绘制步调不一致，会产生丢帧，在低性能的显示器动画看起来就会卡顿。

* 「当网页标签或浏览器置于后台不可见时，仍然会执行，造成资源浪费」
「API本身达不到毫秒级的精确：」

如果使用 setTimeout或者setInterval 那么需要我们制定时间 假设给予 （1000/60）理论上就可以完成60帧速率的动画。所以事实是浏览器可以“强制规定时间间隔的下限（clamping th timeout interval）”,一般浏览器所允许的时间再5-10毫秒，也就是说即使你给了某个小于10的数，可能也要等待10毫秒。

* 「浏览器不能完美执行：」
当动画使用10ms的settimeout绘制动画时，您将看到一个时序不匹配，如下所示。

我们的显示屏一般是「16.7ms（即60FPS）的显示频率」，上图的第一行代表大多数监视器上显示的「16.7ms显示频率」，上图的第二行代表「10ms的典型setTimeout」。由于在显示刷新间隔之前发生了另一个绘制请求，因此无法绘制每次的第三个绘制（红色箭头指示）。这种透支会导致动画断断续续，「因为每三帧都会丢失」。计时器分辨率的降低也会对电池寿命产生负面影响，并降低其他应用程序的性能。

## rAf的优点

相比于setTimeout的在固定时间后执行对应的动画函数，requestAnimationFrame用于指示浏览器在下一次重新绘制屏幕图像时, 执行其提供的回调函数。

* 「使浏览器画面的重绘和回流与显示器的刷新频率同步」它能够保证我们的动画函数的每一次调用都对应着一次屏幕重绘，从而避免setTimeout通过时间定义动画频率，与屏幕刷新频率不一致导致的丢帧。
* 「节省系统资源，提高性能和视觉效果」在页面被置于后台或隐藏时，会自动的停止，不进行函数的执行，当页面激活时，会重新从上次停止的状态开始执行，因此在性能开销上也会相比setTimeout小很多。

``` javascript
<div
   id="box"
   style="
    background: black;
    width: 100px;
    height: 100px;
    position: absolute;
    left: 0;
   "
  ></div>

<script>
   window.onload = () => {
    var box = document.getElementById('box')
    var distance = 0
    var target = 500 // 目标距离
    var speed = 2 // 每帧移动的距离

    function animate() {
     if (distance < target) {
      distance += speed
      box.style.left = distance + 'px'
      requestAnimationFrame(animate)
     }
    }

    animate()
   }
  </script>

```
