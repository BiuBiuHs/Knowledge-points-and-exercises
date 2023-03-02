


// 1.vdom 只有 children 属性来链接父子节点，但是转为 fiber 结构之后就有了 child、sibling、return 属性来关联父子、兄弟节点。
import jsx2vdom from '../图片资源/jsx2vdom.jpg'
// 2.vdom 转 fiber 的流程叫做 reconcile(协调 - 中文直译)，我们常说的 diff 算法就是在 reconcile 这个过程中。
import toFiber from '../图片资源/toFiber.jpg'
// 3.这时候还没处理副作用，也就是 useEffect、生命周期等函数，这些会在 reconcile 结束之后处理。

//react渲染整体分两个大的阶段 
// render 阶段和 commit 阶段。

// 第一阶段 render 阶段也就是 reconcile 的 vdom 转 fiber 的过程，
// 第二阶段 commit 阶段就是具体操作 dom，以及执行副作用函数的过程。


//commit阶段粉丝那个阶段

//1.before mutation、
//2.mutation、  在此阶段操作 dom
//3.layout。 ## layout 阶段在操作 dom 之后，所以这个阶段是能拿到 dom 的，ref 更新是在这个阶段，useLayoutEffect 回调函数的执行也是在这个阶段。


// useMemo hooks实现
// hook 的数据是存放在 fiber 的 memoizedState 属性的链表上的，每个 hook 对应一个节点，
// 第一次执行 useXxx 的 hook 会走 mountXxx 的逻辑来创建 hook 链表，之后会走 updateXxx 的逻辑。