
// 就是useEffect和useLayoutEffect的执行时机不一样，

// useEffect被异步调度，当页面渲染完成后再去执行，不会阻塞页面渲染。 

// useLayoutEffect后者是在commit阶段新的DOM准备完成，但还未渲染到屏幕之前，同步执行。

//useLayoutEffect会阻塞浏览器渲染，useEffect 不会
//useLayoutEffect 执行先于 useEffect.


//useLayoutEffect 在浏览器绘制屏幕之前执行。
//useEffect 在浏览器绘制屏幕之后执行 。