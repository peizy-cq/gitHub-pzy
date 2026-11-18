# 图解 JavaScript 闭包：从内存泄漏到防抖节流

## 1. 什么是闭包？

### 1.1 定义

- **官方定义**：闭包（Closure）是指有权访问另一个函数作用域中变量的函数。
- **通俗理解**：当一个内部函数被传递到外部，并且这个内部函数还保留着对外部函数变量的引用时，就形成了闭包。
- **一句话判断**：函数「记住了」自己出生时所在的那个作用域，它就是闭包。

![闭包作用域示意图：outer 执行完毕后，inner 依然持有 name 的引用](/images/closure-scope.png)

如上图：`outer` 的调用栈已经出栈，但因为外部的 `myFunc` 还牵着 `inner`，而 `inner` 的 `[[Scopes]]` 里还牵着 `name`，这条引用链让 `name` 无法被垃圾回收。

### 1.2 最小示例

```js
function outer() {
  let name = 'Tom'; // 外部函数的局部变量

  function inner() {
    console.log(name); // 内部函数访问了外部变量
  }

  return inner;
}

const myFunc = outer(); // outer 执行完毕，通常它的局部变量会被销毁
myFunc(); // 输出：'Tom'，这就是闭包的力量
```

这段代码有三个关键点：

1. `inner` 定义在 `outer` 内部，天生就能访问 `name`；
2. `inner` 被当作返回值交到了外部，作用域「活」得比 `outer` 更久；
3. `outer` 执行结束后，`name` 并没有被销毁，而是被 `inner` 带着走了。

## 2. 闭包是怎么形成的？

理解形成过程，比背定义更有用。

1. **执行上下文（Execution Context）**：`outer` 被调用时创建执行上下文，局部变量 `name` 被压入调用栈。
2. **词法作用域（Lexical Scoping）**：JavaScript 采用静态词法作用域——函数的作用域在**定义时**就确定了，而不是调用时。所以 `inner` 一出生就知道自己的外层是 `outer`。
3. **作用域链（Scope Chain）**：`inner` 内部找不到 `name` 时，会顺着作用域链往外层找，最终在 `outer` 中命中。
4. **变量保留（不被回收）**：`outer` 返回后，执行上下文本应出栈销毁。但 V8 做垃圾回收（GC）时发现，被 `myFunc` 引用的 `inner` 的 `[[Scopes]]` 里还保存着 `outer` 的作用域，于是 `outer` 的活动对象（Activation Object）被保留在内存中。

![闭包形成过程：outer 出栈后，它的变量被搬进堆内存，由 inner 的 [[Scopes]] 牵着走](/images/closure-stack-heap.png)

把上图串起来看：`outer` 的栈帧确实弹出了，但它的活动对象没有被销毁，而是「搬家」到了堆内存，由 `inner` 的 `[[Scopes]]` 指过去——这一段停留在堆里的作用域，就是常说的 **Closure 对象**。

> 小技巧：在 Chrome 控制台打断点，展开函数的 `[[Scopes]]` 就能看到一个 `Closure` 节点——那就是闭包实际持有的变量。

**一句话总结**：闭包 = 函数 + 它定义时所在的作用域链。

## 3. 闭包引发的内存泄漏（踩坑实录）

因为闭包会让外部函数的变量一直留在内存中（无法被垃圾回收器回收），使用不当就会造成内存泄漏。

### 3.1 经典场景：循环中的 DOM 事件监听

```js
// 假设页面上有 100 个按钮
for (var i = 0; i < 100; i++) {
  var btn = document.getElementById('btn-' + i);
  btn.onclick = function () {
    console.log('你点击了第 ' + i + ' 个按钮');
  };
}
```

### 3.2 现象

无论点击哪个按钮，输出的永远是「你点击了第 100 个按钮」。

### 3.3 原因

1. `var` 声明的 `i` 是函数作用域，整个循环只有**一个** `i`；
2. 100 个匿名函数（闭包）共享了同一个作用域里的 `i`；
3. 循环结束时 `i` 已经变成 100；
4. 100 个闭包一直引用着同一个 `i`（以及 `btn` 所在的上下文），不仅结果不符合预期，还让这些闭包及其依赖的上下文无法释放。

