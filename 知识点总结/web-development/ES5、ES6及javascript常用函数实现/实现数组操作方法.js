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
  

  //map

  Array.prototype.myMap = function (func,thisObj) {
    const res = []

    this.forEach((...args)=>{
        //此时args就是一个数组 [item,index] 
        const index = args[1]
        //调用callback 函数 apply参数为一个数组 
        //callback可以只读取item的值，但是需要支持读取index的值
        res[index] = func.apply(thisObj,args)
    })
  }