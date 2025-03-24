在JavaScript中，`undefined` 和 `null` 都表示“无”或“空”的概念，但它们在用途和语义上有所不同。下面详细解释这两者之间的区别：

### 1. **Undefined**

#### 描述

- **类型**：`undefined` 是一个基础数据类型。
- **值**：表示一个未定义的值。
- **用途**：通常用于表示变量已经声明但未赋值的情况，或者对象属性不存在时的默认值。

#### 示例

```javascript
let undeclared;
console.log(undeclared); // 输出: undefined

let obj = {};
console.log(obj.property); // 输出: undefined
```

#### 语义

- **变量未赋值**：当声明一个变量但未赋值时，其默认值为 `undefined`。

  ```javascript
  let x;
  console.log(x); // 输出: undefined
  ```

- **对象属性不存在**：当访问一个对象中不存在的属性时，返回 `undefined`。

  ```javascript
  let obj = {};
  console.log(obj.someProperty); // 输出: undefined
  ```

- **函数参数未传递**：当函数调用时未传递某些参数时，这些参数的值为 `undefined`。

  ```javascript
  function logValues(a, b) {
    console.log(a, b);
  }

  logValues(1); // 输出: 1 undefined
  ```

### 2. **Null**

#### 描述

- **类型**：`null` 是一个基础数据类型，但其类型在 `typeof` 检查时会返回 `"object"`，这是一个历史遗留问题。
- **值**：表示一个空值或不存在的值。
- **用途**：通常用于表示一个有意设置为空的值，或者表示某个值的缺失。

#### 示例

```javascript
let emptyValue = null;
console.log(emptyValue); // 输出: null

let obj = {
  property: null
};
console.log(obj.property); // 输出: null
```

#### 语义

- **有意设置为空**：当一个变量或对象属性被有意设置为空时，使用 `null`。

  ```javascript
  let data = null;
  console.log(data); // 输出: null
  ```

- **表示缺失的值**：在某些情况下，`null` 用于表示某个值的缺失。

  ```javascript
  let user = {
    name: "Alice",
    address: null
  };
  console.log(user.address); // 输出: null
  ```

### 主要区别

1. **类型和值**：
   - `undefined` 是一个基础数据类型，表示未定义的值。
   - `null` 也是一个基础数据类型，但其类型在 `typeof` 检查时会返回 `"object"`，表示一个空值或不存在的值。

2. **用途**：
   - `undefined` 通常用于表示变量已经声明但未赋值的情况，或者对象属性不存在时的默认值。
   - `null` 通常用于表示一个有意设置为空的值，或者表示某个值的缺失。

3. **赋值和检查**：
   - `undefined` 通常由JavaScript引擎自动赋值，例如声明但未赋值的变量。
   - `null` 通常由开发者显式赋值。

### 示例代码

```javascript
// undefined 示例
let undeclared;
console.log(undeclared); // 输出: undefined

let obj = {};
console.log(obj.property); // 输出: undefined

function logValues(a, b) {
  console.log(a, b);
}
logValues(1); // 输出: 1 undefined

// null 示例
let emptyValue = null;
console.log(emptyValue); // 输出: null

let user = {
  name: "Alice",
  address: null
};
console.log(user.address); // 输出: null

// 类型检查
console.log(typeof undefined); // 输出: "undefined"
console.log(typeof null); // 输出: "object" (历史遗留问题)
```

### 总结

- **`undefined`**：表示变量已声明但未赋值，或对象属性不存在时的默认值。
- **`null`**：表示一个有意设置为空的值，或表示某个值的缺失。

理解这两个值的区别有助于你在编写JavaScript代码时更准确地使用它们，避免潜在的错误。
