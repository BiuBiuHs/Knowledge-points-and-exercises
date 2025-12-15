# React 事件机制与合成事件详解

## 核心概念

React 实现了一套独立的**合成事件系统（Synthetic Event System）**，而不是直接使用原生 DOM 事件。

### 为什么需要合成事件？

1. **跨浏览器兼容** - 抹平不同浏览器的事件差异
2. **性能优化** - 事件委托减少内存占用
3. **统一管理** - React 可以更好地控制事件的触发时机
4. **与 React 更新机制结合** - 配合批量更新（Batching）

---

## 1. 合成事件的核心机制

### 事件委托（Event Delegation）

React 不会在每个 DOM 元素上绑定事件，而是使用事件委托。

```javascript
// ❌ 原生 JS：每个按钮都绑定事件
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', handleClick);  // N 个监听器
});

// ✅ React：统一在根节点绑定
// React 在 root 节点绑定一次，通过事件冒泡处理
<div id="root">
  <button onClick={handleClick1}>Button 1</button>
  <button onClick={handleClick2}>Button 2</button>
  <button onClick={handleClick3}>Button 3</button>
</div>
// 只在 #root 上绑定一个监听器
```

### React 16 vs React 17+ 的差异

```
React 16 及之前:
  所有事件绑定在 document 上
  
  document (事件监听器)
    └── #root
          └── <App>
                └── <button onClick={fn} />

React 17+:
  所有事件绑定在 React 根节点上（#root）
  
  #root (事件监听器) ← 改为绑定在这里
    └── <App>
          └── <button onClick={fn} />
```

**为什么改变？**

- ✅ 更好的多 React 应用共存支持
- ✅ 更容易与其他框架集成
- ✅ 事件阻止传播不会影响到 document 级别的监听器

---

## 2. 合成事件的工作流程

### 完整流程图

```
1. 用户点击按钮
      ↓
2. 原生事件触发 (nativeEvent)
      ↓
3. 事件冒泡到 React 根节点 (#root)
      ↓
4. React 捕获原生事件
      ↓
5. 创建合成事件对象 (SyntheticEvent)
      ↓
6. 根据 fiber 树找到对应的事件处理函数
      ↓
7. 模拟事件的捕获和冒泡阶段
      ↓
8. 执行事件处理函数
      ↓
9. 事件对象回收（React 17 之前）
```

### 详细代码示例

```javascript
function App() {
  const handleClick = (e) => {
    console.log('1. 合成事件对象:', e);
    console.log('2. 原生事件对象:', e.nativeEvent);
    console.log('3. 事件类型:', e.type);
    console.log('4. 目标元素:', e.target);
    console.log('5. 当前元素:', e.currentTarget);
  };
  
  return (
    <div id="root">
      <button onClick={handleClick}>点击我</button>
    </div>
  );
}

// 点击按钮时的执行流程：
// 1. 用户点击 button
// 2. 原生 click 事件触发
// 3. 事件冒泡到 #root
// 4. React 在 #root 的监听器捕获事件
// 5. React 创建合成事件对象
// 6. React 查找 fiber 树，找到 button 对应的 onClick
// 7. 执行 handleClick(syntheticEvent)
```

---

## 3. 合成事件对象（SyntheticEvent）

### 合成事件的结构

```javascript
// React 的合成事件对象
const syntheticEvent = {
  // 标准 W3C 事件属性
  type: 'click',
  target: element,
  currentTarget: element,
  bubbles: true,
  
  // 原生事件对象
  nativeEvent: originalEvent,
  
  // 阻止默认行为
  preventDefault: function() {
    this.nativeEvent.preventDefault();
  },
  
  // 阻止事件传播
  stopPropagation: function() {
    this.nativeEvent.stopPropagation();
  },
  
  // 是否已阻止默认行为
  isDefaultPrevented: function() { ... },
  
  // 是否已阻止传播
  isPropagationStopped: function() { ... },
  
  // React 17 之前需要的方法
  persist: function() { ... }  // 保持事件对象
};
```

### 访问原生事件

```javascript
function handleClick(e) {
  // e 是合成事件对象
  console.log(e);                    // SyntheticEvent
  console.log(e.nativeEvent);        // 原生 MouseEvent
  
  // 合成事件的属性
  console.log(e.target);             // 事件目标
  console.log(e.currentTarget);      // 当前处理元素
  
  // 原生事件的属性
  console.log(e.nativeEvent.offsetX);  // 鼠标相对位置
  console.log(e.nativeEvent.pageX);    // 鼠标绝对位置
}
```

