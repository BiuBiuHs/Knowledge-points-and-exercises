### 按需加载

 在为单页应用做按需加载优化时，一般采用以下原则。
· 将整个网站划分成一个个小功能，再按照每个功能的相关程度将它们分成几类。
· 将每一类合并为一个Chunk，按需加载对应的Chunk。
· 不要按需加载用户首次打开网站时需要看到的画面所对应的功能，将其放到执行入口所在的Chunk中，以减少用户能感知的网页加载时间。
· 对于不依赖大量代码的功能点，例如依赖 Chart.js 去画图表、依赖 flv.js 去播放视频的功能点，可再对其进行按需加载。

#### 1.main.js 中应该这样写

```
import (/*webpackChunkName:"show"*/'./show').then((show)=>{
    show('webpack')
})
```

其中最关键的一句是：
  import (/*webpackChunkName:"show"*/'./show')
  
Webpack内置了对 import（*）语句的支持，当Webpack遇到了类似的语句时会这样处理：

· 以./show.js为入口重新生成一个Chunk；
· 当代码执行到import所在的语句时才去加载由Chunk对应生成的文件；
· import返回一个Promise，当文件加载成功时可以在Promise的then方法中获取show.js导出的内容。
/*webpackChunkName："show"*/的含义是为动态生成的Chunk赋予一个名称，以方便我们追踪和调试代码。

#### 2.webpack配置项

  output:{
  //为动态加载的Chunk配置输出文件的名称
    chunkFilename:'[name].js',
  }
  
 如果没有chunkFilename：'[name].js' ，则分割出的代码的文件名称将会是[id].js
