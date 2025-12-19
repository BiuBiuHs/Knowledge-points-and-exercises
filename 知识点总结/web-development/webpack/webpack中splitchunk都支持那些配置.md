`splitChunks` 是 Webpack 4+ 引入的核心代码分割配置（替代旧版 `CommonsChunkPlugin`），Webpack 5 进一步增强了其能力，核心通过 `optimization.splitChunks` 配置实现**灵活的代码块（Chunk）分割**，支持多维度的分割操作——从「加载类型（同步/异步）」「分割条件（大小/引用次数）」到「自定义缓存组（第三方库/公共代码）」，覆盖几乎所有代码分割场景。

以下是 `splitChunks` 支持的核心分割操作，按「基础分割维度 → 高级分割规则 → 实战分割场景」梳理，附配置示例：

### 一、splitChunks 核心基础

- **配置位置**：`webpack.config.js` → `optimization.splitChunks`；
- **核心目标**：将大型 Chunk 拆分为更小的 Chunk，实现「按需加载」「长期缓存」「减少重复代码」；
- **适用对象**：支持「异步加载的模块（动态 `import()`）」「同步入口模块（多入口共享代码）」「第三方依赖（`node_modules`）」等所有模块类型。

### 二、splitChunks 支持的核心分割操作

#### 1. 按「模块加载类型」分割（最基础维度）

通过 `chunks` 配置控制分割的模块类型，这是分割的核心范围控制：

| 配置值       | 分割范围                          | 适用场景                  |
|--------------|-----------------------------------|---------------------------|
| `async`（默认） | 仅分割**异步加载的模块**（如 `import('./module.js')`） | 优先优化异步加载的代码，不影响主入口体积 |
| `initial`    | 仅分割**同步加载的模块**（如入口/同步 `import`） | 多入口项目拆分同步公共代码 |
| `all`        | 分割**所有模块**（同步 + 异步）| 最常用，兼顾同步/异步分割，最大化复用代码 |

**配置示例**：

```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all', // 分割所有类型的模块（同步+异步）
    },
  },
};
```

#### 2. 按「分割条件」控制是否拆分

通过以下配置定义「满足什么条件才会分割 Chunk」，避免过度拆分：

| 配置项                | 作用                                                                 | 默认值  |
|-----------------------|----------------------------------------------------------------------|---------|
| `minSize`             | 分割后的 Chunk 最小体积（低于该值不分割），单位：字节（b）| 20000（20kb） |
| `minChunks`           | 模块被至少引用多少次才会被分割                                       | 1       |
| `maxSize`             | 强制将超过该大小的 Chunk 拆分为更小的 Chunk（优先级高于 `minSize`）| 0（不拆分） |
| `maxAsyncRequests`    | 异步加载时的最大并行请求数（避免拆分过多导致请求泛滥）| 30      |
| `maxInitialRequests`  | 入口点的最大并行请求数（同步分割的请求数限制）| 30      |
| `enforceSizeThreshold`| 超过该阈值的 Chunk 忽略 `minSize/maxSize` 等条件，强制分割           | 50000（50kb） |

**配置示例（按大小/引用次数分割）**：

```javascript
splitChunks: {
  chunks: 'all',
  minSize: 30000, // 仅分割 ≥30kb 的模块
  minChunks: 2, // 模块被引用 ≥2 次才分割
  maxSize: 200000, // 超过200kb的Chunk强制拆分成更小的
  maxAsyncRequests: 10, // 异步请求数上限10
  maxInitialRequests: 5, // 入口请求数上限5
},
```

#### 3. 按「缓存组（cacheGroups）」自定义分割规则（核心）

`cacheGroups` 是 `splitChunks` 的核心——**自定义不同的分割规则集**，比如「分割第三方库」「分割业务公共代码」「分割特定组件」等，每个缓存组可独立配置分割规则，且支持优先级控制。

##### （1）默认缓存组（Webpack 内置）

Webpack 内置两个默认缓存组，可直接使用或覆盖：

