function extend(sub, sup, prototype) {
    sub.prototype = Object.create(sup.prototype)
    sub.prototype.constructor = sub
  
    for (var k in prototype) {
      sub.prototype[k] = prototype[k]
    }
  }
  
  function B(name) {
    this.name = name
  }
  
  B.prototype.constructor = B
  B.prototype.logName = function() {
    console.log('My name is ' + this.name + '.')
  }
  
  function BB(name, age) {
    B.call(this, name)
    this.age = age
  }
  
  extend(BB, B, {
    logAge: function() {
      console.log('I\'m ' + this.age + ' years old.')
    }
  })
  