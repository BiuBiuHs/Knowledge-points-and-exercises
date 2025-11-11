# Webpack 与 Vite 构建的区别

## 总体概览

- **Webpack**：以打包为中心。无论开发或生产环境，都需要先将依赖图打包成一个或多个 bundle，再由浏览器执行。
- **Vite**：开发阶段走“原生 ESM + 按需加载”，生产阶段再调用 Rollup 打包。借助现代浏览器的 ES Module 能力，让冷启动、热重载都更快。

## 开发态工作流对比

- **冷启动**  
  - Webpack：需要完整解析 + 打包整个依赖图后才能提供服务，项目越大启动越慢。  
  - Vite：直接把源代码以 ES Module 形式提供给浏览器，仅对第三方依赖做 esbuild 预构建，启动速度几乎与项目体量无关。
- **代码更新 / HMR**  
  - Webpack：基于 bundle 更新，局部改动仍需重新构建受影响的 chunk。  
  - Vite：基于模块的按需编译，文件改动后只触发该模块的重新加载或依赖的局部失效，几乎实时。

## 生产构建差异

- **Webpack**：自带生产构建能力，Tree-Shaking、Scope Hoisting、Code Splitting 都在同一套打包器内完成，生态围绕 Loader + Plugin 扩展。
- **Vite**：生产模式下转由 Rollup 打包，沿用 Rollup 的 chunk 拆分策略、静态分析与输出配置；Vite 插件在构建阶段会转为 Rollup 插件执行。

## 模块格式支持与处理方式

### Webpack

- **CommonJS (require / module.exports)**：通过静态分析把 CJS 模块封装为内部模块函数（`__webpack_require__` 管理依赖），允许混用 `require` 与 `import`。
- **ES Module (import / export)**：在编译期转成 Webpack 内部模块系统，推导静态依赖、做 Tree-Shaking、按需拆分 chunk。
- **AMD / UMD / SystemJS**：内置兼容逻辑或通过插件支持旧格式，常用第三方包可直接消费。
- **资源与自定义格式**：借助 Loader 转换（例如 `babel-loader`、`ts-loader`、`css-loader`），构建前即可把 `.ts`、`.vue`、`.scss` 等转成 JavaScript 模块。

### Vite

- **开发阶段**  
  - 直接把 `.js/.ts/.vue/.jsx` 等文件映射为浏览器可识别的 ES Module。  
  - 当遇到 CommonJS 依赖时，先用 esbuild 预构建，把 CJS/UMD 转换成单个 ESM 代理模块，然后缓存起来。  
  - 自定义文件格式依赖 Vite 插件（底层基于 `esbuild`/`@vitejs/plugin-vue` 等）即时转换为 ESM。
- **生产阶段**  
  - Rollup 默认输出 ES Module，也支持配置生成 `umd`、`iife` 等格式。  
  - Rollup 对 CommonJS 的支持依赖 `@rollup/plugin-commonjs`，会在打包时将 CJS 转换为 ESM。

## 构建结果与模块格式的影响

- **多输出格式**  
  - Webpack：依赖 `output.libraryTarget` 配置，可生成 `var`、`umd`、`commonjs2`、`module` 等多种产物。  
  - Vite：通过 `build.lib.formats` 或 Rollup `output.format` 配置，可一次生成 `es`、`umd`、`cjs` 等格式。
- **动态导入与懒加载**  
  - Webpack：`import()` 会被编译为基于 `__webpack_require__.e` 的懒加载逻辑，对 CommonJS 也会注入兼容代码。  
  - Vite/Rollup：`import()` 原生支持，开发期直接由浏览器处理，生产期由 Rollup 按模块拆分 chunk。
- **老旧浏览器兼容**  
  - Webpack：可借助 Babel Loader + Polyfill 统一转译。  
  - Vite：推荐使用官方的 `@vitejs/plugin-legacy`，生产时利用 Babel + SystemJS 生成额外的 legacy bundle。

## 何时选择谁？

- 需要高度自定义的打包流程、复杂的老项目迁移、对 CommonJS 插件依赖多时，Webpack 仍然稳健。
- 倾向现代前端栈、追求开发态体验、希望最小成本利用 ES Module 的项目，Vite 更省心。

---

```javascript
// 两者在配置输出格式时的对比示例
// Webpack (webpack.config.js)
module.exports = {
  output: {
    library: {
      name: 'MyLib',
      type: 'umd'
    }
  }
};

// Vite (vite.config.ts)
export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'MyLib',
      formats: ['es', 'umd']
    }
  }
});
```
