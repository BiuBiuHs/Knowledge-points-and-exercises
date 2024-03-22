/** 加密种类
 * 
 * 1.对称加密
 * 
 * 优点
 * 1.速度快
 * 
 * 缺点
 * 1.安全性不好 
 * 2密钥需要通过明文发送给他人，攻击者可以通过劫持http请求 获取到密钥，导致信息泄露。
 * 
 * 加密过程
 * 
 * 1.A与B建立链接，发送密钥
 * 2.使用密钥 与加密算法 加密信息生成密文，通过http传输
 * 3.B使用密钥与解密算法 解析密文，获取信息明文
 *
 * 
 * 
 * 2.非对称加密
 * 
 * 由一个公钥 与一个私钥组成，自己持有私钥，给对方发送公钥 
 * 
 * 加密过程
 * 
 * 1.发送公钥
 * 
 * 2.使用私钥+ 加密算法 生成密文
 * 
 * 3.使用公钥 + 解密算法进行解密 ，获取明文信息
 * 
 * 优点
 * 
 * 安全性更高
 * 
 * 缺点
 * 
 * 1.加密时间长，速度慢
 * 
 * 存在的问题 
 * 中间人可以劫持 发送的A公钥 替换成 攻击者X的公钥， 
 * 接收人B 获取的其实是 x的公钥 
 * 后续信息的发送 X都可以获取到明文 ，并用X的私钥进行加密 再将信息发送给B
 * 
 * 
 * 
 * 
 * *****如何避免上述问题及如何保证安全性******
 * 
 * 1.使用电子证书 
 * 
 * 特点
 * 1。能够保证无法被劫持。
 * 2.本质还是一对 非对称的密钥
 * 
 * 数字签名必须实现下面三点功能：
 * 1.接受者能够核实发送者对报文的签名，确定报文是由发送者发出的，别人无法进行伪造，这叫做报文鉴别。
 * 2.接受者确信所收到数据和发送者发送的数据是一致的，没有被篡改过，这叫做报文完整性。
 * 3.发送者事后不能抵赖自己发送的报文，这叫做不可否认。
 * 
 * 如何实现 
 * 1.特定机构发布证书，不通过http传输密钥 ，公开的证书上有 姓名及公司信息 ，证书下方有 特定信息的加密后的hash值  
 *  使用者通过公开的算法 加密信息与证书上的hash值进行对比 可验证证书的真伪
 * 
 * ———————— hash算法的特点决定 密文无法被翻译回到明文 ，所以对比hash值即可验证真伪。
 * 
 * 
 * 证书可以形成证书链 ，可以讲发布权利下发到其他机构 ，也是通过hash值进行验证真伪。
 * 
 * 
 * ****非对称加密速度过慢优化****
 * 
 * 1.第一次信息发送通过证书，验证真伪
 * 2.后续的信息传输使用对称加密（生成对称的密钥 ，通过证书的公钥加密传输，解决中间人劫持密钥的问题，因为中间人没有私钥无法解密信息。）
 * 
 */