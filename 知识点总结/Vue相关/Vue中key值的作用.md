### vue中key值的作用 

#### vue中diff算法
#### react diff 与vuediff原理基本相同  包含以下两条规则
* 1.两个相同的组件产生类似的dom结构，不同的组件产生不同的dom结构
* 2.同一层级的一组节点，可以通过唯一的id进行区分

#### 节点更新时过程
* 1.当页面的数据发生变化的时候，diff算法只会比较同一层级的节点
* 2.比较节点类型 不同直接销毁 重新创建节点 若相同 更新节点属性、事件监听、class等
![](https://upload-images.jianshu.io/upload_images/6559200-7af7bedfe8c3207c.png?imageMogr2/auto-orient/strip|imageView2/2/w/446/format/webp)

### 不使用key 时更新状态是这样的
    不使用key值 会更新每个节点的属性 
![](https://upload-images.jianshu.io/upload_images/4927035-c77b6ad81fd435c3.jpg?imageMogr2/auto-orient/strip|imageView2/2/w/572/format/webp)

### 使用key时 更新状态
    使用key 会最大程度 复用之前的节点 而不是去更新节点的属性
    （替换元素位置）找到元素正确的位置并插入
![](https://upload-images.jianshu.io/upload_images/6559200-4c7a237b2e6ef1fd.png?imageMogr2/auto-orient/strip|imageView2/2/w/554/format/webp)
