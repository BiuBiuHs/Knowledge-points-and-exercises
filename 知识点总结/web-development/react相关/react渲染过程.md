### react渲染模式

* Concurrent 模式 异步渲染模式,实现了基于任务的时间切片等特性
* legacy 模式 同步渲染模式,现在主要的渲染模式

### react渲染阶段

* render阶段 基于已有的Fiber树(current)构建workInprogress树 在workInprogress记录了需要进行更新的操作(effectList)
* commit阶段 commit分为以下三个阶段:

    1.before mutation 此时dom节点还没有渲染到页面中,执行getSnapshotBeforeUpdate周期函数和useEffect钩子函数
    2.mutation 渲染DOM 根据effectList的tag标注进行dom元素的更新,删除,替换等
    3.layout 执行useLayoutEffect,componentDidMount,componentDidUpdate等相关逻辑 进行current和workInprogress的替换
