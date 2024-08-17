### 在vue中使用v-show或v-if 时会导致页面闪烁问题

##### 解决方案

v-cloak
这个指令保持在元素上直到关联实例结束编译。和 CSS 规则如 [v-cloak] { display: none } 一起用时，这个指令可以隐藏未编译的 Mustache 标签直到实例准备完毕。

```
<!-- css -->
[v-cloak] {
  display: none;
}

```
在使用v-show或者v-if的元素的父元素上使用v-cloak 指令 即可
```
<!-- 添加这个v-cloak -->
	<div id='app' v-cloak>
		<div v-if="isShow">
		content
		</div>
	</div>
```