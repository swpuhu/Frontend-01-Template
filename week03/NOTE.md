# 总结

## JavaScript 标准中，我们无法实现的对象

### Reference Type
> Reference 类型被用于解释 `delete`, `typeof`， 赋值运算符，`super` 关键字等运算符的行为。例如：赋值符号的左值就应该产生一个reference。

一个Reference是一个已解析的名称或者属性绑定。一个Reference由三部分组成： 
- base value component
- referenced name component
- Boolean-valued strict reference flag

其中，base value component是下列类型中的其中一种：
- undefined
- Object
- Boolean
- String
- Symbol
- Number
- Environment Record

一个为undefined的base value表示该引用不能作为一个绑定被解析。
referenced name component 是一个字符串或者Symbol值

Super Reference是一种表示用super关键字表示的名称绑定的Reference类型
Super Reference 有一个额外的 thisValue Component，并且它不可能是Environment Record类型

### List and Record Specification Types

#### List Type

List Type 用于解释在new表达式，函数调用和一些需要有序的数值算法中的参数列表的值。List Type的值是包含简单的有序的独立值的列表的序列。这些序列的长度可以是任意值。列表中的元素可以通过索引进行随机存取。


#### Record Type

Record Type描述了本标准中算法中的数据集合。一个Record Type是由一个或多个具名的域组成。每个域的值可能是ECMAScript的值或者是一个名称相关的Record Type的抽象值。域的名字总是被双中括号"[[]]"包裹。例如： `[[Value]]`

### Set and Relation Specification Types

#### Set Type
Set Type被用于解释在内存模型中无序元素的集合。它的值是简单的不重复的元素集合，元素可以从集合中被添加和移除。集合之间可以进行交集，并集，差集运算。

#### Relation Type
Relation Type被用于解释集合中的约束。它的值是由集合中成对的值组成的集合。例如，对于Relation R和两个在R的值域中的两个值a, b。我们可以简称有序对(a, b)是R的成员。

### Completion Record Specification Type
Completion Type是一种被用于解释运行时中值和流程（如: `break, continue, return, throw`）的传递和执行非局部流程传递的Record类型。
它的值是一个Record类型的值，其Fileds的定义参考下标.

|域|值|含义|
|:---:|:--:|:--:|
|[[Type]]|normal, break,continue, return or throw其中之一|completion的具体类型|
|[[Value]]|任意的ECMAScript值或者空|具体产生的值|
|[[Target]]|任意的ECMAScript值或者空|定向控制流程的标签|

### Property Descriptor Specification Type

Property Descriptor Specification Type 用于解释对象属性的具体含义和行为。它的值是Record类型。具体的值如下：

|属性名|值域|描述|
|:---:|:--:|:--:|
|[[Get]]|Object或Undefined|如果该值是对象，则必须是函数对象，每次读取propertyName时，该函数就会被调用|
|[[Set]]|Object或Undefined值或者空|如果该值是对象，则必须是函数对象，每次写propertyName时，该函数就会被调用|
|[[Enumerable]]|Boolean|为true时表示该property可以被for-in遍历到，否则不能|
|[[Configurable]]|Boolean|为false时，删除和修改该property都会失效|


### Lexical Environments
Lexical Environment 用于定义标识符与特定变量的联系和基于ECMAScript代码的词法嵌套的函数。Lexical Environment时由Environment Record和一个参考外部Lexical Environment可能为null的值。通常Lexical Environment与一些特定的语法结构相关，例如： FunctionDeclaration, BlockStatement或者是TryStatement中的Catch闭合的部分，并且每次这样的代码产生时就会形成新的Lexical  Environment。

一个Environment Record 记录了在一个标识符在创建它的相关的Lexical Environment中的作用域中的绑定关系。它被作为Lexical Environment的Environment Record。

### Environment Records
本标准中有两种基本的Environment Record的值： *`declaraive Environment Records`* 和 *`object Environment Record`*。Decalarative Environment Records 被用于定义ECMAScript语法元素的影响，例如： *`FunctionDeclarations, VariableDeclarations `* 和*`Catch`* 闭合的部分，这些元素直接关联这ECMAScript中标识符的绑定关系。Object Environment Records被用于定义ECMAScript元素的影响，例如： *`WithStatement`*关系标识符与一些对象的绑定关系。 Global Environment Records和 function Environment Records时被专门用于Script全局声明和函数中的顶层声明。

### Data Block
Data Block specification type 被用于表示独立可变的8位大小的数值。它的值是以固定的位数所创建，并且初始值为0.



## 数字/字符串互转函数

```js
function convertStringToNumber (string, x = 10) {
    let chars = string.split('');
    let number = 0;
    let i = 0;
    while (i < chars.length && chars[i] !== '.') {
        number = number * x;
        if (/[a-f]/.test(chars[i])) {
            number += chars[i].codePointAt(0) - 'a'.codePointAt() + 10;

        } else if (/[A-F]/.test(chars[i])) {
            number += chars[i].codePointAt(0) - 'A'.codePointAt() + 10;
        } else {
            number += chars[i].codePointAt(0) - '0'.codePointAt();
        }
        i++;
    }
    if (chars[i] == '.') {
        i++;
    }
    let fraction = 1;
    while (i < chars.length && chars[i] != 'e') {
        fraction /= x;
        number += (chars[i].codePointAt(0) - '0'.codePointAt()) * fraction;
        i++;
    }
    
    
    if (chars[i] == 'e') {
        i++;
    }
    let exp = 0;
    while (i < chars.length) {
        exp *= chars[i];
        exp += (chars[i].codePointAt(0) - '0'.codePointAt());
        i++;
    }
    return number * (10 ** exp);
}


function convertNumberToString(number, x = 10) {
    let integer = Math.floor(number);
    let fraction = number - integer;
    let string = '';
    while (integer) {
        string = integer % x + string;
        integer = Math.floor(integer / x);
    }
    if (fraction) {
        string += '.';
        while (fraction) {
            string += Math.floor(fraction * x);
            fraction = fraction * x - Math.floor(fraction * x);
        }
    }
    return string;
}
```



# 课堂笔记

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

