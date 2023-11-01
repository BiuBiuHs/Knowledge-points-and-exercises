// 找到右边第一个比我小的元素

function rightFirstMinItem (arr) {
    let stack = []
    let res = []
    for(var i =0; i < arr.length; i++) {
        let cur  = arr[i]
        while(stack.length && arr[stack[stack.length - 1]] >cur){
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





