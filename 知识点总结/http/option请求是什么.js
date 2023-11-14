
//option请求一般为预检请求。
/*
 作用
 1.检测服务器所支持的请求方法
 2.CORS（跨域） 中的预检请求(preflight request)
*/

// 再来看下这个“某些情况下”都是什么情况?
// 1、跨域请求，非跨域请求不会出现options请求
// 2、自定义请求头
// 3、请求头中的content-type是application/x-www-form-urlencoded, multipart/form-data, tex/plain之外的格式

// 当满足条件12或者13的时候，简单的ajax请求就会出现options请求，
//有没有感觉到一点同源策略的意思，个人理解这个就是浏览器底层对于同源策略的一个具体实现。


//---*---在跨域时，简单请求不会带有options请求 ---*---
/**
 * ---*---满足以下条件的为简单请求---*---

http方法是以下之一：

GET
HEAD
POST


HTTP的头信息不超出以下几种字段：

Accept
Accept-Language
Content-Language
Content-Type （需要注意额外的限制）
DPR
Downlink
Save-Data
Viewport-Width
Width


Content-Type 的值仅限于下列三者之一：

text/plain
multipart/form-data
application/x-www-form-urlencoded
 */

/**
 * 如何优化
 * 
如果不想让每个CORS复杂请求都出两次请求，可以设置Access-Control-Max-Age这个属性。
让浏览器缓存，在缓存的有效期内，所有options请求都不会发送。优化性能。
 */