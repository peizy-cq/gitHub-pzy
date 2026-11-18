# 一、JavaScript 原型链 (Prototype Chain)
## 1. 是什么？

原型链是 JavaScript 实现继承的机制。每个对象都有一个内部属性 [[Prototype]]，指向它的原型对象。当访问一个对象的属性时，如果对象本身没有该属性，就会去它的原型对象上找，如果还没有，就继续去原型对象的原型上找，直到找到 null。这条链就是原型链。
## 2. 核心关系
    1. 构造函数：function Person() {}。

    2. prototype 属性：构造函数有一个 prototype 属性，指向原型对象。

    3. __proto__ 属性：实例对象有一个 __proto__ 属性，指向构造函数的 prototype。

    4. constructor 属性：原型对象有一个 constructor 属性，指回构造函数。
## 3. 经典示例
**Input**

````md
function Person(name) {
  this.name = name;
}

// 在原型上添加方法
Person.prototype.sayHello = function() {
  console.log(`Hello, I am ${this.name}`);
};

const p1 = new Person('张三');
p1.sayHello(); // Hello, I am 张三

// p1 本身没有 sayHello，它会沿着 __proto__ (即 Person.prototype) 查找
console.log(p1.__proto__ === Person.prototype); // true
console.log(Person.prototype.constructor === Person); // true

````
## 4. 原型链的尽头
    Object.prototype.__proto__ === null。所以所有对象最终都会继承 Object.prototype 上的方法（如 toString, hasOwnProperty）。
## 5. 常见应用场景
    1. 继承：通过修改原型链实现类与类之间的继承（ES6 的 class 只是语法糖，底层依然是原型链）。
    2. 性能优化：将共享的方法挂载在原型上，而不是每个实例都创建一遍。
