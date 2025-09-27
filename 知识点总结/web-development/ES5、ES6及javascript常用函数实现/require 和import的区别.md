### require 和 import 的主要区别

- **模块规范**
  - require: CommonJS 规范（Node.js 早期标准）
  - import: ES Module（ESM）规范（JS 官方标准，浏览器/Node 均支持）

- **语法形态**
  - require 是函数调用：`const x = require('x')`
  - import 是声明语句：`import x from 'x'`（必须在模块顶层）

- **加载时机与特性**
  - require：运行时动态加载，同步执行，可放在条件/循环中
  - import：编译期静态解析，顶层必须声明；动态按需请用 `import()`（返回 Promise，异步）

- **绑定与更新**
  - require：拿到的是导出值的快照（对象为同一引用，但变量标识符不是“活绑定”）
  - import：活绑定（live binding），导出方变量更新会被引用方感知

- **Tree-Shaking**
  - require：不支持或效果差
  - import：天然支持，打包器可有效摇树优化

- **循环依赖**
  - require：可能拿到未完全初始化的导出对象
  - import：通过活绑定缓解，但存在“暂时性死区”，需避免在初始化前使用

- **严格模式与 this**
  - require（CJS）：默认非严格（Node 多为严格包装），顶层 `this === module.exports`
  - import（ESM）：总是严格模式，顶层 `this === undefined`

- **Node.js 使用与文件后缀**
  - CJS：`.cjs` 或 package.json 未设 `"type":"module"` 时默认 CJS，可 `require`
  - ESM：`.mjs` 或在 package.json 设 `"type":"module"` 时默认 ESM，用 `import`
  - 在 ESM 中用 CJS：`import { createRequire } from 'module'; const require = createRequire(import.meta.url)`

- **JSON 与非 JS 资源**
  - require：`const data = require('./a.json')` 直接可用
  - import：`import data from './a.json' assert { type: 'json' }`（Node/浏览器已支持）

- **默认导出与命名导出互操作**
  - CJS：`module.exports = foo` 或 `exports.bar = bar`
  - ESM：`export default foo` / `export const bar = ...`
  - ESM 引入 CJS：`import pkg from 'cjs-pkg'`（默认拿到 `module.exports` 作为 default）
  - CJS 引入 ESM：不能直接 `require('esm')`，需用 `import()` 或 `createRequire`

- **缓存**
  - 两者都“只执行一次并缓存”
  - CJS 缓存在 `require.cache`
  - ESM 缓存在模块映射中（Module Map）

- **选择建议**
  - 新项目/可控环境：优先 ESM 与 `import`
  - 旧项目/历史包：沿用 CJS 与 `require`，逐步迁移或做边界适配

### 最小示例

```js
// CommonJS
const fs = require('fs');
const util = require('util');
const config = require('./config.json'); // 直接可 require JSON
```

```js
// ES Module（顶层）
import fs from 'node:fs';
import { promisify } from 'node:util';
import config from './config.json' assert { type: 'json' };
```

```js
// 动态按需加载（ESM）
const { default: lodash } = await import('lodash');
```

```js
// 在 ESM 中使用 require（Node）
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const cjsPkg = require('some-cjs-package');
```

### 绑定与更新：CommonJS 的 require vs ES Module 的 import

- **核心差异**
  - **CommonJS（require）**：导入的是“导出值的当前结果”；对“被导出变量本身”没有活绑定。后续若只在模块内部重新赋值局部变量，外部看不到；除非你显式“再次赋值到导出对象上”或导出的是同一个可变对象并对其“改属性”。
  - **ESM（import）**：导入的是“活绑定”（live binding）。对导出变量的重新赋值会自动体现在所有导入方上；导入方拿到的是只读绑定（不能给导入标识符重新赋值）。

---

### 对比示例

- **CJS：变量重新赋值不会自动同步（非活绑定）**

```js
// mod-cjs.js
let count = 0;
exports.count = count;          // 此时把 0 写到导出对象上

setTimeout(() => {
  count += 1;                   // 只是改了内部变量
  // exports.count = count;     // 如果不把新值再写回 exports，外部看不到更新
}, 100);
```

```js
// main.js
const m = require('./mod-cjs');
setTimeout(() => console.log(m.count), 200); // 输出 0（除非模块里显式更新了 exports.count）
```

- **ESM：命名导出是活绑定（会自动同步）**

```js
// mod-esm.mjs
export let count = 0;
setTimeout(() => { count += 1 }, 100); // 改的是“被导出的变量”本身
```

```js
// main.mjs
import { count } from './mod-esm.mjs';
setTimeout(() => console.log(count), 200); // 输出 1（活绑定生效）
```

- **对象作为导出值时，两者都能“看到改属性”**
  - 因为两边都拿到的是“同一对象的引用”，对该对象属性的修改会彼此可见。

```js
// CJS：mod-cjs-obj.js
const obj = { n: 0 };
module.exports = obj;
setTimeout(() => { obj.n = 1 }, 100);

// CJS：main.js
const obj = require('./mod-cjs-obj');
setTimeout(() => console.log(obj.n), 200); // 1
```

```js
// ESM：mod-esm-obj.mjs
export const obj = { n: 0 };
setTimeout(() => { obj.n = 1 }, 100);

// ESM：main.mjs
import { obj } from './mod-esm-obj.mjs';
setTimeout(() => console.log(obj.n), 200); // 1
```

- **导入方能否“改回去”**
  - CJS：`require` 拿到的是缓存的 `module.exports` 引用；导入方直接改 `m.count = 10` 或 `m.obj.x = 1` 会影响所有使用者（全局共享，副作用大）。
  - ESM：导入标识符是只读的，不能 `count = 10`；但若导出的是对象，导入方仍可改其属性（不建议，为了 API 稳定应避免跨模块写入）。

---

### 一句话总结

- **CJS**：没有对“导出变量”的活绑定，导出的是当时赋给 `exports/module.exports` 的值；要让外部看到新值，必须“再次写回导出对象”，或导出可变对象并改其属性。  
- **ESM**：命名导出是“活绑定”，导出变量的后续赋值会自动反映到所有导入方；导入标识符只读但可见变量最新值。

需要的话，我可以把这一段“绑定与更新”的对比与示例补充进你正在编辑的 `require 和import的区别.md`，并修正你文中那句“值传递”的表述以避免歧义。
