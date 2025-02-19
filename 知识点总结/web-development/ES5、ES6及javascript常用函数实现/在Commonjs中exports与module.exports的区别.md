在CommonJS环境中，模块导出主要通过 `module.exports` 和 `exports` 来实现。CommonJS是一种模块系统，广泛用于Node.js中。以下是CommonJS中常见的变量导出方法及其用法。

### 1. `module.exports`

`module.exports` 是一个对象，用于导出模块的成员。你可以将任何值（包括对象、函数、类等）赋值给 `module.exports`，从而导出这些值。

#### 导出一个对象

```javascript
// module.js
module.exports = {
  myFunction: function () {
    console.log('Hello, world!');
  },
  myVariable: 42
};
```

#### 导出一个函数

```javascript
// module.js
module.exports = function () {
  console.log('Hello, world!');
};
```

#### 导出一个类

```javascript
// module.js
class MyClass {
  constructor(name) {
    this.name = name;
  }

  greet() {
    console.log(`Hello, ${this.name}!`);
  }
}

module.exports = MyClass;
```

### 2. `exports`

`exports` 是 `module.exports` 的一个引用。你可以通过 `exports` 来导出模块的成员，但需要注意 `exports` 只能用于导出对象的属性，不能直接赋值为一个新的对象。

#### 导出多个成员

```javascript
// module.js
exports.myFunction = function () {
  console.log('Hello, world!');
};

exports.myVariable = 42;
```

#### 导出一个对象的属性

```javascript
// module.js
const myFunction = function () {
  console.log('Hello, world!');
};

const myVariable = 42;

exports.myFunction = myFunction;
exports.myVariable = myVariable;
```

### 3. 重写 `module.exports`

如果你需要导出一个全新的对象，而不是在 `exports` 上添加属性，可以直接重写 `module.exports`。

```javascript
// module.js
const myFunction = function () {
  console.log('Hello, world!');
};

const myVariable = 42;

module.exports = {
  myFunction: myFunction,
  myVariable: myVariable
};
```

### 4. 导出多个模块成员

你可以在一个模块中导出多个成员，使用 `module.exports` 或 `exports`。

```javascript
// module.js
exports.myFunction = function () {
  console.log('Hello, world!');
};

exports.myVariable = 42;

const myClass = class {
  constructor(name) {
    this.name = name;
  }

  greet() {
    console.log(`Hello, ${this.name}!`);
  }
};

module.exports.myClass = myClass;
```

### 导入模块

无论你使用 `module.exports` 还是 `exports`，导入模块的方式都是一样的。使用 `require` 函数来导入模块。

#### 导入一个对象

```javascript
// app.js
const myModule = require('./module.js');

myModule.myFunction(); // 输出: Hello, world!
console.log(myModule.myVariable); // 输出: 42
```

#### 导入一个函数

```javascript
// app.js
const myFunction = require('./module.js');

myFunction(); // 输出: Hello, world!
```

#### 导入一个类

```javascript
// app.js
const MyClass = require('./module.js');

const instance = new MyClass('Alice');
instance.greet(); // 输出: Hello, Alice!
```

### 总结

- **`module.exports`**：用于导出模块的成员，可以是一个对象、函数、类等。可以重写 `module.exports` 来导出一个新的对象。
- **`exports`**：是 `module.exports` 的一个引用，用于在 `module.exports` 对象上添加属性。不能直接赋值为一个新的对象。

通过理解这些导出方法，你可以在CommonJS环境中灵活地组织和管理模块的导出和导入。
