async function fetchStatus(url) {
    const res = await fetch(url);
    return res.status
}

// 上面的 await 函数等价于下方的函数
function fetchStatus(url){
    return fetch(url).then(response=>response.status)
}

/**
 *  async  函数特点 
 * 1。await 后面应该跟一个Promise 如果不是promise 则会被强制转换为promise 
 * 也就是调用 promise.resolve(xxx)
 * 2. await 后可以跟随任何具有 then 方法的对象 或者说 “thenable"的对象，也就是说非Promise 也可以放在await 后
 * 
 */

 //eg：执行顺序
async function async1() {
    console.log("async1 start");
    await async2();
    console.log("async1 end");
  }
  
  async function async2() {
    console.log("async2");
  }
  
  console.log("script start");
  
  setTimeout(function() {
    console.log("setTimeout");
  }, 0);
  
  async1();
  
  new Promise(function(resolve) {
    console.log("promise1");
    resolve();
  }).then(function() {
    console.log("promise2");
  });
  
  console.log("script end");
  
  
  //下方是代码执行顺序  

//   VM178:11 script start
//   VM178:2 async1 start
//   VM178:8 async2
//   VM178:20 promise1
//   VM178:26 script end
//   VM178:4 async1 end
//   VM178:23 promise2
//   undefined
//   VM178:14 setTimeout