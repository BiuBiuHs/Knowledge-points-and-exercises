# Generator 函数中 yield 返回值详解

## 核心概念：yield 的"双向通信"

`yield` 表达式既可以向外输出值，也可以从外部接收值，这是 Generator 最重要也最容易混淆的特性。

### 基础示例

```javascript
function* gen() {
  const a = yield 1;  // yield 后面的值：1
                      // yield 表达式的返回值：next() 传入的参数
  console.log('a =', a);
  
  const b = yield 2;
  console.log('b =', b);
  
  return 'done';
}

const g = gen();

// 第一次调用
const result1 = g.next();
console.log(result1);  // { value: 1, done: false }
                       // yield 1 中的 1 被"输出"

// 第二次调用
const result2 = g.next('hello');
// 输出: a = hello
// 'hello' 成为了上一个 yield 表达式的返回值
console.log(result2);  // { value: 2, done: false }

// 第三次调用
const result3 = g.next('world');
// 输出: b = world
console.log(result3);  // { value: 'done', done: true }
```

## 1. yield 表达式的两个"值"

```javascript
function* gen() {
  const result = yield 'output';
  //              ^^^^  ^^^^^^^^
  //              |     |
  //              |     +-- 输出值：通过 next() 的 value 返回
  //              +-------- 接收值：从下一次 next(参数) 接收
}
```

### 关键理解点

- **yield 右边的值**：作为 `next()` 返回对象的 `value` 属性
- **yield 表达式的返回值**：来自下一次调用 `next(参数)` 时传入的参数

## 2. 执行流程详解

```javascript
function* counter() {
  console.log('开始');
  
  const x = yield 10;
  console.log('x =', x);
  
  const y = yield 20;
  console.log('y =', y);
  
  return 30;
}

const gen = counter();

// 步骤1：第一次 next()
console.log(gen.next());
/*
执行流程：
1. 执行到 console.log('开始')
2. 运行到第一个 yield 10
3. 返回 { value: 10, done: false }
4. 暂停在 yield 10 这里
5. ⚠️ 注意：此时 x 还没有被赋值！赋值操作被暂停了
*/
// 输出：
// 开始
// { value: 10, done: false }

// 步骤2：第二次 next('A')
console.log(gen.next('A'));
/*
执行流程：
1. 'A' 成为上一个 yield 表达式的返回值
2. 执行 x = 'A' 赋值
3. 输出：x = A
4. 运行到第二个 yield 20
5. 返回 { value: 20, done: false }
6. 暂停在 yield 20 这里
*/
// 输出：
// x = A
// { value: 20, done: false }

// 步骤3：第三次 next('B')
console.log(gen.next('B'));
/*
执行流程：
1. 'B' 成为上一个 yield 表达式的返回值
2. 执行 y = 'B' 赋值
3. 输出：y = B
4. 运行到 return 30
5. 返回 { value: 30, done: true }
6. Generator 执行完毕
*/
// 输出：
// y = B
// { value: 30, done: true }
```

## 3. 常见误区与正确理解

### ❌ 错误理解

```javascript
function* gen() {
  const x = yield 100;
  console.log(x);  // 很多人以为 x 会是 100
}

const g = gen();
g.next();      // { value: 100, done: false }
g.next();      // 输出：undefined
```

**误区**：以为 `x` 会等于 `yield` 右边的 `100`

### ✅ 正确理解

```javascript
function* gen() {
  const x = yield 100;
  console.log(x);
}

const g = gen();

// 100 是通过 next() 返回的值（外部接收）
g.next();      // { value: 100, done: false }
               // 此时 x 还没有值，赋值操作被暂停

// 200 是传给 yield 表达式的值（内部接收）
g.next(200);   // 输出：200
               // x = 200，不是 100！
```

**关键点**：

- `100` → 输出给外部（通过 `next()` 的 `value`）
- `200` → 输入给内部（作为 `yield` 表达式的返回值）

## 4. 数据流向图解

