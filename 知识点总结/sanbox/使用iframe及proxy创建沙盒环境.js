// 沙箱全局代理对象类
class SandboxGlobalProxy {
    constructor(blacklist) {
      // 创建一个 iframe 标签，取出其中的原生浏览器全局对象作为沙箱的全局对象
      const iframe = document.createElement("iframe", { url: "about:blank" });
      iframe.style.display = "none";
      document.body.appendChild(iframe);
  
      // 获取当前HTMLIFrameElement的Window对象
      const sandboxGlobal = iframe.contentWindow;
  
      return new Proxy(sandboxGlobal, {
        // has 可以拦截 with 代码块中任意属性的访问
        has: (target, prop) => {
  
          // 黑名单中的变量禁止访问
          if (blacklist.includes(prop)) {
            throw new Error(`Can't use: ${prop}!`);
          }
          // sandboxGlobal对象上不存在的属性，直接报错，实现禁用三方库调接口
          if (!target.hasOwnProperty(prop)) {
            throw new Error(`Not find: ${prop}!`);
          }
  
          // 返回true，获取当前提供上下文对象中的变量；如果返回false，会继续向上层作用域链中查找
          return true;
        }
      });
    }
  }
  
  // 使用with关键字，来改变作用域
  function withedYourCode(code) {
    code = "with(sandbox) {" + code + "}";
    return new Function("sandbox", code);
  }
  
  // 将指定的上下文对象，添加到待执行代码作用域的顶部
  function makeSandbox(code, ctx) {
    withedYourCode(code).call(ctx, ctx);
  }
  
  // 待执行的代码code，获取document对象
  const code = `console.log(document)`;
  
  // 设置黑名单
  // 经过小伙伴的指导，新添加Image字段，禁止使用new Image来调接口
  const blacklist = ['window', 'document', 'XMLHttpRequest', 'fetch', 'WebSocket', 'Image'];
  
  // 将globalProxy对象，添加到新环境作用域链的顶部
  const globalProxy = new SandboxGlobalProxy(blacklist);
  
  makeSandbox(code, globalProxy);