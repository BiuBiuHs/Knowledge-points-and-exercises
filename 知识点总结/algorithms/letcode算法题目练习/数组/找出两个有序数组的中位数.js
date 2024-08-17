function median(arr1, arr2) {
    let totalLen = arr1.length + arr2.length

    //有符号右移一位 等于对该整数 除2 
    //会转换为2进制 进行右移
    let step = (totalLen >> 1) + 1

  
    let m1 = 0, m2 = 0, p1 = 0, p2 = 0
    // 当while的条件先判断 step是否满足条件 
    //满足条件之后 step会-1 所以在while循环中 step的值会 === step的初始 - 1 
    //eg： step = 3  在while循环中step 的第一次打印的值就会是 2
    while(step--) {
      console.log(step,'step')
      //记录上一个数字
      m1 = m2
      //循环到 中位数的下标
      if ((arr1[p1] || Infinity) < (arr2[p2] || Infinity)) {
        m2 = arr1[p1++]
      } else {
        m2 = arr2[p2++]
      }
    }
    //如果是偶数 相加计算中位数 ，奇数直接返回中位数下标的数字即可
    return totalLen % 2 === 0 ? (m1 + m2) / 2 : m2
  }
  
  median([1,2],[3,4])