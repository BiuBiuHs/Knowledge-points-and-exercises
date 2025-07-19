// 继承的作用是既能通过原型上定义的方法实现复用，又能保证每个实例都有自己属性

//1. 原型链继承
// 这种方式关键在于:子类型的原型为父类型的一个实例对象。

//父类型
function Person(name, age) {
	(this.name = name), (this.age = age), (this.play = [1, 2, 3]);
	this.setName = function () {};
}
Person.prototype.setAge = function () {};
//子类型
function Student(price) {
	this.price = price;
	this.setScore = function () {};
}
Student.prototype = new Person(); // 子类型的原型为父类型的一个实例对象
var s1 = new Student(15000);
var s2 = new Student(14000);
console.log(s1, s2);

// 特点
// 父类新增原型方法/原型属性，子类都能访问到
// 简单，易于实现

//缺点
// 无法实现多继承
// 来自原型对象的所有属性被所有实例共享
// 创建子类实例时，无法向父类构造函数传参
// 要想为子类新增属性和方法，必须要在Student.prototype = new Person() 之后执行，不能放到构造器中

// 2.借用构造函数继承
// 这种方式关键在于:在子类型构造函数中通用call()调用父类型构造函数
function Person(name, age) {
	this.name = name;
	this.age = age;
	this.setName = function (newName) {
		this.name = newName;
	};
}
Person.prototype.setAge = function () {};
function Student(name, age, price) {
	Person.call(this, name, age); // 相当于: this.Person(name, age)
	/*this.name = name
    this.age = age*/
	this.price = price;
}
var s1 = new Student("Tom", 20, 15000);

// 特点：
// 解决了原型链继承中子类实例共享父类引用属性的问题
// 创建子类实例时，可以向父类传递参数
// 可以实现多继承(call多个父类对象)

// 缺点：
// 实例并不是父类的实例，只是子类的实例
// 只能继承父类的实例属性和方法，不能继承原型属性和方法
// 无法实现函数复用，每个子类都有父类实例函数的副本，影响性能

// 3原型链+借用构造函数的组合继承
// 这种方式关键在于:通过调用父类构造，继承父类的属性并保留传参的优点，然后通过将父类实例作为子类原型，实现函数复用。
function Person(name, age) {
	this.name = name;
	this.age = age;
	this.setName = function (newName) {
		this.name = newName;
	};
}
Person.prototype.setAge = function () {
	console.log("111");
};
function Student(name, age, price) {
	//调用了父类的构造函数
	/**
	 * 定义时this指向谁还不确定
	 * 但是在下方 new student时 就确定了this指向 new 创建的新对象
	 * 此时 student 的一个实例 来调用 Person构造函数
	 */
	Person.call(this, name, age);
	this.price = price;
	this.setScore = function () {};
}
Student.prototype = new Person();
Student.prototype.constructor = Student; //组合继承也是需要修复构造函数指向的
Student.prototype.sayHello = function () {};
var s1 = new Student("Tom", 20, 15000);
var s2 = new Student("Jack", 22, 14000);
console.log(s1);
console.log(s1.constructor); //Student
console.log(p1.constructor); //Person

// 优点：

// 可以继承实例属性/方法，也可以继承原型属性/方法
// 不存在引用属性共享问题
// 可传参
// 函数可复用
// 缺点：

// 调用了两次父类构造函数，生成了两份实例

//4 组合继承优化1
function Person(name, age) {
	this.name = name;
	this.age = age;
	this.setName = function (newName) {
		this.name = newName;
	};
}
Person.prototype.setAge = function () {
	console.log("111");
};
function Student(name, age, price) {
	Person.call(this, name, age);
	this.price = price;
	this.setScore = function () {};
}
Student.prototype = Person.prototype;
Student.prototype.sayHello = function () {};
var s1 = new Student("Tom", 20, 15000);
console.log(s1);

// 优点：

// 不会初始化两次实例方法/属性，避免的组合继承的缺点
// 缺点：

// 没办法辨别是实例是子类还是父类创造的，子类和父类的构造函数指向是同一个。

// 5.组合继承优化2

function Person(name, age) {
	(this.name = name), (this.age = age);
}
Person.prototype.setAge = function () {
	console.log("111");
};
function Student(name, age, price) {
	Person.call(this, name, age);
	this.price = price;
	this.setScore = function () {};
}
Student.prototype = Object.create(Person.prototype); //核心代码
Student.prototype.constructor = Student; //核心代码
var s1 = new Student("Tom", 20, 15000);
console.log(s1 instanceof Student, s1 instanceof Person); // true true
console.log(s1.constructor); //Student
console.log(s1);
