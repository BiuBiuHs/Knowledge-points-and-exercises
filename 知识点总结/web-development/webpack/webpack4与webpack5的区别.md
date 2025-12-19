Webpack 5 是继 Webpack 4 后的重大版本升级，核心围绕「**性能提升、内置功能增强、长期缓存优化、现代生态适配**」重构，同时移除了大量过时逻辑，与 Webpack 4 相比有本质性的架构和功能差异。以下是核心区别，按「核心性能 → 新增功能 → 代码优化 → 兼容性 → 其他细节」梳理：

### 一、核心性能优化：持久化缓存 & 构建效率

这是 Webpack 5 最直观的提升，解决了 Webpack 4 构建速度慢、缓存不稳定的痛点：

| 特性                | Webpack 4                          | Webpack 5                          |
|---------------------|------------------------------------|------------------------------------|
| 持久化缓存          | 无内置支持，需依赖第三方插件（如 `hard-source-webpack-plugin`）实现文件系统缓存，配置复杂且稳定性差 | **内置持久化缓存**（Persistent Caching）：<br>1. 默认缓存到 `node_modules/.cache/webpack`；<br>2. 支持 `cache` 配置（类型：`memory`/`filesystem`）；<br>3. 二次构建速度提升 50%+（甚至更高） |
| 缓存配置示例        | 需安装插件并配置：<br>```js<br>const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');<br>module.exports = { plugins: [new HardSourceWebpackPlugin()] }<br>``` | 内置配置，无需插件：<br>```js<br>module.exports = {<br>  cache: {<br>    type: 'filesystem', // 缓存到文件系统（默认memory）<br>    cacheDirectory: path.resolve(__dirname, '.webpack-cache'),<br>    buildDependencies: { config: [__filename] } // 配置文件变化时失效<br>  }<br>}<br>``` |
| 增量编译            | 仅基础增量编译，依赖解析重复耗时 | 优化模块解析和依赖图，仅重新编译变化的模块，大幅减少重复计算 |
| 内存使用            | 内存占用高，大型项目易卡顿       | 重构内存管理，内存占用降低 30%~50% |

### 二、核心功能新增：模块化生态增强

Webpack 5 新增了多个「解决实际开发痛点」的核心功能，Webpack 4 需依赖第三方方案或手动实现：

#### 1. 模块联邦（Module Federation）—— 微前端核心能力

**作用**：实现跨应用/项目的模块共享（无需发布 npm 包、无需手动打包），是微前端的「原生解决方案」。

- Webpack 4：无此功能，微前端需依赖 `single-spa`/`qiankun` 等框架，模块共享需手动配置 `externals` 或打包成 UMD；
- Webpack 5：内置 `ModuleFederationPlugin`，可直接暴露/引入远程模块。

**示例（微前端主应用引入子应用模块）**：

```javascript
// Webpack 5 主应用配置
const { ModuleFederationPlugin } = require('webpack').container;
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'host', // 主应用名称
      remotes: {
        // 引入子应用：名称@地址/远程入口文件
        app1: 'app1@http://localhost:3001/remoteEntry.js',
      },
    }),
  ],
};

// 主应用中直接使用子应用组件
import { Button } from 'app1/Button';
```

#### 2. Asset 模块类型（替代 file/url/raw-loader）

**作用**：内置处理静态资源（图片、字体、文本等）的能力，无需安装 `file-loader`/`url-loader`/`raw-loader`，简化配置。

- Webpack 4：需手动安装并配置各类 loader 处理静态资源；
- Webpack 5：新增 4 种 Asset 模块类型，覆盖所有静态资源场景。

| Asset 类型          | 作用（替代的 loader）| 示例配置                          |
|---------------------|-----------------------------------|-----------------------------------|
| `asset/resource`    | 输出文件（替代 file-loader）| `{ test: /\.(png|jpg)$/, type: 'asset/resource' }` |
| `asset/inline`      | 转 base64 嵌入（替代 url-loader） | `{ test: /\.(svg)$/, type: 'asset/inline' }` |
| `asset/source`      | 导出文件内容（替代 raw-loader）| `{ test: /\.(txt)$/, type: 'asset/source' }` |
| `asset`             | 自动判断（文件 < 8kb 转 base64，否则输出文件）| `{ test: /\.(png)$/, type: 'asset' }` |

