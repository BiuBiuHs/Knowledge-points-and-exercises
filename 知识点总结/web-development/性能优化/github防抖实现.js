
//包括可立即执行代码 与返回函数结果
function debounce(func, wait, immediate) {

    var timeout, result;

    return function () {
        var context = this;
        var args = arguments;

        if (timeout) clearTimeout(timeout);
        if (immediate) {
            // 如果已经执行过，不再执行
            var callNow = !timeout;
            timeout = setTimeout(function(){
                //clearTimeOut不意味着 timeout的id变为空 每次执行setTimeout会返回一个新的计数器Id
                //所以说能够影响立即执行的原因就是 timeout是否存在 
                timeout = null;
            }, wait)
            if (callNow) result = func.apply(context, args)
        }
        else {
            timeout = setTimeout(function(){
                //就算将函数的执行结果赋值给result 
                //由于是setTimeOut 回先执行 下方的return result 导致result一直是undefined 
                //所以在immediate是false时 不会拿到函数执行结果 
                func.apply(context, args)
            }, wait);
        }
        return result;
    }
}