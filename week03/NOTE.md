# Atom

## Grammer
- 简单语句:
    - ExpressionStatement
    > `a = 1 + 2`
    - EmptyStatement
    > `;`
    - DebuggerStatement
    > `debugger;`
    - ThrowStatement
    > `throw a;`
    - ContinueStatement
    > `continue label1;`
    - BreakStatement
    > `break label2;`
    - ReturnStatement
    > `return`

- 复合语句
    - BlockStatement
        - [[type]]: normal
        - [[value]]: --
        - [[target]]: --
    ```js
        {
            ......
        }
    ```
    - IfStatement

    - Iteration
        - while
        - do while
        - for(xx; xx; xx)
        - for in
        - for of
        - ~~for await (of)~~


# Completion Record

- [[type]]: normal, break, continue, return, or throw
- [[value]]: Types
- [[target]]: label

# 声明
- FunctionDeclaration
- GeneratorDeclaration
- AsyncFunctionDeclaration
- AsyncGeneratorDeclaration
- VariableDeclaration
- ClassDeclaration
- LexicalDeclaration

函数声明
```js
function foo () {}

```

函数表达式

```js
let o = function foo () {}
```


## 作用域与上下文的区别：

作用域：源代码的文本范围（变量能够作用的范围）
执行上下文：JavaScript引擎执行的时候所在的内存区域


## 面向对象

行为： 改变自身状态的行为

我们不应该受到语言描述的干扰

**在设计对象的状态和行为时，我们总是遵循“行为改变状态”的原则**

```js
class Human {
    hurt (damage) {
        // 修改了自身的状态
    }
}

class Dog {
    bite (human) {
        // 错误的设计
    }
}
```

JavaScript 用属性来统一抽象对象状态和行为

一般来说，数据属性用于描述状态，访问器属性则用于描述行为

数据属性中如果存储函数，也可以用于描述行为