#### 3. Package Exports 支持（规范模块解析）

**作用**：支持 `package.json` 的 `exports` 字段（Node.js 生态标准），解决模块导出路径不规范的问题。

- Webpack 4：不支持 `exports` 字段，只能通过 `main`/`module` 字段解析，易导致路径混乱；
- Webpack 5：优先解析 `exports` 字段，支持条件导出（如 `import`/`require` 不同导出）。

**示例（package.json）**：

```json
{
  "name": "my-package",
  "exports": {
    ".": {
      "import": "./esm/index.js", // ESM 导入时的路径
      "require": "./cjs/index.js" // CommonJS 导入时的路径
    },
    "./button": "./esm/button.js" // 子路径导出
  }
}
```

### 三、代码优化增强：Tree Shaking & 长期缓存

Webpack 5 大幅优化了代码体积和缓存策略，解决 Webpack 4 的冗余和缓存失效问题：

#### 1. Tree Shaking 增强

Tree Shaking 是「移除未使用代码」的核心能力，Webpack 5 修复了 Webpack 4 的关键缺陷：

| 优化点              | Webpack 4                          | Webpack 5                          |
|---------------------|------------------------------------|------------------------------------|
| CommonJS 支持       | 几乎不支持 CommonJS 的 Tree Shaking（仅支持 ESM），大量 CommonJS 模块无法摇树 | 深度优化 CommonJS Tree Shaking，可分析 `require`/`module.exports` 并移除未使用代码 |
| 嵌套模块摇树        | 仅支持顶层模块摇树，嵌套模块（如 `import { a } from './deep/nested'`）无法摇树 | 支持嵌套模块摇树，甚至可摇树 `node_modules` 中的嵌套代码 |
| 副作用（sideEffects）| 标记 `sideEffects: false` 后，摇树仍有遗漏 | 更精准的副作用分析，结合 `package.json` 的 `sideEffects` 字段，几乎无冗余代码 |

#### 2. 长期缓存（Long-term Caching）优化

长期缓存的核心是「文件内容不变则哈希值不变」，Webpack 5 解决了 Webpack 4 哈希值易失效的问题：

| 问题                | Webpack 4 表现                     | Webpack 5 优化                     |
|---------------------|------------------------------------|------------------------------------|
| Chunk ID 不稳定     | 新增/删除模块会导致所有 chunk ID 变化（即使内容未变），需手动配置 `NamedChunksPlugin`/`NamedModulesPlugin` | 内置「确定性 chunk ID」：基于模块内容生成 ID，而非加载顺序，无需额外插件 |
| Hash 计算冗余       | `contenthash` 受无关因素影响（如注释、空格），易失效 | 优化 `contenthash` 计算逻辑，仅基于文件内容，不受格式影响 |
| Runtime 代码冗余    | `runtimeChunk: 'single'` 易导致 runtime 代码变化，缓存失效 | 拆分更细的 runtime 代码，仅变化的部分更新哈希 |

#### 3. Node.js 核心模块 Polyfill 处理

Webpack 4 的「自动 polyfill」是包体积大的核心原因之一，Webpack 5 彻底重构：

| 行为                | Webpack 4                          | Webpack 5                          |
|---------------------|------------------------------------|------------------------------------|
| 自动 Polyfill       | 自动为 Node.js 核心模块（`path`/`fs`/`crypto` 等）添加 polyfill，即使代码未使用，也会打包到产物中 | **不再自动添加 Polyfill**：<br>1. 代码中引用 Node.js 核心模块时直接报错；<br>2. 需手动安装 `node-polyfill-webpack-plugin` 或按需导入 polyfill；<br>3. 大幅减少包体积（尤其前端项目） |
| 示例                | 代码写 `const path = require('path')`，Webpack 4 自动打包 `path-browserify` | Webpack 5 报错，需手动配置：<br>```js<br>const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');<br>plugins: [new NodePolyfillPlugin()]<br>``` |

