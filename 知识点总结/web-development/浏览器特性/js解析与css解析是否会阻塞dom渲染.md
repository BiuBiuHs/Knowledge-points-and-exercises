
### JavaScript 和 CSS 在 HTML 加载过程中的行为

#### 关键字

- JavaScript
- DOM
- 渲染
- 阻塞
- CSS
- 并行下载
- 样式闪烁
- `defer`
- `async`

#### JavaScript 的行为

**JavaScript 会阻塞 DOM 的解析和渲染。**

- **解析过程中的阻塞**:
  - 当浏览器在解析 HTML 文档，构建 DOM 树的过程中，如果遇到了 `<script>` 标签（没有 `defer` 或 `async` 属性），浏览器会暂停 DOM 的构建，转而去下载并执行 JavaScript 代码。
  - **原因**: JavaScript 有可能会改变 DOM 结构（例如通过 `document.write`），所以浏览器必须停下来，等待 JavaScript 代码执行完毕后再继续。

#### CSS 的行为

**CSS 不会阻塞 DOM 的解析，但会阻塞 DOM 的渲染。**

- **并行下载**:
  - 当浏览器在解析 HTML，构建 DOM 的过程中，如果遇到了 `<link rel="stylesheet">` 标签，浏览器会并行下载 CSS 文件。
  - **渲染阻塞**: 但在 CSS 下载并解析完成之前，浏览器不会进行页面的渲染。这是为了防止用户看到样式闪烁（也就是先看到没有样式的页面，然后突然变成有样式的页面）。

#### CSS 对 JavaScript 的影响

**CSS 会阻塞 JavaScript 的执行。**

- **检查未完成的 CSS**:
  - 当浏览器在解析 HTML 文档，构建 DOM 树的过程中，如果遇到了 `<script>` 标签，浏览器会检查此时是否有尚未完成的 CSS 样式表加载。
  - **暂停执行**: 如果有，浏览器会暂停 JavaScript 的执行，直到所有 CSS 样式表都加载并解析完成。
  - **原因**: JavaScript 可能会查询和操作 CSS 样式，所以必须确保 CSS 先加载完成。

#### 总结

- **JavaScript**:
  - 阻塞 DOM 的解析和渲染。
  - 通过 `defer` 和 `async` 属性可以优化执行顺序。

- **CSS**:
  - 不会阻塞 DOM 的解析，但会阻塞 DOM 的渲染。
  - 会阻塞 JavaScript 的执行，直到所有 CSS 样式表加载完成。

通过合理使用 `defer` 和 `async` 属性，可以优化页面加载性能和脚本执行顺序。

//async 与defer 都是都是异步的下载。（相较于 HTML 解析）
在 HTML 中，`<script>` 标签的 `defer` 和 `async` 属性对脚本的加载和执行顺序有重要影响。理解这些属性的行为对于确保脚本按预期加载和执行至关重要。

### 1. 没有 `defer` 或 `async` 属性

- **加载和解析**: 脚本会立即下载，并在下载完成后立即执行，阻塞 HTML 解析器。
- **执行顺序**: 按照脚本在 HTML 中出现的顺序执行。

### 2. `defer` 属性

- **加载和解析**: 脚本会立即下载，但不会立即执行，而是等到整个 HTML 文档解析完成后（即 `DOMContentLoaded` 事件触发前）再执行。
- **执行顺序**: 按照脚本在 HTML 中出现的顺序执行。

### 3. `async` 属性

- **加载和解析**: 脚本会立即下载，并在下载完成后立即执行，不阻塞 HTML 解析器。
- **执行顺序**: 不保证执行顺序，脚本下载完成后立即执行，可能会在文档解析完成前执行。

### 示例

假设你有以下 HTML 结构：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Script Execution Order</title>
</head>
<body>
  <script src="script1.js"></script>
  <script src="script2.js" defer></script>
  <script src="script3.js" async></script>
  <script src="script4.js" defer></script>
  <script src="script5.js"></script>
</body>
</html>
```

### 执行顺序分析

1. **`script1.js`**:
   - **加载和解析**: 立即下载并执行，阻塞 HTML 解析器。
   - **执行顺序**: 第一个执行。

2. **`script2.js`**:
   - **加载和解析**: 立即下载，但不立即执行，等到文档解析完成后再执行。
   - **执行顺序**: 在 `DOMContentLoaded` 事件触发前，按照脚本在 HTML 中出现的顺序执行（即在 `script4.js` 之前）。

3. **`script3.js`**:
   - **加载和解析**: 立即下载并执行，不阻塞 HTML 解析器。
   - **执行顺序**: 可能在 `script1.js` 之后，也可能在 `DOMContentLoaded` 事件触发前的任何时间执行，具体取决于下载速度。

4. **`script4.js`**:
   - **加载和解析**: 立即下载，但不立即执行，等到文档解析完成后再执行。
   - **执行顺序**: 在 `DOMContentLoaded` 事件触发前，按照脚本在 HTML 中出现的顺序执行（即在 `script2.js` 之后）。

5. **`script5.js`**:
   - **加载和解析**: 立即下载并执行，阻塞 HTML 解析器。
   - **执行顺序**: 在 `script1.js` 之后，`DOMContentLoaded` 事件触发前执行。

### 总结

- **`<script src="script1.js"></script>`**: 第一个执行。
- **`<script src="script3.js" async></script>`**: 在 `script1.js` 之后，可能在 `DOMContentLoaded` 事件触发前的任何时间执行。
- **`<script src="script5.js"></script>`**: 在 `script1.js` 之后，`DOMContentLoaded` 事件触发前执行。
- **`<script src="script2.js" defer></script>` 和 `<script src="script4.js" defer></script>`**: 在 `DOMContentLoaded` 事件触发前，按照在 HTML 中出现的顺序执行（`script2.js` 在 `script4.js` 之前）。

### 建议

- **使用 `defer`**：如果你的脚本依赖于 DOM 元素，使用 `defer` 属性可以确保脚本在 DOM 解析完成后执行。
- **使用 `async`**：如果你的脚本是独立的，不依赖于其他脚本或 DOM 元素，使用 `async` 属性可以加快页面加载速度。

通过合理使用 `defer` 和 `async` 属性，可以优化页面加载性能和脚本执行顺序。
