# 每周总结可以写在这里

## 组件化基础

### 对象与组件

- 对象
    - Properties
    - Methods
    - Inherit

- 组件
    - Properties
    - Methods
    - Inherit
    - Attribute
    - Config & State
    - Event
    - Lifecycle
    - Children

`State` 与 `Children` 是属于Component内部的部分

## Attribute vs Property

Attribute： 强调描述性
（例子：一个人帅不帅）

```html
<my-component attribute="v"/>
```

```js
myComponent.getAttribute("a"); // 跟html代码中完全一直

a.href // 获取到的地址是resolve后的结果 （相对路径可会变成绝对路径等）
```
Property： 强调从属关系
（例子：按钮的某一个属性)

### 生命周期

![](https://s1.ax1x.com/2020/07/08/UZhqvn.png)

### Children

- Content 型 Children 与 Template 型 Children

```html
<my-button><img src="{{icon}}"/>{{title}}</my-button>
```

### 设计轮播组件 Carousel

- state
    - activeIndex
- property
    - loop
    - time
    - imglist
    - autoplay
    - color
- attribute
    - startIndex
    - loop
    - time
    - imglist
    - autoplay
    - color
- children
    有imglist就没有children, 没有imglist就有children
    - append
    - remove
    - add
- event
    - change
    - click
    - hover
    - swipe
    - resize
    - doubleclick
- method
    - next()
    - prev()
    - goto()
    - play()
    - stop()
- config (多种可选项的属性)
    - mode: 'useTimeout', 'useRequestAnimationFrame'
        - setInterval(tick, 16);
        - setTimeout()
        - requestAnimationFrame

CarouselView