if (a == 1 && a == 2 && a == 3) {
    console.log('Win')
  }

//   1.两个等号时 可以使用访问后自加处理
//利用了访问a后自加1 与尹式类型转换 让等号左侧字符串转换为数字  再和右侧数字 对比
const a = {
    _a: 0,
    toString: function() {
      return ++a._a
    }
  }


// 2 三个等号时 如何处理  使用object.defineproperty

Object.defineProperties(window, {
    _a: {
      value: 0,
      writable: true
    },
    a: {
      get: function() {
        return  ++_a
      }
    }
  })
