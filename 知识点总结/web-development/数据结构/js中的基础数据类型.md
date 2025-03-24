在JavaScript中，基础数据类型（也称为原始数据类型）是指那些最基本的、不可再分的数据类型。这些类型包括：

### 1. **布尔值（Boolean）**

- **描述**：表示真（`true`）或假（`false`）的值。
- **示例**：

  ```javascript
  let isTrue = true;
  let isFalse = false;
  ```

### 2. **数字（Number）**

- **描述**：用于表示整数和浮点数。JavaScript中的数字都是双精度浮点数。
- **示例**：

  ```javascript
  let integer = 42;
  let float = 3.14;
  ```

### 3. **字符串（String）**

- **描述**：用于表示文本数据，可以使用单引号（`'`）或双引号（`"`）包围。
- **示例**：

  ```javascript
  let name = 'Alice';
  let greeting = "Hello, " + name;
  ```

### 4. **空值（Null）**

- **描述**：表示一个空值或不存在的值。它是一个单例对象，类型为 `object`，但通常被视为一个基础数据类型。
- **示例**：

  ```javascript
  let emptyValue = null;
  ```

### 5. **未定义（Undefined）**

- **描述**：表示一个未赋值的变量。当声明一个变量但未赋值时，其默认值为 `undefined`。
- **示例**：

  ```javascript
  let undeclared;
  console.log(undeclared); // 输出: undefined
  ```

### 6. **符号（Symbol）**

- **描述**：表示独一无二的标识符。ES6引入的新型基础数据类型，主要用于对象属性的键，确保属性名的唯一性。
- **示例**：

  ```javascript
  let sym1 = Symbol('key1');
  let sym2 = Symbol('key1');
  console.log(sym1 === sym2); // 输出: false
  ```

### 7. **大整数（BigInt）**

- **描述**：表示任意精度的整数。ES11引入的新型基础数据类型，用于处理超过 `Number` 类型范围的整数。
- **示例**：

  ```javascript
  let bigInt = 1234567890123456789012345678901234567890n;
  ```

### 检查数据类型

在JavaScript中，可以使用 `typeof` 运算符来检查变量的数据类型。需要注意的是，`typeof null` 会返回 `"object"`，这是一个历史遗留问题。

```javascript
console.log(typeof true);          // "boolean"
console.log(typeof 42);            // "number"
console.log(typeof 3.14);          // "number"
console.log(typeof 'Hello');       // "string"
console.log(typeof null);          // "object" (历史遗留问题)
console.log(typeof undefined);     // "undefined"
console.log(typeof Symbol('key1')); // "symbol"
console.log(typeof 1234567890123456789012345678901234567890n); // "bigint"
```

### 总结

- **布尔值（Boolean）**：`true` 或 `false`
- **数字（Number）**：整数和浮点数
- **字符串（String）**：文本数据
- **空值（Null）**：表示空值
- **未定义（Undefined）**：表示未赋值的变量
- **符号（Symbol）**：独一无二的标识符
- **大整数（BigInt）**：任意精度的整数

这些基础数据类型是JavaScript中的核心部分，了解和掌握它们对于编写高效的JavaScript代码至关重要。
