import css_Zindex_Level from './相关图片/css层叠等级.png'

css_Zindex_Level

//1. 形成堆叠上下文环境的元素的背景与边框


//2. 拥有负 z-index 的子堆叠上下文元素 （负的越高越堆叠层级越低）


//3. 正常流式布局，非 inline-block，无 position 定位（static除外）的子元素


//4. 无 position 定位（static除外）的 float 浮动元素


//5. 正常流式布局， inline-block元素，无 position 定位（static除外）的子元素（包括 display:table 和 display:inline ）


//6. 拥有 z-index:0 的子堆叠上下文元素


//7. 拥有正 z-index: 的子堆叠上下文元素（正的越低越堆叠层级越低）



// 那么，如何触发一个元素形成 堆叠上下文 ？方法如下，摘自 MDN：

// 根元素 (HTML),
// z-index 值不为 "auto"的 绝对/相对定位，
// 一个 z-index 值不为 "auto"的 flex 项目 (flex item)，即：父元素 display: flex|inline-flex，
// opacity 属性值小于 1 的元素（参考 the specification for opacity），
// transform 属性值不为 "none"的元素，
// mix-blend-mode 属性值不为 "normal"的元素，
// filter值不为“none”的元素，
// perspective值不为“none”的元素，
// isolation 属性被设置为 "isolate"的元素，
// position: fixed
// 在 will-change 中指定了任意 CSS 属性，即便你没有直接指定这些属性的值
// -webkit-overflow-scrolling 属性被设置 "touch"的元素

// 所以，上面我们给两个 div 添加 opacity 属性的目的就是为了形成 stacking context。也就是说添加 opacity 替换成上面列出来这些属性都是可以达到同样的效果。
// 在层叠上下文中，其子元素同样也按照上面解释的规则进行层叠。 特别值得一提的是，其子元素的 z-index 值只在父级层叠上下文中有意义。意思就是父元素的 z-index 低于父元素另一个同级元素，子元素 z-index再高也没用。

