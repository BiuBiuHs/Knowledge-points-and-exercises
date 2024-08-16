

//其实就相当于在window上挂在了一个全局的属性 。

// 注册与执行过程
// 1、native端注册jsb
// 2、webview侧创建iframe，设置src为__bridge_load__
// 3、native端捕获请求，注入jsb初始化代码，在window上挂载相关对象和方法
// 4、webview侧调用callHandler方法，并在responseCallback上添加callbackId: responseCallback，并修改iframe的src，触发捕获
// 5、native收到message，生成一个responseCallback，并执行native侧注册好的方法
// 6、native执行完毕后，通过webview执行_handleMessageFromObjC方法，取出callback函数，并执行
