### HTTP/1.0和HTTP/1.1有什么区别
* 长连接： HTTP/1.1支持长连接和请求的流水线，在一个TCP连接上可以传送多个HTTP请求，避免了因为多次建立TCP连接的时间消耗和延时
* 缓存处理： HTTP/1.1引入Entity tag，If-Unmodified-Since, If-Match, If-None-Match等新的请求头来控制缓存，详见浏览器缓存小节
* 带宽优化及网络连接的使用： HTTP1.1则在请求头引入了range头域，支持断点续传功能
* Host头处理： 在HTTP/1.0中认为每台服务器都有唯一的IP地址，但随着虚拟主机技术的发展，多个主机共享一个IP地址愈发普遍，HTTP1.1的请求消息和响应消息都应支持Host头域，且请求消息中如果没有Host头域会400错误


### 介绍一下HTTP/2.0新特性
* 多路复用： 即多个请求都通过一个TCP连接并发地完成
* 服务端推送： 服务端能够主动把资源推送给客户端
* 新的二进制格式： HTTP/2采用二进制格式传输数据，相比于HTTP/1.1的文本格式，二进制格式具有更好的解析性和拓展性
* header压缩： HTTP/2压缩消息头，减少了传输数据的大小


### 说说HTTP/2.0多路复用基本原理以及解决的问题 
    HTTP/2解决的问题，就是HTTP/1.1存在的问题：
* TCP慢启动： TCP连接建立后，会经历一个先慢后快的发送过程，就像汽车启动一般，如果我们的网页文件(HTML/JS/CSS/icon)都经过一次慢启动，对性能是不小的损耗。另外慢启动是TCP为了减少网络拥塞的一种策略，我们是没有办法改变的。
* 多条TCP连接竞争带宽： 如果同时建立多条TCP连接，当带宽不足时就会竞争带宽，影响关键资源的下载。
* HTTP/1.1队头阻塞： 尽管HTTP/1.1长链接可以通过一个TCP连接传输多个请求，但同一时刻只能处理一个请求，当前请求未结束前，其他请求只能处于阻塞状态。

为了解决以上几个问题
* HTTP/2一个域名只使用一个TCP⻓连接来传输数据，而且请求直接是并行的、非阻塞的，这就是多路复用
实现原理： HTTP/2引入了一个二进制分帧层，客户端和服务端进行传输时，数据会先经过二进制分帧层处理，转化为一个个带有请求ID的帧，这些帧在传输完成后根据ID组合成对应的数据