---

## 4. 事件执行顺序

### 原生事件 vs React 事件

```javascript
function App() {
  const buttonRef = useRef(null);
  
  useEffect(() => {
    // 原生事件（捕获阶段）
    document.addEventListener('click', () => {
      console.log('1. document 原生捕获');
    }, true);
    
    // 原生事件（冒泡阶段）
    document.addEventListener('click', () => {
      console.log('6. document 原生冒泡');
    });
    
    // 在按钮上绑定原生事件
    buttonRef.current.addEventListener('click', () => {
      console.log('3. button 原生事件');
    });
  }, []);
  
  return (
    <div onClick={() => console.log('5. div React 事件')}>
      <button 
        ref={buttonRef}
        onClick={() => console.log('4. button React 事件')}
      >
        点击我
      </button>
    </div>
  );
}

// 点击按钮输出顺序：
// 1. document 原生捕获
// 2. （原生事件的目标阶段和冒泡阶段）
// 3. button 原生事件
// 4. button React 事件  ← React 事件在这里执行
// 5. div React 事件
// 6. document 原生冒泡
```

**关键理解：**

- ✅ React 事件是在原生事件冒泡到根节点后才触发
- ✅ 在 React 16 中，如果在原生事件中调用 `e.stopPropagation()`，会阻止 React 事件
- ✅ React 17+ 中这个问题得到改善

### React 事件的捕获和冒泡

```javascript
function App() {
  return (
    <div 
      onClick={() => console.log('3. div 冒泡')}
      onClickCapture={() => console.log('1. div 捕获')}
    >
      <button 
        onClick={() => console.log('4. button 冒泡')}
        onClickCapture={() => console.log('2. button 捕获')}
      >
        点击我
      </button>
    </div>
  );
}

// 点击按钮输出：
// 1. div 捕获     ← 捕获阶段：从外到内
// 2. button 捕获
// 3. button 冒泡  ← 冒泡阶段：从内到外
// 4. div 冒泡

// React 模拟了标准的 DOM 事件流
```

---

## 5. 事件池（Event Pooling）

### React 16 及之前

```javascript
// React 16：事件对象会被重用
function handleClick(e) {
  console.log(e.type);  // 'click'
  
  setTimeout(() => {
    console.log(e.type);  // null ⚠️ 事件对象被清空了
  }, 1000);
}

// 解决方法1：调用 e.persist()
function handleClick(e) {
  e.persist();  // 告诉 React 不要回收这个事件对象
  
  setTimeout(() => {
    console.log(e.type);  // 'click' ✅
  }, 1000);
}

// 解决方法2：提前保存需要的值
function handleClick(e) {
  const eventType = e.type;  // 保存值
  
  setTimeout(() => {
    console.log(eventType);  // 'click' ✅
  }, 1000);
}
```

### React 17+

```javascript
// React 17：不再使用事件池，事件对象不会被清空
function handleClick(e) {
  console.log(e.type);  // 'click'
  
  setTimeout(() => {
    console.log(e.type);  // 'click' ✅ 直接可用
  }, 1000);
  
  // e.persist() 仍然存在但不再需要
}
```

---

## 6. 常见事件类型

### 鼠标事件

```javascript
function MouseEvents() {
  return (
    <div
      onClick={(e) => console.log('点击')}
      onDoubleClick={(e) => console.log('双击')}
      onMouseDown={(e) => console.log('鼠标按下')}
      onMouseUp={(e) => console.log('鼠标抬起')}
      onMouseMove={(e) => console.log('鼠标移动')}
      onMouseEnter={(e) => console.log('鼠标进入（不冒泡）')}
      onMouseLeave={(e) => console.log('鼠标离开（不冒泡）')}
      onMouseOver={(e) => console.log('鼠标悬停（冒泡）')}
      onMouseOut={(e) => console.log('鼠标移出（冒泡）')}
      onContextMenu={(e) => console.log('右键菜单')}
    >
      Mouse Events
    </div>
  );
}
```

### 键盘事件