| 默认缓存组 | 规则                                                                 | 优先级 |
|------------|----------------------------------------------------------------------|--------|
| `vendors`  | 匹配 `node_modules` 中的模块（第三方依赖），分割为 `vendors~xxx.js` | -10    |
| `default`  | 匹配被至少 2 个 Chunk 共享的模块（业务公共代码），分割为 `default~xxx.js` | -20    |

**覆盖默认缓存组示例**：

```javascript
splitChunks: {
  chunks: 'all',
  // 缓存组配置
  cacheGroups: {
    // 覆盖默认 vendors 组：分割所有 node_modules 模块
    vendors: {
      test: /[\\/]node_modules[\\/]/, // 匹配 node_modules 路径
      name: 'vendors', // 分割后的 Chunk 名称（固定名称，便于缓存）
      priority: -10, // 优先级（数值越高，越优先匹配）
      reuseExistingChunk: true, // 复用已存在的 Chunk，避免重复分割
    },
    // 覆盖默认 default 组：分割业务公共代码
    common: {
      name: 'common', // 分割后的 Chunk 名称
      minChunks: 2, // 被引用 ≥2 次才分割
      priority: -20,
      reuseExistingChunk: true,
    },
  },
},
```

##### （2）自定义缓存组（按需分割特定模块）

支持创建任意数量的自定义缓存组，实现「精准分割」：

- 分割特定库（如 React/Vue 单独分割）；
- 分割业务核心模块（如 utils/组件库）；
- 分割超大模块（如 echarts/地图库）。

**示例1：单独分割 React 相关模块**

```javascript
cacheGroups: {
  // 自定义 react 缓存组（优先级高于 vendors）
  react: {
    test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
    name: 'chunk-react', // 分割后名称：chunk-react.js
    priority: 10, // 优先级高于 vendors（-10），优先匹配
    reuseExistingChunk: true,
  },
  // 分割其他第三方库（兜底）
  vendors: {
    test: /[\\/]node_modules[\\/]/,
    name: 'chunk-vendors',
    priority: -10,
  },
},
```

**示例2：分割业务公共工具库**

```javascript
cacheGroups: {
  utils: {
    test: /[\\/]src[\\/]utils[\\/]/, // 匹配 src/utils 目录
    name: 'chunk-utils',
    minChunks: 1, // 即使只引用1次也分割（因为 utils 体积大）
    priority: 5,
    reuseExistingChunk: true,
  },
},
```

#### 4. 按「优先级」控制分割匹配顺序

多个缓存组可能匹配同一个模块（比如 React 既匹配 `react` 组，又匹配 `vendors` 组），通过 `priority`（数值越高，优先级越高）控制「先匹配哪个缓存组」：

- 优先级高的缓存组会优先分割模块；
- 避免同一模块被多次分割。

**示例**：

```javascript
cacheGroups: {
  highPriority: {
    test: /high-priority-module/,
    priority: 20, // 最高优先级
    name: 'high-priority',
  },
  mediumPriority: {
    test: /medium-module/,
    priority: 10, // 中等优先级
    name: 'medium',
  },
  lowPriority: {
    test: /low-module/,
    priority: 0, // 低优先级
    name: 'low',
  },
},
```

#### 5. 强制分割/排除分割（test/include/exclude）

通过 `test`/`include`/`exclude` 精准控制「哪些模块要分割」「哪些不分割」：

- `test`：正则匹配模块路径（常用）；
- `include`：指定要包含的目录/文件；
- `exclude`：指定要排除的目录/文件。

**示例：排除特定模块不分割**

```javascript
cacheGroups: {
  vendors: {
    test: /[\\/]node_modules[\\/]/,
    exclude: /[\\/]node_modules[\\/](lodash|moment)[\\/]/, // 排除 lodash/moment（单独分割）
    name: 'vendors',
    priority: -10,
  },
  // 单独分割 lodash
  lodash: {
    test: /[\\/]node_modules[\\/]lodash[\\/]/,
    name: 'chunk-lodash',
    priority: 5,
  },
},
```

#### 6. 复用已有 Chunk（reuseExistingChunk）

