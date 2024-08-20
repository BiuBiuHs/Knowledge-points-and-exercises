async function fetchStatus(url) {
	const res = await fetch(url)
	return res.status
}

// 上面的 await 函数等价于下方的函数
function fetchStatus(url) {
	return fetch(url).then((response) => response.status)
}

/**
 *  async  函数特点
 * 1。await 后面应该跟一个Promise 如果不是promise 则会被强制转换为promise
 * 也就是调用 promise.resolve(xxx)
 * 2. await 后可以跟随任何具有 then 方法的对象 或者说 “thenable"的对象，也就是说非Promise 也可以放在await 后
 *
 * 3.***重要 async函数的返回值是 Promise 对象，这比 Generator 函数的返回值是 Iterator 对象方便多了。你可以用then方法指定下一步的操作。
 *  调用 async 函数后 默认会得到一个 pending 状态的promise 需要使用then 来进行下一步操作 或 获取数据
 */

/**
 * 
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}


async function async2() {
  console.log("async2");
}

*******重点看这里的等价转换******

async 函数要等待所有的await 后跟随的函数执行完毕，且状态变更后才会执行 await后面的语句 
相当于以下语句  then里面的都会放到此次微任务队列中等待执行。
new promise((reslove,rej)=>{
  console.log('async1 start')
  async2()
  resolve()
}).then(()=>{
  console.log('async1 end ')
})

 */

//eg：执行顺序
async function async1() {
	console.log('async1 start')
	await async2()
	console.log('async1 end')
}

async function async2() {
	console.log('async2')
}

console.log('script start')

setTimeout(function () {
	console.log('setTimeout')
}, 0)

async1()

new Promise(function (resolve) {
	console.log('promise1')
	resolve()
}).then(function () {
	console.log('promise2')
})

console.log('script end')

//下方是代码执行顺序

//   VM178:11 script start
//   VM178:2 async1 start
//   VM178:8 async2
//   VM178:20 promise1
//   VM178:26 script end
//   VM178:4 async1 end
//   VM178:23 promise2
//   VM178:14 setTimeout
