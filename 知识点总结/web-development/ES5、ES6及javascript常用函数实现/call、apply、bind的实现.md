理解 `call`、`apply` 和 `bind` 的实现原理是深入掌握 JavaScript 的重要一步。让我们逐个实现这些方法：

1. call 的实现：

```javascript
Function.prototype.myCall = function(context, ...args) {
  // 如果没有传入 context 或传入的是 null/undefined，则使用全局对象
  context = context || window;
  
  // 为 context 创建一个唯一的属性以储存函数
  const fnSymbol = Symbol();
  context[fnSymbol] = this;

  // 执行函数并保存结果
  const result = context[fnSymbol](...args);

  // 删除添加的属性
  delete context[fnSymbol];

  // 返回函数执行结果
  return result;
};
```

2. apply 的实现：

```javascript
Function.prototype.myApply = function(context, argsArray) {
  // 如果没有传入 context 或传入的是 null/undefined，则使用全局对象
  context = context || window;
  
  // 为 context 创建一个唯一的属性以储存函数
  const fnSymbol = Symbol();
  context[fnSymbol] = this;

  // 执行函数并保存结果
  const result = argsArray ? context[fnSymbol](...argsArray) : context[fnSymbol]();

  // 删除添加的属性
  delete context[fnSymbol];

  // 返回函数执行结果
  return result;
};
```

### 实现 `bind` 函数

```javascript
Function.prototype.myBind = function (context, ...args1) {
  if (typeof this !== 'function') {
    throw new TypeError('myBind can only be called on functions');
  }

  const fn = this;

  return function boundFn(...args2) {
    // 合并参数
    const combinedArgs = args1.concat(args2);

    // 如果调用时 new 操作符创建了实例，则 this 应该是新创建的实例
    if (this instanceof boundFn) {
      return new fn(...combinedArgs);
    }

    // 否则，使用提供的 context
    return fn.apply(context, combinedArgs);
  };
};
```

### 解释

1. **检查调用者**：
   - `if (typeof this !== 'function')`：确保 `myBind` 是在一个函数上调用的，如果不是，抛出一个类型错误。

2. **保存原始函数**：
   - `const fn = this`：将当前函数保存到 `fn` 变量中，以便在返回的函数中使用。

3. **返回新函数**：
   - `return function boundFn(...args2)`：返回一个新函数 `boundFn`，该函数接受任意数量的参数 `args2`。

4. **合并参数**：
   - `const combinedArgs = args1.concat(args2)`：将 `bind` 时提供的参数 `args1` 和调用时提供的参数 `args2` 合并。

5. **处理 `new` 调用**：

   - `if (this instanceof boundFn)`：检查 `boundFn` 是否通过 `new` 调用。如果是，则使用 `new` 创建一个新实例，并调用原始函数 `fn`。
   也就是说 此时 的this 就指向了 通过调用 new boundFn() 而创造出来的一个新对象 那么此时这个新对象的原型链上 就有 boundFn 所以此时返回了true ，因为instanceof 就是通过原型链去寻找 是否是某个函数的实例
   - `return new fn(...combinedArgs)`：使用 `new` 创建一个新实例，并传递合并后的参数。

6. **普通调用**：
   - `return fn.apply(context, combinedArgs)`：使用 `apply` 调用原始函数 `fn`，并设置 `this` 上下文为 `context`，传递合并后的参数。

这些实现的关键点：

1. 对于 `call` 和 `apply`：
   - 我们将原函数作为一个临时属性添加到 `context` 对象上。
   - 使用 `Symbol` 确保属性名的唯一性，避免覆盖已有属性。
   - 执行这个临时添加的函数，然后删除它。
   - 返回函数的执行结果。

2. 对于 `bind`：
   - 返回一个新函数。
   - 新函数在执行时使用 `apply` 方法来设置 `this` 并传递参数。
   - 支持函数柯里化，允许在 `bind` 时和之后调用时分别传入参数。

3. 处理边界情况：
   - 当 `context` 为 `null` 或 `undefined` 时，默认使用全局对象（浏览器中的 `window`，Node.js 中的 `global`）。

4. 参数处理：
   - `call` 和 `bind` 使用剩余参数 `...args` 来处理可变数量的参数。
   - `apply` 直接使用传入的数组。

这些实现展示了 `call`、`apply` 和 `bind` 的基本原理。实际的原生实现可能更复杂，包含更多的错误处理和边界情况考虑。理解这些实现有助于深入理解 JavaScript 中的 `this` 绑定机制和函数调用方式。
