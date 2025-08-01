### HTTP 连接的过程

HTTP 连接通常使用 TCP 协议来传输数据。TCP 是一种面向连接的协议，确保数据的可靠传输。以下是 HTTP 连接的完整过程：

1. **建立 TCP 连接**：
   - **三次握手**：客户端和服务器通过三次握手建立 TCP 连接。
   - **数据传输**：HTTP 请求和响应通过已建立的 TCP 连接进行传输。
   - **断开 TCP 连接**：
     - **四次挥手**：客户端和服务器通过四次挥手断开 TCP 连接。

2. **HTTP 请求**：
   - 客户端发送 HTTP 请求到服务器。
   - 请求包括请求行、请求头和请求体（可选）。

3. **HTTP 响应**：
   - 服务器处理请求并发送 HTTP 响应。
   - 响应包括状态行、响应头和响应体（可选）。

4. **断开连接**：
   - 客户端和服务器断开 TCP 连接。

### 为什么建立连接需要三次握手

三次握手是为了确保双方都准备好进行数据传输，并且可以检测和处理连接请求中的任何问题。以下是三次握手的详细过程：

1. **第一次握手**：
   - 客户端发送一个带有 `SYN` 标志的 TCP 段到服务器，请求建立连接。
   - 客户端进入 `SYN-SENT` 状态。

2. **第二次握手**：
   - 服务器收到客户端的 `SYN` 段后，发送一个带有 `SYN` 和 `ACK` 标志的 TCP 段作为响应。
   - 服务器进入 `SYN-RCVD` 状态。
   - `ACK` 标志确认了客户端的 `SYN` 段，`SYN` 标志表示服务器也准备好建立连接。

3. **第三次握手**：
   - 客户端收到服务器的 `SYN-ACK` 段后，发送一个带有 `ACK` 标志的 TCP 段作为确认。
   - 客户端进入 `ESTABLISHED` 状态。
   - 服务器收到客户端的 `ACK` 段后，也进入 `ESTABLISHED` 状态。

### 为什么断开连接需要四次挥手

四次挥手是为了确保双方都正确地处理了未发送的数据，并且双方都同意断开连接。以下是四次挥手的详细过程：

1. **第一次挥手**：
   - 客户端发送一个带有 `FIN` 标志的 TCP 段到服务器，表示客户端已经没有数据要发送。
   - 客户端进入 `FIN-WAIT-1` 状态。

2. **第二次挥手**：
   - 服务器收到客户端的 `FIN` 段后，发送一个带有 `ACK` 标志的 TCP 段作为确认。
   - 服务器进入 `CLOSE-WAIT` 状态。
   - 客户端进入 `FIN-WAIT-2` 状态。

3. **第三次挥手**：
   - 服务器处理完未发送的数据后，发送一个带有 `FIN` 标志的 TCP 段到客户端，表示服务器也没有数据要发送。
   - 服务器进入 `LAST-ACK` 状态。

4. **第四次挥手**：
   - 客户端收到服务器的 `FIN` 段后，发送一个带有 `ACK` 标志的 TCP 段作为确认。
   - 客户端进入 `TIME-WAIT` 状态，等待 2MSL（最大段寿命）时间后，进入 `CLOSED` 状态。
   - 服务器收到客户端的 `ACK` 段后，进入 `CLOSED` 状态。

### 为什么需要四次挥手

1. **数据处理**：
   - 服务器在收到客户端的 `FIN` 段后，可能还有未发送的数据需要处理。因此，服务器需要发送一个 `FIN` 段来表示自己也没有数据要发送。

2. **确认机制**：
   - 每个 `FIN` 段都需要一个 `ACK` 段来确认，以确保双方都正确地处理了断开连接的请求。

3. **防止数据丢失**：
   - 通过四次握手，可以确保在断开连接前，所有未发送的数据都已正确传输，防止数据丢失。

#### 为什么TIME_WAIT状态需要经过2MSL(最大报文段生存时间)才能返回到CLOSE状态？

原因有二：
一、保证TCP协议的全双工连接能够可靠关闭
二、保证这次连接的重复数据段从网络中消失

先说第一点，如果Client直接CLOSED了，那么由于IP协议的不可靠性或者是其它网络原因，导致Server没有收到Client最后回复的ACK。那么Server就会在超时之后继续发送FIN，此时由于Client已经CLOSED了，就找不到与重发的FIN对应的连接，最后Server就会收到RST而不是ACK，Server就会以为是连接错误把问题报告给高层。这样的情况虽然不会造成数据丢失，但是却导致TCP协议不符合可靠连接的要求。所以，Client不是直接进入CLOSED，而是要保持TIME_WAIT，当再次收到FIN的时候，能够保证对方收到ACK，最后正确的关闭连接。

再说第二点，如果Client直接CLOSED，然后又再向Server发起一个新连接，我们不能保证这个新连接与刚关闭的连接的端口号是不同的。也就是说有可能新连接和老连接的端口号是相同的。一般来说不会发生什么问题，但是还是有特殊情况出现：假设新连接和已经关闭的老连接端口号是一样的，如果前一次连接的某些数据仍然滞留在网络中，这些延迟数据在建立新连接之后才到达Server，由于新连接和老连接的端口号是一样的，又因为TCP协议判断不同连接的依据是socket pair，于是，TCP协议就认为那个延迟的数据是属于新连接的，这样就和真正的新连接的数据包发生混淆了。所以TCP连接还要在TIME_WAIT状态等待2倍MSL，这样可以保证本次连接的所有数据都从网络中消失。
