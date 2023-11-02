// 找到右边第一个比我小的元素

function rightFirstMinItem (arr) {
    let stack = []
    let res = []
    for(var i =0; i < arr.length; i++) {
        let cur  = arr[i]
        /**
         * arr[stack[stack.length-1]]
         * 入栈的才是当前位置的元素 
         * cur是数组中各个元素 
         * 
         * 栈内保存的是元素的index
         * 
         * 因此要寻找第一个比栈顶元素小的元素的index
         * 拿到栈顶的index 的值 与当前for循环中的值 做比较 
         * 如果栈顶元素大于此次循环中的元素值 说明找到了第一个比它小的值的index
         */
        while(stack.length && arr[stack[stack.length - 1]] > cur){
            const index = stack.pop()
            res[index] = i
        }
        stack.push(i)
    }
    while(stack.length) {
        const index = stack.pop()
        res[index] = -1
    }
    return res 
}

const arr  = [1,2,4,9,4,0,5]

rightMinItem(arr)


/// 找到右边第一个比我大的元素
function rightFirstMaxItem (arr) {
    //使用栈来操作 此时栈是递减栈
    let stack = []
    let res = []
    for(var i =0; i < arr.length; i++) {
        let cur  = arr[i]
        //栈内有内容且，栈顶元素比当前元素小 则出栈
        while(stack.length && arr[stack[stack.length - 1]] < cur){
            const index = stack.pop()
            res[index] = i
        }
        stack.push(i)
    }
    while(stack.length) {
        const index = stack.pop()
        res[index] = -1
    }
    return res 
}





