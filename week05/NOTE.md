# 每周总结可以写在这里

## Toy-Browser
[点击查看代码](https://github.com/swpuhu/Frontend-01-Template/blob/master/week05/client.js)

## 可视化JS所有对象的作业
[点击查看效果](https://swpuhu.github.io/Frontend-01-Template/week04/g6.html)

## [点击查看HTTP 标准](https://tools.ietf.org/html/rfc2616)
HTTP请求
```         
POST / HTTP 1.1         // 请求行
Host: 127.0.0.1         // 请求头
Content-Type: application/x-www-form-urlencoded  
                        // 空行
field=1aaa&code=x%3D1   // 请求体
```

HTTP响应
```
HTTP/1.1 200 OK                         // status line
Content-Type: text/html                 // headers
Date: Mon, 23 Dec 2019 06:46:19 GMT
Connection: keep-alive
Transfer-Encoding: chunked
                                        // 空行
<html>
    <header></header>
    <body>
        Hello World
    </body>
</html>

```