### 3.4 解决方案

**方法一：用 `let` 声明 `i`**，产生块级作用域，每次循环都生成一个新的 `i`。

```js
for (let i = 0; i < 100; i++) {
  const btn = document.getElementById('btn-' + i);
  btn.onclick = function () {
    console.log('你点击了第 ' + i + ' 个按钮');
  };
}
```

**方法二：用立即执行函数（IIFE）包裹**，为每一轮创建独立作用域。

```js
for (var i = 0; i < 100; i++) {
  (function (index) {
    var btn = document.getElementById('btn-' + index);
    btn.onclick = function () {
      console.log('你点击了第 ' + index + ' 个按钮');
    };
  })(i);
}
```

**方法三：事件委托**，只挂一个监听，从根源上减少闭包数量。

```js
document.querySelector('.btn-list').addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    console.log('你点击了 ' + e.target.id);
  }
});
```

### 3.5 真正需要警惕的泄漏点

闭包本身**不等于**内存泄漏。真正的风险是「闭包长期持有了不该长期持有的东西」：

- 闭包里引用了大对象、大数组、DOM 节点；
- 定时器 / 事件监听创建后从未清除；
- 组件销毁时，监听器和 `setInterval` 还在跑。

所以实践中的三条原则：**该移除的监听要移除、该清的定时器要清、该置空的引用要置空**。

## 4. 闭包的高级应用：防抖与节流

闭包也是实现高阶函数的基石。前端性能优化里最常见的两个函数——防抖（Debounce）和节流（Throttle），底层都是闭包。

### 4.1 防抖（Debounce）

- **场景**：搜索框输入时，等用户停止输入 500ms 后再发请求，避免每敲一个字就请求一次。
- **原理**：用闭包保存一个 `timer`，每次触发事件就清掉上一个定时器，重新计时。

![防抖时间轴：每次输入都会打断上一个定时器，停止输入 500ms 后才真正执行一次 fn](/images/closure-debounce.png)

```js
function debounce(fn, delay) {
  let timer = null; // 闭包保存这个 timer

  return function (...args) {
    if (timer) clearTimeout(timer); // 清除上一次的定时器
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
```

特点：**只认最后一次**。连续触发 N 次，最终只执行 1 次。

### 4.2 节流（Throttle）

- **场景**：页面滚动加载更多、按钮防止连点，保证一段时间内只执行一次。
- **原理**：用闭包保存一个「是否处于冷却期」的标记（`inThrottle`）。

```js
function throttle(fn, limit) {
  let inThrottle = false; // 闭包保存冷却状态

  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
```

特点：**匀速执行**。连续触发 N 次，按固定间隔执行多次。

### 4.3 两者对比

| 对比项 | 防抖 Debounce | 节流 Throttle |
| --- | --- | --- |
| 执行时机 | 停止触发 `delay` 之后 | 每 `limit` 时间内的第一次 |
| 连续触发结果 | 只执行 1 次 | 按间隔执行多次 |
| 典型场景 | 搜索联想、表单校验、窗口 resize | 滚动加载、按钮防连点、拖拽 |

## 5. 小结

1. **闭包的本质**是函数携带了定义时的作用域链，所以外部函数的变量得以延寿。
2. **收益**：私有变量、状态保存、高阶函数（防抖 / 节流 / 柯里化 / 缓存）都靠它。
3. **代价**：变量不被回收，滥用会带来内存压力。
4. **使用原则**：不需要长期持有的引用，就别让闭包牵住它。

## 6. 常见追问

- **闭包一定会造成内存泄漏吗？** 不会。被引用的变量在闭包失效后照常回收，问题出在「永不失效的引用」（全局监听、未清的定时器）。
- **`for + let` 为什么能解决？** `let` 是块级作用域，每轮循环都会创建新的绑定，闭包各自捕获自己的那一份。
- **闭包和垃圾回收什么关系？** 闭包让作用域对象的引用计数不为 0，GC 认为它「可达」，因此不回收。
- **防抖和节流用哪个？** 只要最终结果、不要中间过程用防抖；需要节流式反馈（如进度、滚动位置）用节流。
