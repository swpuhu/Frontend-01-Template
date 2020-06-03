## 简单选择器

- *
- div svg|a
- .cls
- #id
- [attr=value]
- :hover
- ::before

## 复合选择器
- <简单选择器><简单选择器><简单选择器>
- *或者div必须写在最前面

## 复杂选择器
- <复合选择器>\<sp\><复合选择器>
> \<sp\>表示空格
- <复合选择器> ">" <复合选择器>
> 只能选择子一级，严格的父子关系
- <复合选择器> "~" <复合选择器>
- <复合选择器> "+" <复合选择器>
- <复合选择器> "||" <复合选择器>

## 选择器的优先级

除了 #id 和 .cls 其他的优先级都为最低优先级，inline-style的优先级比其他的都高

\#id div.a#id

[0, 2, 1, 1] 表示有0个内联样式，2个id选择器，1个div和1个class

那么此选择器的优先级

S = 0 * N<sup>3</sup> + 2 * N<sup>2</sup> + 1 * N<sup>1</sup> + 1

> N 取任意正整数

## 作业：编写match函数
在toy-browser中，我们可以搭配使用htmlparser2， domhandler， css-select来进行流式的解析。代码如下

```js
const {Parser} = require('htmlparser2');
const {DomHandler} = require('domhandler');
const fs = require('fs');
const CSSselect = require('css-select');

const rawHtml = fs.readFileSync(__dirname + '/page.html');

function match(selector, ele, context) {
    let res = CSSselect(selector, context);
    return res.indexOf(ele) > -1;
}

const handler = new DomHandler((err, dom) => {
    if (err) {

    } else {
        // console.log(dom);
        let res = CSSselect('#flex', dom);
        console.log(res);
        let isMatch = match('#flex', res[0], dom);
        console.log(isMatch);
    }
});

const parser = new Parser(handler);
parser.write(rawHtml);
parser.end();
```

在浏览器环境中可以使用matchs-selector这个包。
```js
matches(el, 'ul li a');

```