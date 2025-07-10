React DnD（Drag and Drop）库提供了一套强大的 API 来实现拖放功能。以下是 React DnD 的主要 API 及其参数的详细说明和注释：

### 1. `DragDropContext`

`DragDropContext` 是一个高阶组件，用于包装你的应用，以便在整个应用中使用拖放功能。

#### 示例

```jsx
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const App = () => (
  <DragDropContext backend={HTML5Backend}>
    <YourApp />
  </DragDropContext>
);
```

### 2. `useDrag` Hook

`useDrag` Hook 用于创建可拖动的元素。

#### 参数

- `spec` (对象)：定义拖动行为的规范。
  - `begin` (函数)：拖动开始时调用的函数。
  - `collect` (函数)：收集拖动状态的函数。
  - `end` (函数)：拖动结束时调用的函数。
  - `canDrag` (函数)：确定是否可以拖动的函数。
  - `isDragging` (布尔值)：当前是否正在拖动。
  - `item` (对象)：拖动的项。
  - `type` (字符串)：拖动类型。

#### 示例

```jsx
import { useDrag } from 'react-dnd';

const Box = ({ name }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'box',
    item: { name },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {name}
    </div>
  );
};
```

### 3. `useDrop` Hook

`useDrop` Hook 用于创建可放置的元素。

#### 参数

- `spec` (对象)：定义放置行为的规范。
  - `accept` (字符串或数组)：接受的拖动类型。
  - `collect` (函数)：收集放置状态的函数。
  - `drop` (函数)：放置时调用的函数。
  - `canDrop` (函数)：确定是否可以放置的函数。
  - `hover` (函数)：鼠标悬停时调用的函数。

#### 示例

```jsx
import { useDrop } from 'react-dnd';

const Dustbin = () => {
  const [, drop] = useDrop(() => ({
    accept: 'box',
    drop: (item) => {
      console.log(`Dropped ${item.name}`);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div ref={drop} style={{ border: '1px solid black', padding: '10px' }}>
      Drop here
    </div>
  );
};
```

### 4. `useCollector`

`useCollector` Hook 用于收集拖放状态，通常与 `useDrag` 和 `useDrop` 一起使用。

#### 参数

- `collector` (函数)：收集状态的函数。
- `monitor` (对象)：拖放监视器。

#### 示例

```jsx
import { useCollector } from 'react-dnd';

const collect = (monitor) => ({
  isDragging: monitor.isDragging(),
});

const Box = ({ name }) => {
  const [isDragging] = useCollector(collect, [name]);

  return (
    <div style={{ opacity: isDragging ? 0.5 : 1 }}>
      {name}
    </div>
  );
};
```

### 5. `DragSource`

`DragSource` 是一个高阶组件，用于创建可拖动的元素。通常与 `useDrag` Hook 结合使用。

#### 参数

- `type` (字符串)：拖动类型。
- `spec` (对象)：定义拖动行为的规范。
- `collect` (函数)：收集拖动状态的函数。

#### 示例

```jsx
import { DragSource } from 'react-dnd';

const boxSource = {
  begin: (props) => ({ name: props.name }),
  end: (props, monitor) => {
    if (monitor.didDrop()) {
      console.log(`Dropped ${props.name}`);
    }
  },
};

const collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

const Box = ({ name, connectDragSource, isDragging }) => {
  return connectDragSource(
    <div style={{ opacity: isDragging ? 0.5 : 1 }}>
      {name}
    </div>
  );
};

export default DragSource('box', boxSource, collect)(Box);
```

### 6. `DropTarget`

`DropTarget` 是一个高阶组件，用于创建可放置的元素。通常与 `useDrop` Hook 结合使用。

#### 参数

- `types` (字符串或数组)：接受的拖动类型。
- `spec` (对象)：定义放置行为的规范。
- `collect` (函数)：收集放置状态的函数。

#### 示例

```jsx
import { DropTarget } from 'react-dnd';

const dustbinTarget = {
  drop: (props, monitor) => {
    const item = monitor.getItem();
    console.log(`Dropped ${item.name}`);
  },
};

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
});

const Dustbin = ({ connectDropTarget, isOver, canDrop }) => {
  return connectDropTarget(
    <div
      style={{
        border: '1px solid black',
        padding: '10px',
        backgroundColor: isOver ? 'lightgreen' : 'white',
      }}
    >
      Drop here
    </div>
  );
};

export default DropTarget('box', dustbinTarget, collect)(Dustbin);
```

### 7. `DragLayer`

`DragLayer` 是一个高阶组件，用于创建一个透明的覆盖层，显示当前拖动的元素。

#### 参数

- `collect` (函数)：收集拖动状态的函数。

#### 示例

```jsx
import { DragLayer } from 'react-dnd';
import { useDragLayer } from 'react-dnd';

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
};

const CustomDragLayer = () => {
  const { isDragging, initialOffset, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    isDragging: monitor.isDragging(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
  }));

  if (!isDragging) {
    return null;
  }

  const style = { ...layerStyles };
  if (initialOffset && currentOffset) {
    style.transform = `translate(${currentOffset.x - initialOffset.x}px, ${currentOffset.y - initialOffset.y}px)`;
  }

  return (
    <div style={style}>
      <div style={{ border: '1px solid black', padding: '10px' }}>
        Dragging...
      </div>
    </div>
  );
};

export default DragLayer()(CustomDragLayer);
```

### 8. `DragPreview`

`DragPreview` 是一个高阶组件，用于在拖动时显示一个预览图像。

#### 参数

- `collect` (函数)：收集拖动状态的函数。

#### 示例

```jsx
import { useDragPreview } from 'react-dnd';

const Box = ({ name }) => {
  const [isDragging, drag, preview] = useDrag(() => ({
    type: 'box',
    item: { name },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  useDragPreview(() => ({
    connectDragPreview: preview,
  }));

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {name}
    </div>
  );
};
```
