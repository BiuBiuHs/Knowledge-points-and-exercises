webpack 环境变量

还有一个特殊的内置环境变量叫做NODE_ENV。你可以从中读取它process.env.NODE_ENV。当你运行时npm start，总是等于'development'，
当你运行npm test它总是等于'test'，当你运行npm run build生产一个生产包时，它总是等于'production'。
### 您无法NODE_ENV手动覆盖
这可以防止开发人员意外地将慢速开发构建部署到生产环境中。

### 使用 webpack.definePlugin 定义一个全局都能访问的变量 将变量挂载在widow上。window.XXX

    new webpack.DefinePlugin({
        //变量名 window.process.env.DOMAIN_ENV   // value: XXXX
      'process.env.DOMAIN_ENV':JSON.stringify(process.env.DOMAIN_ENV)
    }),