```javascript
function* dataFlow() {
  console.log('1. Generator 启动');
  
  const step1 = yield 'A';
  console.log('2. 收到:', step1);
  
  const step2 = yield 'B';
  console.log('3. 收到:', step2);
  
  const step3 = yield 'C';
  console.log('4. 收到:', step3);
  
  return 'END';
}

const gen = dataFlow();

console.log('--- 第1次 next() ---');
console.log(gen.next());
// 输出：
// 1. Generator 启动
// { value: 'A', done: false }
// ↑ 'A' 流向外部

console.log('--- 第2次 next(111) ---');
console.log(gen.next(111));
// 输出：
// 2. 收到: 111  ← 111 从外部流入
// { value: 'B', done: false }  ← 'B' 流向外部

console.log('--- 第3次 next(222) ---');
console.log(gen.next(222));
// 输出：
// 3. 收到: 222  ← 222 从外部流入
// { value: 'C', done: false }  ← 'C' 流向外部

console.log('--- 第4次 next(333) ---');
console.log(gen.next(333));
// 输出：
// 4. 收到: 333  ← 333 从外部流入
// { value: 'END', done: true }  ← 'END' 流向外部
```

## 5. 对比表格

| 调用 | yield 右边的值 | yield 表达式的返回值 | next() 返回值 |
|------|---------------|-------------------|--------------|
| `next()` | 作为 `value` 返回 | 来自下一次 `next(参数)` | `{ value: yield右边值, done: false }` |
| `next(参数)` | 已经在上次返回 | 就是这个参数 | 下一个 yield 的值 |

## 6. 第一次 next() 的特殊性

```javascript
function* gen() {
  const a = yield 1;
  console.log('a =', a);
  
  const b = yield 2;
  console.log('b =', b);
}

const g = gen();

// ❌ 第一次 next() 传参数是没有意义的
g.next('这个参数会被忽略');  
// 因为还没有上一个 yield 表达式在等待接收值

// ✅ 从第二次开始，参数才有意义
g.next('这个参数被 a 接收');  // 输出: a = 这个参数被 a 接收
g.next('这个参数被 b 接收');  // 输出: b = 这个参数被 b 接收
```

## 7. 实际应用：异步流程控制

### 示例1：模拟 async/await

```javascript
function* fetchUser() {
  console.log('开始获取用户');
  
  // yield 出 Promise，等待外部传入结果
  const user = yield fetch('/api/user');
  console.log('用户数据:', user);
  
  // 使用上一步的结果
  const posts = yield fetch(`/api/posts/${user.id}`);
  console.log('文章数据:', posts);
  
  return { user, posts };
}

// 自动执行器
function run(generatorFunc) {
  const gen = generatorFunc();
  
  function step(value) {
    const result = gen.next(value);
    
    if (result.done) {
      return Promise.resolve(result.value);
    }
    
    // result.value 是 Promise
    return result.value
      .then(data => data.json())
      .then(data => step(data));  // 将结果传回 generator
  }
  
  return step();
}

// 使用（类似 async/await 的效果）
run(fetchUser)
  .then(result => console.log('最终结果:', result));
```

### 示例2：状态机

```javascript
function* stateMachine() {
  while (true) {
    const action = yield 'WAITING';
    
    if (action === 'START') {
      yield 'RUNNING';
    } else if (action === 'STOP') {
      yield 'STOPPED';
    } else {
      yield 'ERROR';
    }
  }
}

const machine = stateMachine();

console.log(machine.next());           // { value: 'WAITING', done: false }
console.log(machine.next('START'));    // { value: 'RUNNING', done: false }
console.log(machine.next());           // { value: 'WAITING', done: false }
console.log(machine.next('STOP'));     // { value: 'STOPPED', done: false }
console.log(machine.next());           // { value: 'WAITING', done: false }
console.log(machine.next('UNKNOWN'));  // { value: 'ERROR', done: false }
```

### 示例3：协程通信

```javascript
function* ping() {
  let count = 0;
  while (true) {
    const msg = yield `ping ${count}`;
    console.log('ping 收到:', msg);
    count++;
  }
}

function* pong() {
  let count = 0;
  while (true) {
    const msg = yield `pong ${count}`;
    console.log('pong 收到:', msg);
    count++;
  }
}

// 协调器
function pingPong() {
  const p1 = ping();
  const p2 = pong();
  
  p1.next();  // 启动
  p2.next();  // 启动
  
  for (let i = 0; i < 5; i++) {
    const msg1 = p1.next().value;
    console.log('→', msg1);
    
    const msg2 = p2.next(msg1).value;
    console.log('←', msg2);
    
    p1.next(msg2);
  }
}

pingPong();
// 输出：
// → ping 0
// pong 收到: ping 0
// ← pong 0
// ping 收到: pong 0
// → ping 1
// pong 收到: ping 1
// ← pong 1
// ...
```

## 8. 高级技巧

### 使用 yield* 委托