```javascript
function KeyboardEvents() {
  return (
    <input
      onKeyDown={(e) => {
        console.log('按键按下:', e.key, e.keyCode);
      }}
      onKeyUp={(e) => {
        console.log('按键抬起:', e.key);
      }}
      onKeyPress={(e) => {
        // ⚠️ 已废弃，使用 onKeyDown 代替
        console.log('按键字符:', e.key);
      }}
    />
  );
}

// 常用的键盘属性
function handleKeyDown(e) {
  console.log('按键:', e.key);           // 'Enter', 'a', 'Escape'
  console.log('按键码:', e.keyCode);     // 13, 65, 27 (已废弃)
  console.log('代码:', e.code);         // 'KeyA', 'Enter'
  console.log('Ctrl:', e.ctrlKey);      // 是否按下 Ctrl
  console.log('Shift:', e.shiftKey);    // 是否按下 Shift
  console.log('Alt:', e.altKey);        // 是否按下 Alt
  console.log('Meta:', e.metaKey);      // 是否按下 Cmd/Win
}
```

### 表单事件

```javascript
function FormEvents() {
  return (
    <>
      <input
        onChange={(e) => console.log('输入变化:', e.target.value)}
        onInput={(e) => console.log('输入中:', e.target.value)}
        onFocus={(e) => console.log('获得焦点')}
        onBlur={(e) => console.log('失去焦点')}
      />
      
      <form
        onSubmit={(e) => {
          e.preventDefault();  // 阻止默认提交
          console.log('表单提交');
        }}
        onReset={(e) => console.log('表单重置')}
      >
        <button type="submit">提交</button>
      </form>
    </>
  );
}
```

### 其他常用事件

```javascript
function OtherEvents() {
  return (
    <>
      {/* 滚动事件 */}
      <div onScroll={(e) => console.log('滚动:', e.target.scrollTop)}>
        内容...
      </div>
      
      {/* 触摸事件（移动端）*/}
      <div
        onTouchStart={(e) => console.log('触摸开始')}
        onTouchMove={(e) => console.log('触摸移动')}
        onTouchEnd={(e) => console.log('触摸结束')}
      >
        触摸区域
      </div>
      
      {/* 拖拽事件 */}
      <div
        draggable
        onDragStart={(e) => console.log('拖拽开始')}
        onDrag={(e) => console.log('拖拽中')}
        onDragEnd={(e) => console.log('拖拽结束')}
      >
        可拖拽元素
      </div>
      
      {/* 媒体事件 */}
      <video
        onPlay={(e) => console.log('播放')}
        onPause={(e) => console.log('暂停')}
        onEnded={(e) => console.log('播放结束')}
      />
      
      {/* 剪贴板事件 */}
      <input
        onCopy={(e) => console.log('复制')}
        onCut={(e) => console.log('剪切')}
        onPaste={(e) => console.log('粘贴')}
      />
    </>
  );
}
```

---

## 7. 阻止默认行为和事件传播

### preventDefault

```javascript
// 阻止默认行为
function LinkComponent() {
  const handleClick = (e) => {
    e.preventDefault();  // 阻止链接跳转
    console.log('链接被点击，但不会跳转');
  };
  
  return <a href="https://example.com" onClick={handleClick}>点击</a>;
}

// 阻止表单提交
function FormComponent() {
  const handleSubmit = (e) => {
    e.preventDefault();  // 阻止表单默认提交
    
    // 自定义提交逻辑
    const formData = new FormData(e.target);
    console.log('表单数据:', Object.fromEntries(formData));
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="username" />
      <button type="submit">提交</button>
    </form>
  );
}
```

### stopPropagation

```javascript
// 阻止事件传播（冒泡）
function StopPropagation() {
  return (
    <div onClick={() => console.log('div 点击')}>
      <button 
        onClick={(e) => {
          e.stopPropagation();  // 阻止冒泡到 div
          console.log('button 点击');
        }}
      >
        点击我
      </button>
    </div>
  );
}

// 点击按钮输出：
// button 点击
// （不会输出 "div 点击"）
```

### 与原生事件的交互

```javascript
function MixedEvents() {
  const buttonRef = useRef(null);
  
  useEffect(() => {
    // 原生事件
    const handleNativeClick = (e) => {
      console.log('原生事件');
      // e.stopPropagation();  // ⚠️ 这会阻止 React 事件（React 16）
    };
    
    buttonRef.current.addEventListener('click', handleNativeClick);
    
    return () => {
      buttonRef.current?.removeEventListener('click', handleNativeClick);
    };
  }, []);
  
  return (
    <div onClick={() => console.log('div React 事件')}>
      <button 
        ref={buttonRef}
        onClick={() => console.log('button React 事件')}
      >
        点击我
      </button>
    </div>
  );
}
```

