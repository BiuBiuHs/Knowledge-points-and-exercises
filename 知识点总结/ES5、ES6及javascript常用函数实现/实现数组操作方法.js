// 实现数组reduce
Array.prototype.myReduce = function (...args) {
    const hasInitialValue = args.length > 1
    if (!hasInitialValue && this.length === 0) {
      throw new Error()
    }
  
    let result = hasInitialValue ? args[1] : this[0]
  console.log(args[1],'args1')
  console.log(this[0],'this 0')
        //this 就是调用的reduce的数组 
    for (let i = hasInitialValue ? 0 : 1;  i < this.length; i++) {
        //四个参数 因为reduce的callback 默认就支持四个参数。
      result = args[0](result, this[i], i, this)
    }
  
    return result
  }
  
  
  // [1,2,3].myReduce((prev,next)=>{return prev + next},0)
  