### assert 与 statics的区别

#### assert
    1.assert下的文件属于 当前项目依赖 ，webpack会对其进行处理，这些资源是源代码的一部分，这就是建议将需要webpack处理的静态文件放在src下的原因

#### statics

    static目录下的文件不会被webpack处理，他们会直接被复制到最终的目录下，默认是（dist/statics）
    必须使用绝对路径引用这些文件，可以通过config.js文件中的build.assetsPublicPath和build.assetsSubDirectory来进行确定 目录
    ```
    dev: {
            // Paths
            assetsSubDirectory: 'growth-statics',
            assetsPublicPath: '/',
            host: IP,
            port: PORT,
            autoOpenBrowser: true,
            errorOverlay: true,
            notifyOnErrors: true,
            poll: false,
            useEslint: true,
            overlay: {
            warnings: false,
            errors: true
        },
    ```

    可以使用copy-webpack-plugin 在dev环境下将statics文件夹下的文件 复制到dist下，使得 dev-server 能够找到需要的文件 ，
    ```
    // copy custom static assets  将statics文件夹下的文件，拷贝到指定的位置 配置不懂github搜
        new CopyWebpackPlugin([
        {
            from: path.resolve(__dirname, '../statics'),//文件源路径
            to: path.resolve(__dirname,'../dist/growth-statics/eruda.js'), //目标路径
            // ignore: ['.*'] 
        }
    ]),
    ```