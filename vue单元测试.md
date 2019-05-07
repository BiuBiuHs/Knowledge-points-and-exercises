 #### 安装 
 快速尝鲜 Vue Test Utils 的办法就是克隆我们的 demo 仓库再加上基本的设置和依赖安装。
 ```
 git clone https://github.com/vuejs/vue-test-utils-getting-started
cd vue-test-utils-getting-started
npm install
 ```
 
 #### 挂载组件
 
 Vue Test Utils 通过将它们隔离挂载，然后模拟必要的输入 (prop、注入和用户事件) 和对输出 (渲染结果、触发的自定义事件) 的断言来测试 Vue 组件。
被挂载的组件会返回到一个包裹器内，而包裹器会暴露很多封装、遍历和查询其内部的 Vue 组件实例的便捷的方法。
你可以通过 mount 方法来创建包裹器。让我们创建一个名叫 test.js 的文件：

```
// test.js

// 从测试实用工具集中导入 `mount()` 方法
// 同时导入你要测试的组件
import { mount } from '@vue/test-utils'
import Counter from './counter'

// 现在挂载组件，你便得到了这个包裹器
const wrapper = mount(Counter)

// 你可以通过 `wrapper.vm` 访问实际的 Vue 实例
const vm = wrapper.vm

// 在控制台将其记录下来即可深度审阅包裹器
// 我们对 Vue Test Utils 的探索也由此开始
console.log(wrapper)
```
#### 测试组件渲染出来的 HTML

```
import { mount } from '@vue/test-utils'
import Counter from './counter'

describe('计数器', () => {
  // 现在挂载组件，你便得到了这个包裹器
  const wrapper = mount(Counter)

  it('渲染正确的标记', () => {
    expect(wrapper.html()).toContain('<span class="count">0</span>')
  })

  // 也便于检查已存在的元素
  it('是一个按钮', () => {
    expect(wrapper.contains('button')).toBe(true)
  })
})
```
现在执行 npm test 进行测试


#### 模拟用户交互

当用户点击按钮的时候，我们的计数器应该递增。为了模拟这一行为，我们首先需要通过 wrapper.find() 定位该按钮，此方法返回一个该按钮元素的包裹器。
然后我们能够通过对该按钮包裹器调用 .trigger() 来模拟点击。
```
it('点击按钮应该使得计数递增', () => {
  expect(wrapper.vm.count).toBe(0)
  const button = wrapper.find('button')
  button.trigger('click')
  expect(wrapper.vm.count).toBe(1)
})
```


#### 浅渲染
对于包含许多子组件的组件来说，整个渲染树可能会非常大。重复渲染所有的子组件可能会让我们的测试变慢。
Vue Test Utils 允许你通过 shallowMount 方法只挂载一个组件而不渲染其子组件 (即保留它们的存根)：

```
import { shallowMount } from '@vue/test-utils'

const wrapper = shallowMount(Component)
wrapper.vm // 挂载的 Vue 实例
```
#### 断言触发的事件
每个挂载的包裹器都会通过其背后的 Vue 实例自动记录所有被触发的事件。你可以用 wrapper.emitted() 方法取回这些事件记录。

```
wrapper.vm.$emit('foo')
wrapper.vm.$emit('foo', 123)

/*
`wrapper.emitted()` 返回以下对象：
{
  foo: [[], [123]]
}
*/

// 断言事件已经被触发
expect(wrapper.emitted().foo).toBeTruthy()

// 断言事件的数量
expect(wrapper.emitted().foo.length).toBe(2)

// 断言事件的有效数据
expect(wrapper.emitted().foo[1]).toEqual([123])
```

也可以调用 wrapper.emittedByOrder() 获取一个按触发先后排序的事件数组

#### 操作组件状态

```
wrapper.setData({ count: 10 })

wrapper.setProps({ foo: 'bar' })
```
#### 仿造 Prop

```
import { mount } from '@vue/test-utils'

mount(Component, {
  propsData: {
    aProp: 'some value'
  }
})
```