---

## 8. 事件绑定方式

### 类组件中的事件绑定

```javascript
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    
    // 方式1：构造函数中绑定（推荐）
    this.handleClick1 = this.handleClick1.bind(this);
  }
  
  handleClick1() {
    // 可以正确访问 this
    this.setState({ count: this.state.count + 1 });
  }
  
  // 方式2：类属性 + 箭头函数（推荐）
  handleClick2 = () => {
    this.setState({ count: this.state.count + 1 });
  }
  
  handleClick3() {
    // this 是 undefined（错误）
    console.log(this);  // undefined
  }
  
  render() {
    return (
      <div>
        {/* ✅ 正确 */}
        <button onClick={this.handleClick1}>方式1</button>
        <button onClick={this.handleClick2}>方式2</button>
        
        {/* ⚠️ 每次渲染都创建新函数，影响性能 */}
        <button onClick={() => this.handleClick1()}>方式3</button>
        <button onClick={this.handleClick1.bind(this)}>方式4</button>
        
        {/* ❌ 错误：this 是 undefined */}
        <button onClick={this.handleClick3}>方式5</button>
      </div>
    );
  }
}
```

### 函数组件中的事件绑定

```javascript
function MyComponent() {
  const [count, setCount] = useState(0);
  
  // 方式1：直接定义函数（简单场景）
  const handleClick1 = () => {
    setCount(count + 1);
  };
  
  // 方式2：使用 useCallback 优化（避免子组件不必要的重渲染）
  const handleClick2 = useCallback(() => {
    setCount(c => c + 1);
  }, []);
  
  return (
    <div>
      {/* ✅ 推荐 */}
      <button onClick={handleClick1}>方式1</button>
      <button onClick={handleClick2}>方式2</button>
      
      {/* ⚠️ 每次渲染都创建新函数 */}
      <button onClick={() => setCount(count + 1)}>方式3</button>
      
      {/* 传递参数 */}
      <button onClick={() => handleClick1(123)}>带参数</button>
    </div>
  );
}
```

---

## 9. 传递参数

### 方式对比

```javascript
function EventParams() {
  const handleClick = (id, name, e) => {
    console.log('ID:', id);
    console.log('Name:', name);
    console.log('Event:', e);
  };
  
  return (
    <div>
      {/* 方式1：箭头函数 */}
      <button onClick={(e) => handleClick(1, 'Alice', e)}>
        方式1
      </button>
      
      {/* 方式2：bind */}
      <button onClick={handleClick.bind(null, 2, 'Bob')}>
        方式2
      </button>
      
      {/* 方式3：data 属性 + e.target.dataset */}
      <button 
        data-id="3"
        data-name="Charlie"
        onClick={(e) => {
          const id = e.target.dataset.id;
          const name = e.target.dataset.name;
          handleClick(id, name, e);
        }}
      >
        方式3
      </button>
      
      {/* 方式4：柯里化 */}
      <button onClick={handleClickCurry(4, 'David')}>
        方式4
      </button>
    </div>
  );
  
  // 柯里化函数
  function handleClickCurry(id, name) {
    return (e) => {
      handleClick(id, name, e);
    };
  }
}
```

---

## 10. 性能优化

### 避免在渲染时创建函数

```javascript
// ❌ 不好：每次渲染都创建新函数
function BadComponent() {
  const [items, setItems] = useState([1, 2, 3]);
  
  return (
    <ul>
      {items.map(item => (
        <li key={item} onClick={() => console.log(item)}>
          {item}
        </li>
      ))}
    </ul>
  );
}

// ✅ 好：使用 useCallback 或提取到外部
function GoodComponent() {
  const [items, setItems] = useState([1, 2, 3]);
  
  const handleClick = useCallback((item) => {
    console.log(item);
  }, []);
  
  return (
    <ul>
      {items.map(item => (
        <li key={item} onClick={() => handleClick(item)}>
          {item}
        </li>
      ))}
    </ul>
  );
}

// ✅ 更好：使用事件委托
function BetterComponent() {
  const [items, setItems] = useState([1, 2, 3]);
  
  const handleClick = (e) => {
    const item = e.target.dataset.value;
    console.log(item);
  };
  
  return (
    <ul onClick={handleClick}>
      {items.map(item => (
        <li key={item} data-value={item}>
          {item}
        </li>
      ))}
    </ul>
  );
}
```