```javascript
function* inner() {
  const x = yield 'inner-1';
  console.log('inner 收到:', x);
  return 'inner-done';
}

function* outer() {
  yield 'outer-start';
  
  // yield* 委托给另一个 generator
  const result = yield* inner();
  console.log('inner 返回:', result);
  
  yield 'outer-end';
}

const gen = outer();

console.log(gen.next());        // { value: 'outer-start', done: false }
console.log(gen.next());        // { value: 'inner-1', done: false }
console.log(gen.next('hello')); // inner 收到: hello
                                // inner 返回: inner-done
                                // { value: 'outer-end', done: false }
console.log(gen.next());        // { value: undefined, done: true }
```

### 错误处理

```javascript
function* errorHandler() {
  try {
    const result = yield 'risky-operation';
    console.log('成功:', result);
  } catch (e) {
    console.log('捕获错误:', e);
    yield 'error-handled';
  }
}

const gen = errorHandler();

console.log(gen.next());              // { value: 'risky-operation', done: false }
console.log(gen.throw('出错了！'));   // 捕获错误: 出错了！
                                      // { value: 'error-handled', done: false }
```

## 9. 总结记忆

### 口诀："yield 往外送，next 往里塞"

- **`yield 表达式`** → 向外输出值（通过 `next()` 的 `value` 返回）
- **`yield 表达式`** ← 从外接收值（来自下一次 `next(参数)` 的参数）

### 关键点

1. ✅ 第一次 `next()` 启动 Generator，不需要参数
2. ✅ 从第二次开始，`next(参数)` 的参数成为上一个 `yield` 表达式的返回值
3. ✅ `yield` 右边的值通过 `next()` 返回给外部
4. ✅ `yield` 表达式的值来自下一次 `next(参数)`
5. ✅ Generator 函数的 `return` 值作为最后一次 `next()` 的 `value`（`done: true`）

### 数据流向

```
外部              Generator 内部
     
next()  ─────►  启动，执行到 yield 100
        ◄─────  返回 { value: 100, done: false }

next(A) ─────►  yield 表达式返回 A，继续执行到 yield 200
        ◄─────  返回 { value: 200, done: false }

next(B) ─────►  yield 表达式返回 B，继续执行到 return C
        ◄─────  返回 { value: C, done: true }
```

## 10. 与 async/await 的对比

```javascript
// Generator + co
function* fetchData() {
  const user = yield fetch('/api/user').then(r => r.json());
  const posts = yield fetch(`/api/posts/${user.id}`).then(r => r.json());
  return { user, posts };
}
co(fetchData);

// async/await（本质上是 Generator 的语法糖）
async function fetchData() {
  const user = await fetch('/api/user').then(r => r.json());
  const posts = await fetch(`/api/posts/${user.id}`).then(r => r.json());
  return { user, posts };
}
fetchData();
```

**关系：async/await 是 Generator + 自动执行器的语法糖**

- `yield` 需要执行器（如 co）来自动调用 `next()`
- `await` 内置执行器，自动处理
- `async/await` 是 Generator 的语法糖，更易用

### async/await 的本质

`async/await` 可以理解为：

```javascript
async function fn() {
  await promise;
}

// 等价于

function fn() {
  return co(function* () {
    yield promise;
  });
}
```

### 详细对比表格

| 特性 | Generator | async/await |
|------|-----------|-------------|
| 暂停标记 | `yield` | `await` |
| 函数声明 | `function*` | `async function` |
| 执行方式 | 需要手动 `next()` 或执行器 | 自动执行（内置执行器） |
| 返回值 | 迭代器对象 | Promise |
| yield/await 后 | 任意值 | 通常是 Promise |
| 语义化 | 通用状态机 | 专门用于异步 |
| 使用场景 | 迭代器、状态机、异步 | 仅异步操作 |

### 用 Generator 实现 async/await

```javascript
// async/await 版本
async function getUserData() {
  const user = await fetchUser();
  const posts = await fetchPosts(user.id);
  return { user, posts };
}

// 等价的 Generator 版本
function getUserData() {
  return co(function* () {
    const user = yield fetchUser();
    const posts = yield fetchPosts(user.id);
    return { user, posts };
  });
}

// co 就是 async/await 的内置执行器
function co(generatorFunc) {
  return new Promise((resolve, reject) => {
    const gen = generatorFunc();
    
    function step(value) {
      let result;
      try {
        result = gen.next(value);
      } catch (e) {
        return reject(e);
      }
      
      if (result.done) {
        return resolve(result.value);
      }
      
      Promise.resolve(result.value).then(
        data => step(data),
        err => reject(err)
      );
    }
    
    step();
  });
}
```

