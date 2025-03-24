在 JavaScript 中，变量提升（Hoisting）是一种行为，其中变量和函数声明会被提升到其作用域的顶部。这意味着你可以在声明变量或函数之前使用它们，而不会导致语法错误。然而，变量提升的具体行为和优先级有一些细节需要注意。

### 变量提升的行为

1. **变量声明提升**：
   - 变量声明（使用 `var`）会被提升到其作用域的顶部，但赋值不会提升。
   - 例如：

     ```javascript
     console.log(x); // 输出: undefined
     var x = 5;
     console.log(x); // 输出: 5
     ```

2. **函数声明提升**：
   - 函数声明会被完整地提升到其作用域的顶部，包括函数体。
   - 例如：

     ```javascript
     console.log(add(2, 3)); // 输出: 5
     function add(a, b) {
       return a + b;
     }
     ```

3. **函数表达式**：
   - 函数表达式不会被提升，只有变量声明会被提升。
   - 例如：

     ```javascript
     console.log(add(2, 3)); // 抛出 ReferenceError: add is not a function
     var add = function(a, b) {
       return a + b;
     };
     ```

4. **`let` 和 `const` 声明**：
   - `let` 和 `const` 声明也会被提升，但不会被初始化（称为“暂时性死区”TDZ）。
   - 例如：

     ```javascript
     console.log(x); // 抛出 ReferenceError: Cannot access 'x' before initialization
     let x = 5;
     console.log(x); // 输出: 5
     ```

### 变量提升的优先级

1. **函数声明 > 变量声明**：
   - 如果一个作用域中既有函数声明又有变量声明，函数声明会优先于变量声明。
   - 例如：

     ```javascript
     console.log(add); // 输出: [Function: add]
     function add(a, b) {
       return a + b;
     }
     var add = 10;
     console.log(add); // 输出: 10
     ```

2. **变量声明 > 未声明的赋值**：
   - 变量声明会优先于未声明的赋值。
   - 例如：

     ```javascript
     console.log(x); // 输出: undefined
     x = 5;
     var x;
     console.log(x); // 输出: 5
     ```

### 暂时性死区（Temporal Dead Zone, TDZ）

- `let` 和 `const` 声明在声明之前访问会抛出 `ReferenceError`，这是因为它们在声明之前处于暂时性死区。
- 例如：

  ```javascript
  console.log(x); // 抛出 ReferenceError: Cannot access 'x' before initialization
  let x = 5;
  console.log(x); // 输出: 5
  ```

### 总结

- **`var` 声明**：提升变量声明，但不提升赋值。
- **函数声明**：完整提升函数声明。
- **函数表达式**：仅提升变量声明，不提升函数体。
- **`let` 和 `const` 声明**：提升变量声明，但不提升赋值，并且在声明之前访问会抛出 `ReferenceError`。

理解这些提升行为和优先级有助于避免常见的 JavaScript 陷阱，编写更可靠的代码。
