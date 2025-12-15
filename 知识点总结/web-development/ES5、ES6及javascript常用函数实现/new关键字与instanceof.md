### new运算符进行了什么操作

new 运算接受一个构造器和一组调用参数，实际上做了几件事：以构造器的 prototype 属性（注意与私有字段[[prototype]]的区分）为原型，创建新对象；将 this 和调用参数传给构造器，执行；如果构造器返回的是对象，则返回，否则返回第一步创建的对象。

```javascript
// ✅ 推荐实现：使用 Object.create（性能更好，更符合规范）
function myNew(Constructor, ...args) {
    // 1. 以 Constructor.prototype 为原型创建新对象（一步到位，性能更好）
    const obj = Object.create(Constructor.prototype);

    // 2. 绑定 this 并执行构造函数
    const result = Constructor.apply(obj, args);

    // 3. 判断返回值：如果构造函数返回了对象或函数，就返回该值，否则返回新创建的对象
    // 注意：null 的 typeof 是 'object'，但 null 不是对象，需要排除
    if ((typeof result === 'object' && result !== null) || typeof result === 'function') {
        return result;
    }
    
    return obj;
}

// 测试用例
function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype.sayHello = function() {
    console.log(`Hello, I'm ${this.name}`);
};

const p1 = myNew(Person, 'Alice', 25);
console.log(p1.name); // Alice
p1.sayHello(); // Hello, I'm Alice
console.log(p1 instanceof Person); // true

// 测试构造函数返回对象的情况
function Factory() {
    this.name = 'default';
    return { custom: 'object' }; // 显式返回对象
}

const f1 = myNew(Factory);
console.log(f1.custom); // 'object'
console.log(f1.name); // undefined（因为返回了自定义对象）

// 测试构造函数返回原始值的情况
function ReturnPrimitive() {
    this.value = 42;
    return 'string'; // 返回原始值会被忽略
}

const r1 = myNew(ReturnPrimitive);
console.log(r1.value); // 42
console.log(typeof r1); // 'object'
```

#### instanceof 是通过判断对象的 prototype 链来确定这个对象是否是某个类的实例，而不关心对象与类的自身结构

   所有的对象都是 Object的实例