### 为什么需要 async/await？

虽然 Generator + co 可以实现相同功能，但 async/await 有以下优势：

#### 1. 语义更清晰

```javascript
// Generator：通用状态机，看不出是异步
function* getData() {
  const data = yield fetchData();
}

// async/await：明确表示异步函数
async function getData() {
  const data = await fetchData();
}
```

#### 2. 不需要外部库

```javascript
// Generator 需要 co 模块
const co = require('co');
co(function* () {
  const result = yield promise;
});

// async/await 原生支持
async function fn() {
  const result = await promise;
}
```

#### 3. 返回值是 Promise

```javascript
// Generator 返回迭代器
function* gen() {
  return 'value';
}
const iterator = gen();

// async 返回 Promise
async function fn() {
  return 'value';
}
fn().then(value => console.log(value));
```

### Generator 的独特优势

虽然 async/await 更适合异步，但 Generator 在某些场景仍有优势：

#### 1. 惰性序列

```javascript
// Generator：可以生成无限序列
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

const fib = fibonacci();
console.log(fib.next().value);  // 0
console.log(fib.next().value);  // 1
console.log(fib.next().value);  // 1

// async/await 无法实现惰性序列
```

#### 2. 双向通信

```javascript
// Generator：可以向内部传值
function* gen() {
  const input = yield 'ready';
  console.log('收到:', input);
}

const g = gen();
g.next();           // { value: 'ready', done: false }
g.next('hello');    // 收到: hello

// async/await：只能单向等待
async function fn() {
  const result = await promise;  // 只能等待
}
```

#### 3. 手动控制执行

```javascript
// Generator：可以暂停和手动继续
function* task() {
  console.log('步骤1');
  yield;
  console.log('步骤2');
  yield;
  console.log('步骤3');
}

const t = task();
t.next();  // 步骤1
// ... 做其他事
t.next();  // 步骤2

// async/await：一旦开始自动执行
async function task() {
  console.log('步骤1');
  await delay(100);
  console.log('步骤2');  // 自动执行
}
```

### 演进历史

```javascript
// 1. 回调地狱（Callback）
fetchUser(userId, (err, user) => {
  if (err) return console.error(err);
  fetchPosts(user.id, (err, posts) => {
    if (err) return console.error(err);
    console.log(posts);
  });
});

// 2. Promise 链（ES2015）
fetchUser(userId)
  .then(user => fetchPosts(user.id))
  .then(posts => console.log(posts))
  .catch(err => console.error(err));

// 3. Generator + co（2013）
co(function* () {
  const user = yield fetchUser(userId);
  const posts = yield fetchPosts(user.id);
  console.log(posts);
}).catch(err => console.error(err));

// 4. async/await（ES2017）
async function getData() {
  try {
    const user = await fetchUser(userId);
    const posts = await fetchPosts(user.id);
    console.log(posts);
  } catch (err) {
    console.error(err);
  }
}
```

### 总结

**async/await 与 Generator 的关系：**

1. **本质关系：**

   ```
   async function  =  function* + 自动执行器
   await          =  yield
   Promise        ≈  Iterator
   ```

2. **async/await 的优势：**
   - ✅ 语义清晰（专门用于异步）
   - ✅ 内置执行器（不需要 co）
   - ✅ 返回 Promise（符合异步场景）
   - ✅ 标准化（ES2017）

3. **Generator 的优势：**
   - ✅ 更通用（迭代器、状态机、异步）
   - ✅ 支持惰性序列
   - ✅ 支持双向通信
   - ✅ 可手动控制执行

4. **使用建议：**
   - 异步操作 → 用 **async/await**
   - 迭代器、惰性序列、状态机 → 用 **Generator**

## 11. 练习题

```javascript
// 问题：输出是什么？
function* quiz() {
  const a = yield 1 + 1;
  const b = yield a + 2;
  const c = yield b + 3;
  return a + b + c;
}

const g = quiz();
const r1 = g.next();      // ?
const r2 = g.next(10);    // ?
const r3 = g.next(20);    // ?
const r4 = g.next(30);    // ?

// 答案：
// r1: { value: 2, done: false }        // 1 + 1 = 2
// r2: { value: 12, done: false }       // a=10, 10 + 2 = 12
// r3: { value: 23, done: false }       // b=20, 20 + 3 = 23
// r4: { value: 60, done: true }        // c=30, 10 + 20 + 30 = 60
```

