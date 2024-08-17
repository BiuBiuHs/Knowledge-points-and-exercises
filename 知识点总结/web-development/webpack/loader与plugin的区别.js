// 1.loader 是文件加载器，能够加载资源文件，并对这些文件进行一些处理，诸如编译、压缩等，最终一起打包到指定的文件中

// 2.plugin 赋予了 webpack 各种灵活的功能，例如打包优化、资源管理、环境变量注入等，目的是解决 loader 无法实现的其他事



//loader 运行在打包文件之前，主要作用在编译时
//plugin可以作用于整个编译周期。通过一些tapable的生命周期钩子来触发。


//loader本质解析。
/**
 * 
在编写 loader 前，我们首先需要了解 loader 的本质

其本质为函数，函数中的 this 作为上下文会被 webpack 填充，因此我们不能将 loader设为一个箭头函数
函数接受一个参数，为 webpack 传递给 loader 的文件源内容
函数中 this 是由 webpack 提供的对象，能够获取当前 loader 所需要的各种信息
函数中有异步操作或同步操作，异步操作通过 this.callback 返回，返回值要求为 string 或者 Buffer
 */



//plugin组成解析

// 插件必须是一个函数或者是一个包含 apply 方法的对象，这样才能访问compiler实例
// 传给每个插件的 compiler 和 compilation 对象都是同一个引用，因此不建议修改
// 异步的事件需要在插件处理完任务时调用回调函数通知 Webpack 进入下一个流程，不然会卡住