### 使用事件委托

```javascript
// 利用 React 的事件委托特性
function TodoList({ todos }) {
  // 在父元素上绑定一个事件处理器
  const handleClick = (e) => {
    const todoId = e.target.closest('[data-todo-id]')?.dataset.todoId;
    if (todoId) {
      console.log('点击了 todo:', todoId);
    }
  };
  
  return (
    <ul onClick={handleClick}>
      {todos.map(todo => (
        <li key={todo.id} data-todo-id={todo.id}>
          {todo.text}
          <button data-action="delete">删除</button>
          <button data-action="edit">编辑</button>
        </li>
      ))}
    </ul>
  );
}
```

---

## 11. 特殊情况处理

### 需要使用原生事件的场景

```javascript
function NativeEventExample() {
  const divRef = useRef(null);
  
  useEffect(() => {
    const div = divRef.current;
    
    // 某些事件需要使用原生监听器
    // 1. 需要在捕获阶段处理
    // 2. 需要 passive 选项优化性能
    // 3. 需要监听 document 或 window
    
    const handleScroll = (e) => {
      console.log('滚动位置:', e.target.scrollTop);
    };
    
    // 使用 passive 优化滚动性能
    div.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      div.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return <div ref={divRef} style={{ height: 200, overflow: 'auto' }}>
    长内容...
  </div>;
}
```

### 与第三方库集成

```javascript
function ChartComponent() {
  const chartRef = useRef(null);
  
  useEffect(() => {
    // 使用第三方图表库
    const chart = new Chart(chartRef.current);
    
    // 第三方库的事件监听
    chart.on('click', (data) => {
      console.log('图表被点击:', data);
    });
    
    return () => {
      chart.destroy();
    };
  }, []);
  
  return <canvas ref={chartRef} />;
}
```

---

## 12. 常见问题与解决方案

### 问题1：异步访问事件对象

```javascript
// React 16 的问题
function BadExample() {
  const handleClick = (e) => {
    setTimeout(() => {
      console.log(e.type);  // null（事件对象被清空）
    }, 1000);
  };
  
  return <button onClick={handleClick}>点击</button>;
}

// 解决方案1：使用 e.persist()（React 16）
function Solution1() {
  const handleClick = (e) => {
    e.persist();  // 保留事件对象
    setTimeout(() => {
      console.log(e.type);  // 'click'
    }, 1000);
  };
  
  return <button onClick={handleClick}>点击</button>;
}

// 解决方案2：提前保存值
function Solution2() {
  const handleClick = (e) => {
    const eventType = e.type;
    setTimeout(() => {
      console.log(eventType);  // 'click'
    }, 1000);
  };
  
  return <button onClick={handleClick}>点击</button>;
}

// React 17+：不再需要特殊处理
function React17Solution() {
  const handleClick = (e) => {
    setTimeout(() => {
      console.log(e.type);  // 'click' ✅ 直接可用
    }, 1000);
  };
  
  return <button onClick={handleClick}>点击</button>;
}
```

### 问题2：阻止传播不生效

```javascript
// 问题：在 React 16 中，原生事件阻止传播会影响 React 事件
function Problem() {
  const buttonRef = useRef();
  
  useEffect(() => {
    buttonRef.current.addEventListener('click', (e) => {
      e.stopPropagation();  // 阻止冒泡
      console.log('原生事件');
    });
  }, []);
  
  return (
    <div onClick={() => console.log('React 事件')}>
      <button ref={buttonRef}>点击</button>
    </div>
  );
}
// 在 React 16 中，React 事件不会触发
// React 17+ 中得到改善
```

### 问题3：onChange 行为差异

```javascript
// React 的 onChange 行为与原生不同
function OnChangeExample() {
  // React 的 onChange 相当于原生的 onInput
  // 每次输入都会触发，而不是失去焦点时触发
  
  const [value, setValue] = useState('');
  
  return (
    <>
      {/* React onChange：每次输入都触发 */}
      <input 
        value={value}
        onChange={(e) => {
          console.log('每次输入:', e.target.value);
          setValue(e.target.value);
        }}
      />
      
      {/* 如果需要原生的 onChange 行为（失去焦点触发）*/}
      <input 
        value={value}
        onBlur={(e) => {
          console.log('失去焦点:', e.target.value);
        }}
      />
    </>
  );
}
```