---

## 12. await 后面不是 Promise 会怎样？

### 核心特性：await 自动转换

**重要：await 会自动将任何值转换为 Promise（类似 `Promise.resolve()`）**

```javascript
async function test() {
  // 1. await 普通值 - 立即返回
  const num = await 42;
  console.log(num);  // 42
  
  // 2. await 字符串 - 立即返回
  const str = await 'hello';
  console.log(str);  // 'hello'
  
  // 3. await Promise - 等待完成
  const result = await Promise.resolve('async');
  console.log(result);  // 'async'
  
  // 4. await Thenable - 调用 then 方法
  const thenable = {
    then(resolve) {
      resolve('thenable result');
    }
  };
  const value = await thenable;
  console.log(value);  // 'thenable result'
}

// await 的内部逻辑等价于：
const result = await value;
// ↓↓↓
const result = await Promise.resolve(value);
```

### 详细行为示例

```javascript
async function awaitBehavior() {
  console.log('开始测试');
  
  // 1. 普通数字
  console.log('--- 测试1: await 数字 ---');
  const num = await 123;
  console.log('num =', num);  // 123（立即返回，但经过微任务）
  
  // 2. 对象
  console.log('--- 测试2: await 对象 ---');
  const obj = await { name: 'Alice', age: 25 };
  console.log('obj =', obj);  // { name: 'Alice', age: 25 }
  
  // 3. undefined
  console.log('--- 测试3: await undefined ---');
  const undef = await undefined;
  console.log('undef =', undef);  // undefined
  
  // 4. Promise（需要等待）
  console.log('--- 测试4: await Promise ---');
  const promiseResult = await new Promise(resolve => {
    setTimeout(() => {
      console.log('Promise 完成');
      resolve('async result');
    }, 1000);
  });
  console.log('promiseResult =', promiseResult);  // 1秒后：async result
  
  // 5. Thenable 对象
  console.log('--- 测试5: await Thenable ---');
  const thenableResult = await {
    then(resolve, reject) {
      setTimeout(() => {
        console.log('Thenable 完成');
        resolve('thenable result');
      }, 500);
    }
  };
  console.log('thenableResult =', thenableResult);  // 0.5秒后
  
  // 6. 数组
  console.log('--- 测试6: await 数组 ---');
  const arr = await [1, 2, 3];
  console.log('arr =', arr);  // [1, 2, 3]
  
  return 'done';
}

awaitBehavior().then(result => {
  console.log('=== 全部完成 ===');
  console.log('最终结果:', result);
});
```

### 与 Promise.resolve() 的对应关系

```javascript
// await 的行为与 Promise.resolve() 完全一致

async function comparison() {
  // 方式1：使用 await
  const result1 = await 42;
  
  // 方式2：等价写法
  const result2 = await Promise.resolve(42);
  
  console.log(result1 === result2);  // true
}

// 对于已存在的 Promise
const p = Promise.resolve('hello');

async function promiseComparison() {
  const r1 = await p;
  const r2 = await Promise.resolve(p);  // Promise.resolve 直接返回同一个 Promise
  
  console.log(r1 === r2);  // true
}
```

### await 值处理规则表

| await 后的值 | 行为 | 返回时机 | 示例 |
|-------------|------|---------|------|
| 普通值（数字、字符串等） | `Promise.resolve(value)` | 立即（微任务） | `await 42` → `42` |
| Promise（pending） | 等待 Promise 完成 | resolve 时 | `await fetch()` → 等待 |
| Promise（resolved） | 直接获取值 | 立即（微任务） | `await Promise.resolve(1)` → `1` |
| Promise（rejected） | 抛出错误 | 立即（进 catch） | `await Promise.reject('err')` → 抛错 |
| Thenable 对象 | 调用 then 方法 | then 完成时 | `await {then: r => r(1)}` → `1` |
| undefined/null | `Promise.resolve(undefined)` | 立即（微任务） | `await undefined` → `undefined` |

### 实际应用场景

#### 场景1：统一处理同步/异步值

```javascript
// 函数可能返回缓存值或异步请求
function getData(useCache) {
  if (useCache) {
    return { cached: true, data: 'local' };  // 同步值
  } else {
    return fetch('/api/data').then(r => r.json());  // Promise
  }
}

// 使用 await 统一处理
async function processData(useCache) {
  const data = await getData(useCache);  // ✅ 无论是值还是 Promise 都能处理
  console.log('数据:', data);
  return data;
}

processData(true);   // 立即返回缓存
processData(false);  // 等待网络请求
```

