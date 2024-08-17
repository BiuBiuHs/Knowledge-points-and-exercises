function subRise (arr,k) {

    let stack  = []
    for(var i =0; i < arr.length ; i++) {
        let curItem = arr[i]
        const leftItem = arr.length - i 

        //需要注意的是这里 
        //1.需要将剩余的元素 与栈中的元素相加 与 限制个数k做比较 来决定是否需要将栈顶的元素出栈
        //2.栈中还有元素
        //3.栈顶元素需要大于当前元素
        while(stack.length && (leftItem + stack.length) > k && stack[stack.length -1] > curItem){
            stack.pop()
        }
        stack.push(curItem)
    }
    //当数组便利完成后 可能存在整个栈中元素都是升序的 
    //栈中元素的数量可能超过了 k个的限制 需要将多余的元素弹出
    while(stack.length > k){
        stack.pop()
    }

    return stack
}

const arr = [9, 2, 4, 5, 1, 2, 3, 0]
const k =3
subRise(arr,k)