---

## 13. 最佳实践

### 1. 合理使用事件委托

```javascript
// ✅ 好：列表使用事件委托
function TodoList({ todos, onDelete, onToggle }) {
  const handleAction = (e) => {
    const action = e.target.dataset.action;
    const todoId = e.target.closest('[data-todo-id]')?.dataset.todoId;
    
    if (!todoId) return;
    
    if (action === 'delete') {
      onDelete(todoId);
    } else if (action === 'toggle') {
      onToggle(todoId);
    }
  };
  
  return (
    <ul onClick={handleAction}>
      {todos.map(todo => (
        <li key={todo.id} data-todo-id={todo.id}>
          <span data-action="toggle">{todo.text}</span>
          <button data-action="delete">删除</button>
        </li>
      ))}
    </ul>
  );
}
```

### 2. 使用 useCallback 优化

```javascript
function OptimizedComponent() {
  const [count, setCount] = useState(0);
  
  // ✅ 使用 useCallback 避免子组件不必要的重渲染
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);
  
  return (
    <div>
      <p>Count: {count}</p>
      <ChildComponent onClick={handleClick} />
    </div>
  );
}

const ChildComponent = React.memo(({ onClick }) => {
  console.log('ChildComponent 渲染');
  return <button onClick={onClick}>+1</button>;
});
```

### 3. 阻止默认行为的时机

```javascript
function FormExample() {
  const handleSubmit = (e) => {
    // ✅ 总是先阻止默认行为
    e.preventDefault();
    
    // 然后进行表单验证
    if (!validate()) {
      return;
    }
    
    // 提交表单
    submit();
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

### 4. 事件处理函数命名规范

```javascript
function Component() {
  // ✅ 好的命名
  const handleClick = () => {};
  const handleSubmit = () => {};
  const handleInputChange = () => {};
  
  // ❌ 不好的命名
  const click = () => {};
  const onClick = () => {};  // 容易与 prop 混淆
  const doSomething = () => {};  // 不够明确
  
  return <button onClick={handleClick}>点击</button>;
}
```

---

## 14. 总结对比

### React 事件 vs 原生事件

| 特性 | React 事件 | 原生事件 |
|------|-----------|---------|
| **命名** | 驼峰式（onClick） | 小写（onclick） |
| **绑定方式** | JSX 属性 | addEventListener |
| **事件对象** | 合成事件（SyntheticEvent） | 原生事件对象 |
| **跨浏览器** | 自动兼容 | 需要手动处理 |
| **性能** | 事件委托优化 | 每个元素绑定 |
| **this 绑定** | 需要手动绑定（类组件） | 自动绑定到元素 |
| **阻止默认** | e.preventDefault() | return false 或 preventDefault() |
| **触发时机** | 在原生事件之后 | 立即触发 |

### React 16 vs React 17

| 特性 | React 16 | React 17+ |
|------|---------|-----------|
| **事件绑定位置** | document | React 根节点 |
| **事件池** | 有（需要 persist） | 无（自动保持） |
| **多应用共存** | 可能冲突 | 更好支持 |
| **原生事件影响** | stopPropagation 影响 React | 影响较小 |

---

## 快速记忆

### 核心概念

```
1. 合成事件：React 封装的跨浏览器事件系统
2. 事件委托：统一在根节点绑定
3. 事件执行：原生事件 → React 事件
```

### 关键特点

```
1. 驼峰命名：onClick、onChange
2. 传递函数：onClick={handleClick}
3. 事件对象：SyntheticEvent（访问 nativeEvent）
4. 阻止行为：preventDefault()、stopPropagation()
```

### 最佳实践

```
1. 使用 useCallback 优化
2. 事件委托减少监听器
3. 需要原生事件时用 ref + addEventListener
4. React 17+ 不需要 persist()
```

---

**参考资料：**

- [React 事件官方文档](https://react.dev/learn/responding-to-events)
- [合成事件详解](https://react.dev/reference/react-dom/components/common#react-event-object)
- [React 17 事件系统改进](https://react.dev/blog/2020/08/10/react-v17-rc#changes-to-event-delegation)
