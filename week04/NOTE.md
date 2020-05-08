# 每周总结可以写在这里

## 宏任务
- script 包括的代码片段
- 函数调用
- setTimeout
- setInterval
JS引擎并不包含setTimeout, setInterval，是由浏览器/Node.js提供的。



## 微任务

在JavaScript引擎内的代码都是微任务，在JavaScript引擎外的是宏任务


### 错误观点：
then内的是微任务这是错误的。

> 《重学前端》：我们把宿主发起的任务称为宏观任务，把 JavaScript 引擎发起的任务称为微观任务。Promise 永远在队列尾部添加微观任务。setTimeout 等宿主 API，则会添加宏观任务。

## JavaScript 标准中global中全部的对象

### 三个值

- Infinity
- NaN
- undefined

### 九个函数
- eval
- isFinite
- isNaN
- parseFloat
- parseInt
- decodeURI
- decodeURIComponent
- encodeURI
- encodeURIComponent

### 一些构造器
- Array
- Date
- RegExp
- Promise
- Proxy
- Map
- WeakMap
- Set
- WeakSet
- Function
- Boolean
- String
- Number
- Symbol
- Object
- Error
- EvalError
- RangeError
- ReferenceError
- SyntaxError
- TypeError
- URIError
- ArrayBuffer
- SharedArrayBuffer
- DataView
- Typed Array
- Float32Array
- Float64Array
- Int8Array
- Int16Array
- Int32Array
- UInt8Array
- UInt16Array
- UInt32Array
- UInt8ClampedArray
- Atomics
- JSON
- Math
- Reflect


## 执行上下文栈 (Execution Context Stack)

执行上下文栈是一种用于追踪运行时code evaluation的装置。

### Lexical Environment
- this
- new.target
- super
- 变量

## 浏览器工作原理

### 总论与HTTP协议

URL --HTTP--> HTML --parse--> DOM --CSS Computing--> DOM with CSS --layout-->
DOM with position --render--> Bitmap

ISO-OSI七层网络模型

1. 应用
2. 表示
3. 会话
4. 传输
5. 网络
6. 数据链路层
7. 物理层
