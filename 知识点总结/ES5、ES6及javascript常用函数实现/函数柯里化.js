// 第二版
// function sub_curry(fn) {
//     var args = [].slice.call(arguments, 1);
//     return function() {
//         return fn.apply(this, args.concat([].slice.call(arguments)));
//     };
// }

// function curry(fn, length) {

//     length = length || fn.length;

//     var slice = Array.prototype.slice;

//     return function() {
//         if (arguments.length < length) {
//             var combined = [fn].concat(slice.call(arguments));
//             return curry(sub_curry.apply(this, combined), length - arguments.length);
//         } else {
//             return fn.apply(this, arguments);
//         }
//     };
// }


function curry(fn, ...args) {
    return function(...innerArgs) {
        const allArgs = [...args, ...innerArgs];
        
        if (fn.length <= allArgs.length) {
            // 说明已经接受完所有参数，这个时候可以执行了
            return fn.apply(this, allArgs);
        } else {
            // 继续返回函数，收集参数
            return curry(fn, ...allArgs);
        }
    }
}