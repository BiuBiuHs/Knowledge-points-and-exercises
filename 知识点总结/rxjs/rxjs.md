### rxjs流的概念

RxJS世界中有一种特殊的对象，称为“流”（stream），在本书中，也会以“数据流”或者“Observable对象”称呼这种对象实例。
作为对RxJS还一无所知的初学者，目前可以把一个“数据流”对象理解为一条河流，数据就是这条河流中流淌的水。

### 流的表示

代表“流”的变量标示符，都是用$符号结尾，这是RxJS编程中普遍使用的风格，被称为“芬兰式命名法”
eg: MouseDown$ MouseUp$ 

#### rxjs的编程思想 1。函数式 2.响应式

#### 1.函数式编程

顾名思义，函数式编程就是非常强调使用函数来解决问题的一种编程方式。几乎任何一种编程语言都支持函数，但是函数式编程对函数的使用有一些特殊的要求，这些要求包括以下几点：

·声明式（Declarative）

·纯函数（Pure Function）

·数据不可变性（Immutability）
##### 1.1 声明式编程
```
function addOne(arr) {
  const results = []
  for (let i = 0; i < arr.length; i++){
    results.push(arr[i] + 1)
  }
  return results
}
```
##### 1.2 函数式编程
利用map中封装好的函数进行代码简化
```
const double = arr => arr.map(item => item * 2);
const addOne = arr => arr.map(item => item + 1);

```

##### 1.3 纯函数

所谓纯函数，指的是满足下面两个条件的函数。

·函数的执行过程完全由输入参数决定，不会受除参数之外的任何数据影响。

·函数不会修改任何外部状态，比如修改全局变量或传入的参数对象。