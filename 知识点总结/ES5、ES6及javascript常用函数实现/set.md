### Set 实例的属性和方法
Set 结构的实例有以下属性。

Set.prototype.constructor：构造函数，默认就是Set函数。
Set.prototype.size：返回Set实例的成员总数。
Set 实例的方法分为两大类：操作方法（用于操作数据）和遍历方法（用于遍历成员）。
### 操作类包含一下四种
add(value)：添加某个值，返回 Set 结构本身。
delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。
has(value)：返回一个布尔值，表示该值是否为Set的成员。
clear()：清除所有成员，没有返回值。

Array.from方法可以将 Set 结构转为数组。
```
//将set结构转换为数组
const items = new Set([1, 2, 3, 4, 5]);
const array = Array.from(items);
//数组去重
1.function dedupe(array) {
  return Array.from(new Set(array));
}
2. [...new Set(array)]

dedupe([1, 1, 2, 3]) // [1, 2, 3]
```
### 便利类包含以下四种

keys()：返回键名的遍历器
values()：返回键值的遍历器
entries()：返回键值对的遍历器
forEach()：使用回调函数遍历每个成员

##### Set的遍历顺序就是插入顺序。这个特性有时非常有用，比如使用 Set 保存一个回调函数列表，调用时就能保证按照添加顺序调用。

由于 Set 结构没有键名，只有键值（或者说键名和键值是同一个值），所以keys方法和values方法的行为完全一致。

```
let set = new Set(['red', 'green', 'blue']);

for (let item of set.keys()) {
  console.log(item);
}
// red
// green
// blue

for (let item of set.values()) {
  console.log(item);
}
// red
// green
// blue

for (let item of set.entries()) {
  console.log(item);
}
// ["red", "red"]
// ["green", "green"]
// ["blue", "blue"]
//forEach()方法
let set = new Set([1, 4, 9]);
set.forEach((value, key) => console.log(key + ' : ' + value))
// 1 : 1
// 4 : 4
// 9 : 9

```

####  WeakSet 只能放置对象。 WeakSet 不可遍历
```
const ws = new WeakSet();
ws.add(1)
// TypeError: Invalid value used in weak set
ws.add(Symbol())
// TypeError: invalid value used in weak set
```









