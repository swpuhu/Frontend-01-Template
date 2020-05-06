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