//传入一个数组 ，返回一个大乱的数组 使得每个数组元素在新数组中出现的概率是相等的


function shuffle(nums) {
    const ans = []
    while(nums.length) {
        const index = Math.floor(Math.random() * nums.length )
        const curItem = nums[index]
        ans.push(curItem)
        nums.splice(index,1)
    }
    return ans
}

shuffle([1,2,3,4])