call、apply 和 bind 这三个函数都是用于改变函数执行时的上下文（即 this 指向），但它们在使用方式和具体行为上有一些区别。让我们详细比较一下：

1. call 方法

   - 语法：`func.call(thisArg, arg1, arg2, ...)`
   - 立即执行函数
   - 参数列表：第一个参数是 this 的指向，后面的参数以逗号分隔列出

   ```javascript
   function greet(greeting) {
     console.log(`${greeting}, ${this.name}`);
   }

   const person = { name: 'John' };
   greet.call(person, 'Hello'); // 输出: Hello, John
   ```

2. apply 方法

   - 语法：`func.apply(thisArg, [argsArray])`
   - 立即执行函数
   - 参数列表：第一个参数是 this 的指向，第二个参数是一个数组或类数组对象

   ```javascript
   function greet(greeting, punctuation) {
     console.log(`${greeting}, ${this.name}${punctuation}`);
   }

   const person = { name: 'John' };
   greet.apply(person, ['Hello', '!']); // 输出: Hello, John!
   ```

3. bind 方法

   - 语法：`func.bind(thisArg[, arg1[, arg2[, ...]]])`
   - 返回一个新函数，不会立即执行
   - 可以预设部分参数（部分应用）

   ```javascript
   function greet(greeting, punctuation) {
     console.log(`${greeting}, ${this.name}${punctuation}`);
   }

   const person = { name: 'John' };
   const boundGreet = greet.bind(person, 'Hello');
   boundGreet('!'); // 输出: Hello, John!
   ```

主要区别：

1. 执行时机：
   - call 和 apply 会立即执行函数
   - bind 返回一个新函数，可以稍后执行

2. 参数传递：
   - call 接受一系列参数
   - apply 接受一个参数数组
   - bind 可以预设部分参数，返回的新函数可以接受剩余参数

3. 使用场景：
   - call 通常用于明确知道参数数量的情况
   - apply 常用于参数数量不确定或者要传递数组作为参数的情况
   - bind 常用于需要稍后执行的函数，或者需要固定某些参数的场景

4. 返回值：
   - call 和 apply 返回函数执行的结果
   - bind 返回一个新的函数

5. 性能：
   - 在现代 JavaScript 引擎中，call 通常比 apply 略快
   - bind 会创建一个新函数，可能会有轻微的性能开销

理解这些差异可以帮助你在不同场景下选择最合适的方法来操作函数的执行上下文和参数。
