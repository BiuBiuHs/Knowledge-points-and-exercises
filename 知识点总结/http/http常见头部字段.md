
>请求头

|字段  |作用 | 语法 |
|-----|:------|:-----|
|Accept|告知（服务器）客户端可以处理的内容类型|text/html、image/*、*/*|
|If-Modified-Since|将Last-Modified的值发送给服务器，询问资源是否已经过期(被修改)，过期则返回新资源，否则返回304|示例：If-Modified-Since: Wed, 21 Oct 2015 07:28:00 GMT|
|If-Unmodified-Since | 将Last-Modified的值发送给服务器，询问文件是否被修改，若没有则返回200，否则返回412预处理错误，可用于断点续传。通俗点说If-Unmodified-Since是文件没有修改时下载，If-Modified-Since是文件修改时下载|示例：If-Unmodified-Since: Wed, 21 Oct 2015 07:28:00 GMT|
|If-None-Match|将ETag的值发送给服务器，询问资源是否已经过期(被修改)，过期则返回新资源，否则返回304|示例：If-None-Match: "bfc13a6472992d82d"|
|If-Match|将ETag的值发送给服务器，询问文件是否被修改，若没有则返回200，否则返回412预处理错误，可用于断点续传|示例：If-Match: |"bfc129c88ca92d82d"
|Range|告知服务器返回文件的哪一部分, 用于断点续传|示例：Range: bytes=200-1000, 2000-6576, 19000-|
|Host|指明了服务器的域名（对于虚拟主机来说），以及（可选的）服务器监听的TCP端口号|示例：Host:www.baidu.com|
|User-Agent|告诉HTTP服务器， 客户端使用的操作系统和浏览器的名称和版本|User-Agent: Mozilla/|

>响应头

|字段  |作用 | 语法 |
|-----|:------|:-----|
|Location|需要将页面重新定向至的地址。一般在响应码为3xx的响应中才会有意义|Location: <url>|
|ETag|资源的特定版本的标识符，如果内容没有改变，Web服务器不需要发送完整的响应|ETag: "<etag_value>"|
|Server|处理请求的源头服务器所用到的软件相关信息|Server: <product>|