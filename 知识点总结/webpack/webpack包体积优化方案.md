### externals配置

    比如项目开发中常用到的 moment, lodash等，都是挺大的存在，如果必须引入的话，即考虑外部引入之，再借助 externals 予以指定， webpack可以处理使之不参与打包，而依旧可以在代码中通过CMD、AMD或者window/global全局的方式访问。
    如果使用externals 那么必须在html中引入对应的cdn文件
    eg：<script src="https://cdn.bootcss.com/lodash.js/4.17.15/lodash.core.js"></script>
    ```
    // webpack config中予以指定
        externals: {
        // 'vue': 'Vue',
        // 'lodash': '_',
        'babel-polyfill': 'window'
        }
      ⚠️注意：//externals 中：key 是 require 的包名，value 是全局的变量。
    ```
### 按需引入 用es6的 import 与export可以实现

    ```
        //按需引入lodash
        import { debounce } from 'lodash'
        import { throttle } from 'lodash'

        // 改成如下写法
        import debounce from 'lodash/debounce'
        import throttle from 'lodash/throttle'
    ```

#### splitChunks

```

    optimization: {
        splitChunks: {
        chunks: 'async', 
        minSize: 30000,
        maxSize: 0,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '~',
        name: true,
        cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    }

```
    参数说明如下：
        chunks：表示从哪些chunks里面抽取代码，除了三个可选字符串值 initial、async、all 之外，还可以通过函数来过滤所需的 chunks；
        minSize：表示抽取出来的文件在压缩前的最小大小，默认为 30000；
        maxSize：表示抽取出来的文件在压缩前的最大大小，默认为 0，表示不限制最大大小；
        minChunks：表示被引用次数，默认为1；
        maxAsyncRequests：最大的按需(异步)加载次数，默认为 5；
        maxInitialRequests：最大的初始化加载次数，默认为 3；
        automaticNameDelimiter：抽取出来的文件的自动生成名字的分割符，默认为 ~；
        name：抽取出来文件的名字，默认为 true，表示自动生成文件名；
        cacheGroups: 缓存组。（这才是配置的关键）
####  cacheGroups
    上面的那么多参数，其实都可以不用管，cacheGroups 才是我们配置的关键。它可以继承/覆盖上面 splitChunks 中所有的参数值，除此之外还额外提供了三个配置，分别为：test, priority 和 reuseExistingChunk。

        test: 表示要过滤 modules，默认为所有的 modules，可匹配模块路径或 chunk 名字，当匹配的是 chunk 名字的时候，其里面的所有 modules 都会选中；
        priority：表示抽取权重，数字越大表示优先级越高。因为一个 module 可能会满足多个 cacheGroups 的条件，那么抽取到哪个就由权重最高的说了算；
        reuseExistingChunk：表示是否使用已有的 chunk，如果为 true 则表示如果当前的 chunk 包含的模块已经被抽取出去了，那么将不会重新生成新的。
#### optimization.runtimeChunk
通过optimization.runtimeChunk: true选项，webpack会添加一个只包含运行时(runtime)额外代码块到每一个入口。（译注：这个需要看场景使用，会导致每个入口都加载多一份运行时代码）