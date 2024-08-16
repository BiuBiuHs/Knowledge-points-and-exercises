
//github地址
https://github.com/mqyqingfeng/Blog/issues/22
// ### 函数防抖实现
// 每次点击都会清除上一个定时器 函数 ，重新生成一个新的定时器函数 ，一段时间后执行

    function debounc(func,dely){
        let timer = null
        return function () {
            if(timer) clearTimeout(timer)
            timer = setTimeout(()=>{
                func()
            },dely)
        }
    }

    //github博客版本
    // 最终版
    function debounce(func, wait, immediate) {

        var timeout, result;

        var debounced = function () {
            var context = this;
            var args = arguments;

            if (timeout) clearTimeout(timeout);
            if (immediate) {
                // 如果已经执行过，不再执行
                var callNow = !timeout;
                timeout = setTimeout(function(){
                    timeout = null;
                }, wait)
                if (callNow) result = func.apply(context, args)
            }
            else {
                timeout = setTimeout(function(){
                    func.apply(context, args)
                }, wait);
            }
            return result;
        };

        debounced.cancel = function() {
            clearTimeout(timeout);
            timeout = null;
        };

        return debounced;
    }



// ## 函数节流

// 每隔一段时间 执行一次 
    function throttle(func,delay) {
      let timer = null
      return function(){
        if(time) return 
        timer = setTimeout(()=>{
          func.call(this,arguments)
          timer = null
        },delay)
      }
    }


//  节流
//  /**
//  * 第五版 添加取消方法 用法跟 debounce 相同
//  */

    var count = 1;
    var container = document.getElementById('container');

    function getUserAction() {
        container.innerHTML = count++;
    };

    var setUseAction = throttle(getUserAction, 10000);

    container.onmousemove = setUseAction

    document.getElementById("button").addEventListener('click', function(){
        setUseAction.cancel();
    })

    function throttle(func, wait, options) {
        var timeout, context, args, result;
        var previous = 0;
        if (!options) options = {};

        var later = function() {
            previous = options.leading === false ? 0 : new Date().getTime();
            timeout = null;
            func.apply(context, args);
            if (!timeout) context = args = null;
        };

        var throttled = function() {
            var now = new Date().getTime();
            if (!previous && options.leading === false) previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                func.apply(context, args);
                if (!timeout) context = args = null;
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
        };

        throttled.cancel = function() {
            clearTimeout(timeout);
            previous = 0;
            timeout = null;
        };

        return throttled;
    }



    //BFE.dev
    //节流 
    function throttle(func, wait, option = { leading: true, trailing: true }) {
        var { leading, trailing } = option;
        var lastArgs = null;
        var timer = null;
      
        const setTimer = () => {
          if (lastArgs && trailing) {
            func.apply(this, lastArgs);
            lastArgs = null;
            timer = setTimeout(setTimer, wait);
          } else {
            timer = null;
          }
        };
      
        return function (...args) {
          if (!timer) {
            if (leading) {
              func.apply(this, args);
            }
            timer = setTimeout(setTimer, wait);
          } else {
            lastArgs = args;
          }
        }
      }

      //防抖
    //每次输入都会清空上一个timer 开启一个新的timer  等到停止输入后指定的秒数后 出发callback 
      function debounce(func, wait, option = {leading: false, trailing: true}) {
        let timer = null
      
        return function(...args) {
      
          let isInvoked = false
          // if not cooling down and leading is true, invoke it right away
          if (timer === null && option.leading) {
            func.call(this, ...args)
            isInvoked = true
          }
      
          // no matter what, timer needs to be reset
          window.clearTimeout(timer)
          timer = window.setTimeout(() => {
            if (option.trailing && !isInvoked) {
              func.call(this, ...args)
            }
      
            timer = null
          }, wait)
        }
      }

