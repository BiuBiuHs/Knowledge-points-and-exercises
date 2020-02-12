<video class="video-source"
     width="100%"
　　　height="240px"  /*如果有封面，请设置高度*/
     controls  /*这个属性规定浏览器为该视频提供播放控件*/  
     style="object-fit:fill"  /*加这个style会让 Android / web 的视频在微信里的视频全屏，如果是在手机上预览，会让视频的封面同视频一样大小*/
     webkit-playsinline="true"  /*这个属性是ios 10中设置可以让视频在小窗内播放，也就是不是全屏播放*/  
     x-webkit-airplay="true"  /*这个属性还不知道作用*/ 
     playsinline="true"  /*IOS微信浏览器支持小窗内播放*/ 
     x5-video-player-type="h5" /*启用H5播放器,是wechat安卓版特性*/
     x5-video-orientation="h5" /*播放器支付的方向，landscape横屏，portraint竖屏，默认值为竖屏*/
     x5-video-player-fullscreen="true" /*全屏设置，设置为 true 是防止横屏*/
     preload="auto" /*这个属性规定页面加载完成后载入视频*/ 
</video>


https://www.jianshu.com/p/887e09cb0a10 h5 video 移动端填坑记
