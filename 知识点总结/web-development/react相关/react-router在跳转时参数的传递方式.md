在 `react-router` 中，有多种方法可以将参数传递给下一个页面。以下是几种常见的方法：

### 1. 使用 URL 参数

你可以通过在 URL 中添加查询参数或路径参数来传递数据。

#### 路径参数

```jsx
import React from 'react';
import { BrowserRouter as Router, Route, Link, useParams } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Link to="/user/123">Go to User 123</Link>
    </div>
  );
}

function User() {
  const { id } = useParams();
  return (
    <div>
      <h1>User {id}</h1>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route path="/user/:id" component={User} />
    </Router>
  );
}

export default App;
```

#### 查询参数

```jsx
import React from 'react';
import { BrowserRouter as Router, Route, Link, useHistory, useLocation } from 'react-router-dom';

function Home() {
  const history = useHistory();

  const handleNavigate = () => {
    history.push({
      pathname: '/user',
      search: '?id=123',
    });
  };

  return (
    <div>
      <h1>Home</h1>
      <button onClick={handleNavigate}>Go to User 123</button>
    </div>
  );
}

function User() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const id = query.get('id');

  return (
    <div>
      <h1>User {id}</h1>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route path="/user" component={User} />
    </Router>
  );
}

export default App;
```

### 2. 使用 `state` 属性

你可以在 `history.push` 方法中使用 `state` 属性来传递数据。

```jsx
import React from 'react';
import { BrowserRouter as Router, Route, Link, useHistory, useLocation } from 'react-router-dom';

function Home() {
  const history = useHistory();

  const handleNavigate = () => {
    history.push({
      pathname: '/user',
      state: { id: 123, name: 'Alice' },
    });
  };

  return (
    <div>
      <h1>Home</h1>
      <button onClick={handleNavigate}>Go to User</button>
    </div>
  );
}

function User() {
  const location = useLocation();
  const { id, name } = location.state || {};

  return (
    <div>
      <h1>User {id} - {name}</h1>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route path="/user" component={User} />
    </Router>
  );
}

export default App;
```

### 3. 使用 Context

你可以使用 React 的 `Context` API 来在多个组件之间共享数据。

```jsx
import React, { createContext, useContext } from 'react';
import { BrowserRouter as Router, Route, Link, useHistory } from 'react-router-dom';

const UserContext = createContext();

function Home() {
  const history = useHistory();

  const handleNavigate = () => {
    history.push('/user');
  };

  return (
    <UserContext.Provider value={{ id: 123, name: 'Alice' }}>
      <div>
        <h1>Home</h1>
        <button onClick={handleNavigate}>Go to User</button>
      </div>
    </UserContext.Provider>
  );
}

function User() {
  const { id, name } = useContext(UserContext);

  return (
    <div>
      <h1>User {id} - {name}</h1>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route path="/user" component={User} />
    </Router>
  );
}

export default App;
```

### 总结

- **路径参数**：适用于简单的键值对数据。
- **查询参数**：适用于简单的键值对数据，可以在 URL 中看到。
- **`state` 属性**：适用于传递复杂对象，不会在 URL 中显示。
- **Context API**：适用于在多个组件之间共享数据，适用于复杂的应用场景。

选择哪种方法取决于你的具体需求和应用场景。希望这些示例能帮助你理解如何在 `react-router` 中传递参数。如果有任何进一步的问题，请随时提问。