通过 `reuseExistingChunk: true` 避免重复分割——如果某个模块已经被分割到一个已存在的 Chunk 中，直接复用该 Chunk，不再创建新的 Chunk，减少冗余。

**示例**：

```javascript
cacheGroups: {
  common: {
    name: 'common',
    minChunks: 2,
    reuseExistingChunk: true, // 复用已有 Chunk
    priority: -20,
  },
},
```

#### 7. 按「入口点」分割（多入口场景）

多入口项目中，可通过缓存组分割「不同入口共享的代码」，或「每个入口的独立第三方依赖」：

**示例：多入口分割公共代码**

```javascript
// 多入口配置
entry: {
  page1: './src/page1.js',
  page2: './src/page2.js',
},
optimization: {
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      // 分割多入口共享的第三方库
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        name: 'shared-vendors',
        priority: -10,
      },
      // 分割多入口共享的业务代码
      pageCommon: {
        test: /[\\/]src[\\/]common[\\/]/,
        name: 'page-common',
        minChunks: 2, // 被 page1/page2 都引用才分割
        priority: -20,
      },
    },
  },
},
```

### 三、splitChunks 常见分割场景（实战示例）

#### 场景1：基础分割（第三方库 + 公共业务代码）

```javascript
optimization: {
  splitChunks: {
    chunks: 'all',
    minSize: 20000,
    minRemainingSize: 0,
    minChunks: 1,
    maxAsyncRequests: 30,
    maxInitialRequests: 30,
    enforceSizeThreshold: 50000,
    cacheGroups: {
      // 分割第三方依赖
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        priority: -10,
        reuseExistingChunk: true,
        name: (module) => {
          // 提取第三方库名称，生成动态名称（便于缓存）
          const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
          return `vendors-${packageName.replace('@', '')}`;
        },
      },
      // 分割业务公共代码
      common: {
        name: 'common',
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true,
      },
    },
  },
},
```

#### 场景2：拆分超大模块（如 ECharts）

```javascript
cacheGroups: {
  // 单独分割 ECharts（体积大，按需加载）
  echarts: {
    test: /[\\/]node_modules[\\/]echarts[\\/]/,
    name: 'chunk-echarts',
    priority: 20,
    chunks: 'all',
  },
  vendors: {
    test: /[\\/]node_modules[\\/]/,
    priority: -10,
  },
},
```

#### 场景3：禁用默认缓存组，完全自定义

```javascript
splitChunks: {
  chunks: 'all',
  // 禁用所有默认缓存组
  cacheGroups: {
    default: false,
    vendors: false,
    // 自定义唯一缓存组：分割所有共享模块
    custom: {
      test: /[\\/]src[\\/]/,
      minChunks: 2,
      name: 'custom-shared',
      priority: 0,
    },
  },
},
```

### 四、关键注意事项

1. **Chunk 名称命名**：
   - 固定名称（如 `vendors`）便于缓存，但会导致所有第三方库打包到一个文件（体积大）；
   - 动态名称（如 `vendors-[name]`）拆分更细，但需配合 `contenthash` 实现长期缓存。
2. **Webpack 5 增强**：
   - 支持 `minRemainingSize`（分割后剩余 Chunk 的最小体积）；
   - 更精准的模块依赖分析，避免无效分割；
   - 兼容 `package.json` 的 `exports` 字段，分割更规范。
3. **避免过度分割**：
   - 拆分过多 Chunk 会导致 HTTP 请求数增加（反而降低性能）；
   - 建议结合 `maxAsyncRequests`/`maxInitialRequests` 控制请求数，同时用 `maxSize` 拆分超大 Chunk（如超过 500kb）。

### 总结

`splitChunks` 支持的分割操作覆盖「维度（同步/异步）」「条件（大小/引用次数）」「规则（缓存组/优先级）」「精准控制（test/exclude）」等全场景，核心是通过 `cacheGroups` 自定义分割规则，实现「第三方库拆分」「公共代码拆分」「超大模块拆分」等目标，最终达到「减少重复代码、优化加载速度、提升缓存命中率」的效果。
