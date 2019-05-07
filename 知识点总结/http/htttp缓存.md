
http://www.cnblogs.com/ziyunfei/archive/2012/11/17/2772729.html
https://juejin.im/entry/5ad86c16f265da505a77dca4

### 永久性缓存

### 强制缓存
控制强制缓存的字段分别是Expires和Cache-Control，其中Cache-Control优先级比Expires高。
#### Expires
Expires是HTTP/1.0控制网页缓存的字段，其值为服务器返回该请求结果缓存的到期时间，即再次发起该请求时，如果客户端的时间小于Expires的值时，直接使用缓存结果。
到了HTTP/1.1，Expire已经被Cache-Control替代，原因在于Expires控制缓存的原理是使用客户端的时间与服务端返回的时间做对比，那么如果客户端与服务端的时间因为某些原因（例如时区不同；客户端和服务端有一方的时间不准确）发生误差，那么强制缓存则会直接失效，这样的话强制缓存的存在则毫无意义

#### Cache-Control
在HTTP/1.1中，Cache-Control是最重要的规则，主要用于控制网页缓存，主要取值为：

public：所有内容都将被缓存（客户端和代理服务器都可缓存）

private：所有内容只有客户端可以缓存，Cache-Control的默认取值

no-cache：客户端缓存内容，但是是否使用缓存则需要经过协商缓存来验证决定

no-store：所有内容都不会被缓存，即不使用强制缓存，也不使用协商缓存

max-age=xxx (xxx is numeric)：缓存内容将在xxx秒后失效
![Alt text](https://user-gold-cdn.xitu.io/2018/4/19/162db635aa7b772b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1 )

HTTP响应报文中expires的时间值，是一个绝对值

HTTP响应报文中Cache-Control为max-age=600，是相对值

由于Cache-Control的优先级比expires，那么直接根据Cache-Control的值进行缓存，意思就是说在600秒内再次发起该请求，则会直接使用缓存结果，强制缓存生效。

#### cache-control 字段

#### max-age
该指令指定从当前请求开始，允许获取的响应被重用的最长时间（单位为秒。
例如：Cache-Control:max-age=60表示响应可以再缓存和重用 60 秒。
需要注意的是，在max-age指定的时间之内，浏览器不会向服务器发送任何请求，包括验证缓存是否有效的请求，
也就是说，如果在这段时间之内，服务器上的资源发生了变化，那么浏览器将不能得到通知，而使用老版本的资源。
所以在设置缓存时间的长度时，需要慎重。

#### public和private
如果设置了public，表示该响应可以再浏览器或者任何中继的Web代理中缓存，public是默认值，
即Cache-Control:max-age=60等同于Cache-Control:public, max-age=60。

在服务器设置了private比如Cache-Control:private, max-age=60的情况下，
表示只有用户的浏览器可以缓存private响应，不允许任何中继Web代理对其进行缓存 
例如，用户浏览器可以缓存包含用户私人信息的 HTML 网页，但是 CDN 不能缓存。

#### no-cache
如果服务器在响应中设置了no-cache即Cache-Control:no-cache，
那么浏览器在使用缓存的资源之前，必须先与服务器确认返回的响应是否被更改，如果资源未被更改，可以避免下载。
这个验证之前的响应是否被修改，就是通过上面介绍的请求头If-None-match和响应头ETag来实现的。

需要注意的是，no-cache这个名字有一点误导。
设置了no-cache之后，并不是说浏览器就不再缓存数据，只是浏览器在使用缓存数据时，需要先确认一下数据是否还跟服务器保持一致。
如果设置了no-cache，而ETag的实现没有反应出资源的变化，那就会导致浏览器的缓存数据一直得不到更新的情况。

#### no-store
如果服务器在响应中设置了no-store即Cache-Control:no-store，
那么浏览器和任何中继的Web代理，都不会存储这次相应的数据。
当下次请求该资源时，浏览器只能重新请求服务器，重新从服务器读取资源。
### 协商缓存
浏览器在请求资源之前，会先检查本地有没有缓存相应资源。如果缓存了，请求头中会带上：
* If-Modified-Since：服务器上次返回的Last-Modified日期值
* If-None-Match： 服务器上次返回的ETag日期

服务器会读取到这两个请求头中的值,判断出客户端缓存的资源是否是最新的,如果是的话,服务器就会返回HTTP/304 Not Modified响应,但没有响应体.浏览器会读取本地缓存的文件。

如果服务器认为客户端缓存的资源已经过期了,那么服务器就会返回HTTP/200 OK响应,响应体就是该资源当前最新的内容.客户端收到200响应后,就会用新的响应体覆盖掉旧的缓存资源。

### 解决Get请求缓存

1. html meta标签，到考虑到浏览器兼容性，一般不使用
2. 带上时间戳
3. post替代
4. 后端设置cache-Control: 'max-age: 0'



