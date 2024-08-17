// 两个数组一个是鱼的大小，一个是鱼的方向 
// 每次向 左/右游动一个单位  方向不同且鱼的大小不同时才能吃掉小鱼
//使用栈来解题

function leaveFish(fishSize,fishDirection) {
    let stack = []
    for(var i =0 ;i < fishSize.length; i++) {
        let hasEat = false
        const curFishSize = fishSize[i]
        const curFishDir = fishDirection[i];
        //与括号匹配消除不同，在此时需要while循环一直匹配到不能吃的鱼为止
        //用当前元素与栈顶元素 比较，直到满足当前元素被消除 或者栈中没有元素为止
        while(stack.length && fishDirection[stack.length - 1] !== curFishDir) {
            if(fishSize[stack.length -1] > curFishSize) {
                hasEat = true
                break
            }
            stack.pop()
        }
        if(!hasEat) {
            stack.push(i)
        }
    }
    return stack.length
}