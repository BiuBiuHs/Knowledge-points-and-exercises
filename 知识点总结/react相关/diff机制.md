只比较同一层级，不跨级比较
tag 不相同，则直接删掉重建，不再深度比较
tag 和 key，两者都相同，则认为是相同节点，不再深度比较

//详细讲解
https://juejin.cn/post/6844904167472005134#heading-7
### 一 同级别只有一个节点的diff
对于单个节点，会进入reconcileSingleElement
![avatar](https://user-gold-cdn.xitu.io/2020/5/24/172466e506e9f3b0?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

更新过程：
1.先对比key是否相同，再对比dom元素type是否相同 （相同则复用）
2.key不同 或type不同 都不能复用 并标记节点为删除  创建新fiber 并返回。

### 二 同级有多个节点diff

不同操作的优先级是相同的，React团队发现，在日常开发中，相对于增加和删除，更新组件发生的频率更高。所以React Diff会优先判断当前节点是否属于更新。

虽然本次更新的JSX对象newChildren为数组形式，但是和newChildren中每个值进行比较的是上次更新的Fiber节点，Fiber节点的同级节点是由sibling指针链接形成的链表。
即 newChildren[0]与oldFiber比较，newChildren[1]与oldFiber.sibling比较。

基于以上原因，Diff算法的整体逻辑会经历两轮遍历。

第一轮遍历：处理更新的节点。

第二轮遍历：处理剩下的不属于更新的节点。


第一轮遍历步骤如下：

* 1 遍历newChildren，i = 0，将newChildren[i]与oldFiber比较，判断DOM节点是否可复用。
* 2 如果可复用，i++，比较newChildren[i]与oldFiber.sibling是否可复用。可以复用则重复步骤2。
* 3 如果不可复用，立即跳出整个遍历。
* 4 如果newChildren遍历完或者oldFiber遍历完（即oldFiber.sibling === null），跳出遍历。

当我们最终完成遍历后，会有两种结果：

结果一： 如果是步骤3跳出的遍历，newChildren没有遍历完，oldFiber也没有遍历完。

结果二： 如果是步骤4跳出的遍历，可能newChildren遍历完，或oldFiber遍历完，或他们同时遍历完。

newChildren没遍历完，oldFiber遍历完意味着需要新增fiber节点

newChildren遍历完，oldFiber没遍历完意味着需要删除fiber节点


newChildren与oldFiber都没遍历完，这意味着有节点在这次更新中改变了位置。

为了快速的找到key对应的oldFiber，我们将所有还没处理的oldFiber放进以key属性为key，Fiber为value的map。

再遍历剩余的newChildren，通过newChildren[i].key就能在existingChildren中找到key相同的oldFiber。

在我们第一轮和第二轮遍历中，我们遇到的每一个可以复用的节点，一定存在一个代表上一次更新时该节点状态的oldFiber，并且页面上有一个DOM元素与其对应。
那么我们在Diff函数的入口处，定义一个变量 let lastPlacedIndex = 0;

该变量表示当前最后一个可复用节点，对应的oldFiber在上一次更新中所在的位置索引。我们通过这个变量判断节点是否需要移动

如果 oldIndex >= lastPlacedIndex 代表该可复用节点不需要移动
并将 lastPlacedIndex = oldIndex;
如果 oldIndex < lastplacedIndex 该可复用节点之前插入的位置索引小于这次更新需要插入的位置索引，代表该节点需要向右移动