### 四、兼容性与 API 变化

Webpack 5 移除了大量过时 API，提升了现代生态适配性，但也带来了升级成本：

| 维度                | Webpack 4 要求                     | Webpack 5 要求                     |
|---------------------|------------------------------------|-----------------------------------|
| Node.js 版本        | 最低 Node.js 8.9.0                 | 最低 Node.js 10.13.0（仅支持 LTS 版本） |
| 废弃 API            | `Compilation.plugin`/`Compiler.plugin`（事件绑定）、`CommonsChunkPlugin` 等 | 统一使用 `hooks` 替代事件绑定（如 `compilation.hooks.someHook.tap()`）；<br>`CommonsChunkPlugin` 被 `splitChunks` 替代（Webpack 4 已引入，但 5 优化） |
| Loader 兼容         | 支持旧版 loader（如 `url-loader@3`） | 部分旧 loader 需升级（如 `file-loader` 需升级到 `^6.0.0`，或直接用 Asset 模块替代） |
| 插件兼容            | 大量第三方插件（如 `html-webpack-plugin`）需升级到支持 Webpack 5 的版本 | 需检查插件版本，如 `html-webpack-plugin` 需 ≥ 5.0.0 |

### 五、其他细节优化

#### 1. 模块解析优化

- Webpack 4：解析路径时需手动配置 `resolve.extensions`/`resolve.alias`，易遗漏；
- Webpack 5：优化路径解析逻辑，支持 `resolve.fallback`（配置模块解析失败时的兜底路径），解析速度提升。

#### 2. 开发体验提升

- Webpack 4：热更新（HMR）不稳定，大型项目易失效；
- Webpack 5：重构 HMR 逻辑，热更新速度更快、更稳定；
- 新增 `stats` 优化，构建日志更清晰，可过滤冗余信息。

#### 3. 输出优化

- Webpack 4：输出 `chunk` 时易产生空文件，需手动清理；
- Webpack 5：自动移除空 chunk，优化输出结构；
- 支持 `output.clean` 配置（替代 `clean-webpack-plugin`），构建前自动清理输出目录：

  ```js
  module.exports = {
    output: {
      clean: true // 构建前清空 dist 目录
    }
  };
  ```

### 六、Webpack 4 → 5 升级核心注意事项

1. **替换静态资源 loader**：移除 `file-loader`/`url-loader`，改用 Asset 模块类型；
2. **处理 Node.js Polyfill**：按需添加 polyfill，避免包体积暴涨；
3. **升级插件**：确保 `html-webpack-plugin`/`mini-css-extract-plugin` 等插件支持 Webpack 5；
4. **迁移事件绑定**：将 `Compilation.plugin` 改为 `compilation.hooks.xxx.tap()`；
5. **配置持久化缓存**：开启 `cache: { type: 'filesystem' }` 提升构建速度；
6. **兼容第三方库**：部分旧库（如依赖 `process.env` 的库）需手动配置 `DefinePlugin`。

### 总结：Webpack 4 vs 5 核心差异

| 核心维度       | Webpack 4 特点                     | Webpack 5 特点                     |
|----------------|------------------------------------|------------------------------------|
| 性能           | 构建速度慢，缓存需第三方插件       | 内置持久化缓存，构建速度提升 50%+  |
| 核心功能       | 无模块联邦，静态资源需手动配置 loader | 内置模块联邦、Asset 模块，简化配置 |
| 代码优化       | Tree Shaking 弱，Polyfill 冗余     | Tree Shaking 增强，Polyfill 按需加载 |
| 长期缓存       | 哈希易失效，需手动配置             | 确定性哈希，缓存稳定性大幅提升     |
| 兼容性         | 支持旧 Node.js/插件，升级成本低    | 要求现代 Node.js/插件，升级成本高  |

Webpack 5 的核心价值是「**更快的构建速度、更小的产物体积、更灵活的模块化能力**」，尤其适合大型项目、微前端项目；若项目较小且依赖大量旧插件/loader，可暂时保留 Webpack 4（其维护周期至 2024 年），但长期建议升级到 Webpack 5 以享受生态红利。
