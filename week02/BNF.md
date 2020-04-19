# BNF Example
```
<Number> ::= "0" | "1" | "2" | ...... | "9"

<DecimalNumber> ::= "0" | (("1" | "2" | "3" | ...... | "9") <Number>*)

<PrimaryExpression> ::= <DecimalNumber> | <LogicalExpression>

<MultiplicativeExpression> ::=  <DecimalNumber> |
    <MultiplicativeExpression> "*" <DecimalNumber> |
    <MultiplicativeExpression> "/" <DecimalNumber>

<AddtiveExpression> ::= <MultiplicativeExpression> |
    <AddtiveExpression> "+" <MultiplicativeExpression> |
    <AddtiveExpression> "-" <MultiplicativeExpression>

<LogicalExpression> ::= <AddtiveExpression> |
    <LogicalExpression> "||" <AddtiveExpression> |
    <LogicalExpression> "&&" <AddtiveExpression>
```

尝试将以上文法使用正则表达式写出来

# 文法：

## 1. 无限制文法（0型文法）
> ? ::= ?
> 产生式的左右两侧可以使用任意的终结符和非终结符

## 2. 1型文法  上下文相关文法
> `?<A>?::= ?<B>?`

例如： JavaScript 中的get
```js
{
    get name () {
        return a;
    },
    get: a
}
```
根据上下文的不同，get表示不同的意思

## 3. 2型文法 上下文无关文法
> `<A> ::= ?`

## 4. 3型文法 正则文法(只允许左递归)
> `<A> ::= <A>?`

# 图灵完备性

- 图灵完备性
    - 命令式 ———— 图灵机
        - goto
        - if 和 while
    - 声明式 ———— lambda
        - 递归

一门计算机语言必须是图灵完备的

# 动态与静态

## 动态
- 在用户的设备 / 在线服务器上
- 产品实际运行时
- Runtime

## 静态
- 在程序员的设备上
- 产品开发时
- Compiletime

# 类型系统

- 动态类型系统与静态类型系统
- 强类型与弱类型
> 强类型 不等于 静态类型，能发生隐式转换的语言都是弱类型语言
- 复合类型
    - 结构体
    - 函数签名
- 子类型
    -  逆变 / 斜变

协变： 凡是能用`Array<Parent>`的地方，都能用`Array<Child>` 

逆变： 凡是能用`Function<Child>`的地方，都能用`Function<Parent>`

# 一般命令式编程语言

Atom --> Expression --> Statement --> Structure --> Program

- Atom
    - Identifier
    - Literal

- Expression
    - Atom
    - Operator
    - Punctuator

- Statement
    - Expression
    - Keyword
    - Punctuator

- Structure
    - Function
    - Class
    - Process
    - Namespace
    - ...

- Program
    - Program
    - Module
    - Package
    - Library