#### 场景2：兼容第三方库

```javascript
// 某些库可能返回值或 Promise
async function fetchWithCache(url) {
  // someLibrary.get 可能返回：
  // 1. 缓存的值（对象）
  // 2. Promise
  const result = await someLibrary.get(url);
  
  // 无论哪种情况，都能正确获取数据
  return result;
}
```

#### 场景3：条件异步执行

```javascript
async function conditionalAsync(condition) {
  if (condition) {
    // 异步操作
    return await fetch('/api/data').then(r => r.json());
  } else {
    // 同步值（但仍使用 await 保持接口一致）
    return await { status: 'ok', data: 'immediate' };
  }
}
```

### 性能考虑

```javascript
// ⚠️ 注意：await 普通值会增加微任务开销

async function withAwait() {
  const a = await 1;  // 进入微任务队列
  const b = await 2;  // 进入微任务队列
  return a + b;
}

function withoutAwait() {
  const a = 1;
  const b = 2;
  return a + b;  // 同步执行，更快
}

// 性能测试
console.time('with-await');
withAwait().then(() => console.timeEnd('with-await'));
// with-await: ~1-2ms

console.time('without-await');
const result = withoutAwait();
console.timeEnd('without-await');
// without-await: ~0.01ms

// 建议：如果不需要异步，不要使用 await
```

### 错误处理

```javascript
async function errorHandling() {
  try {
    // 1. await 普通值 - 不会抛错
    const num = await 123;
    console.log('普通值:', num);
    
    // 2. await rejected Promise - 会抛错
    const error = await Promise.reject('Promise 错误');
  } catch (e) {
    console.error('捕获错误:', e);  // Promise 错误
  }
  
  try {
    // 3. await Thenable 如果 reject
    const thenable = {
      then(resolve, reject) {
        reject('Thenable 错误');
      }
    };
    await thenable;
  } catch (e) {
    console.error('捕获 Thenable 错误:', e);  // Thenable 错误
  }
  
  try {
    // 4. await 后立即抛出的错误
    const value = await Promise.resolve().then(() => {
      throw new Error('then 中的错误');
    });
  } catch (e) {
    console.error('捕获 then 错误:', e.message);  // then 中的错误
  }
}

errorHandling();
```

### 微任务队列示例

```javascript
console.log('1. 同步开始');

async function test() {
  console.log('2. async 函数开始');
  
  const a = await 100;  // 进入微任务队列
  console.log('4. await 后继续', a);
  
  const b = await 200;  // 再次进入微任务队列
  console.log('6. 第二个 await 后', b);
}

test();

console.log('3. 同步结束');

Promise.resolve().then(() => console.log('5. Promise.then'));

// 输出顺序：
// 1. 同步开始
// 2. async 函数开始
// 3. 同步结束
// 4. await 后继续 100
// 5. Promise.then
// 6. 第二个 await 后 200
```

### 总结

#### await 的值处理核心规则

1. **自动转换**：`await x` 等价于 `await Promise.resolve(x)`
2. **普通值**：立即返回，但会进入微任务队列
3. **Promise**：等待其完成
4. **Thenable**：调用 then 方法
5. **行为一致**：与 Generator + co 模块中的 `Promise.resolve()` 行为一致

#### 关键对比

```javascript
// await 可以接受任何值
async function fn() {
  const a = await 1;              // ✅ 可以
  const b = await 'hello';        // ✅ 可以
  const c = await Promise.resolve(2);  // ✅ 可以
  const d = await { then: r => r(3) };  // ✅ 可以
}

// 但如果不需要异步，直接赋值更高效
function fn2() {
  const a = 1;           // ✅ 更快
  const b = 'hello';     // ✅ 更快
  return a + b;
}
```

#### 使用建议

- ✅ await Promise → **推荐**（真正的异步操作）
- ⚠️ await 普通值 → **慎用**（会增加微任务开销）
- ✅ await 可能的 Promise → **可以**（统一处理同步/异步）
- ❌ 不需要异步时用 await → **不推荐**（性能浪费）

---

**相关文件：**

- [Generator 函数及自动执行模块(co)的实现](./generator函数及自动执行模块(co)的实现.js)
- [Promise 实现](./promise_all_race_finally实现.md)
