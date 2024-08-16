
// 左侧第一个比我小的元素下标
function leftFirstMinItem (arr) {

    let stack = []
    let ans = []

    // 寻找坐标此时需要从数组末尾开始遍历
    for(var i = arr.length -1; i >=0; i--){
        let curItem = arr[i]
        while(stack.length && arr[stack[stack.length -1]] > curItem ){
            const index = stack.pop()
            ans[index] = i
        }
        stack.push(i)
    }

    while(stack.length) {
        const index = stack.pop()
            ans[index] = -1
    }

    return ans 

}

//左边第一个比我大的元素
function leftFirstMaxItem (arr) {

    let stack = []
    let ans = []

    // 寻找坐标此时需要从数组末尾开始遍历
    for(var i = arr.length -1; i >=0; i--){
        let curItem = arr[i]
        while(stack.length && arr[stack[stack.length -1]] < curItem ){
            const index = stack.pop()
            ans[index] = i
        }
        stack.push(i)
    }

    while(stack.length) {
        const index = stack.pop()
            ans[index] = -1
    }

    return ans 

}