# boilerplate
这是一个前端项目的模板，仅用了webpack作为打包工具

## 为什么？
这个主要目的是为了创建一个通用的前端项目模版，任何人都可以直接clone下来然后马上进行开发，而不用关心构建的事情！

## 目录结构
--project   
&nbsp;&nbsp;--client  
&nbsp;&nbsp;&nbsp;&nbsp;--page      => 入口文件  
&nbsp;&nbsp;&nbsp;&nbsp;--component    
&nbsp;&nbsp;&nbsp;&nbsp;--vendor => 第三方库  
&nbsp;&nbsp;&nbsp;&nbsp;--...   
&nbsp;&nbsp;--static => 静态资源目录，建议使用static，其它目录也完全可以，不过需要手动修改config下面的配置文件  
&nbsp;&nbsp;--lib   
&nbsp;&nbsp;--config  

## [English Doc](https://github.com/jzzj/boilerplate)

## 用法
```sh
git clone https://github.com/jzzj/boilerplate.git
```
拉取模板项目到本地，改变项目名为自己想要的名字，如果不喜欢默认的配置当然可以修改config下面的配置文件，然后:
```sh
npm install
```
终于可以进行你的开发工作了, 应该没有花太长时间把, 对吧?!(如果没你想象的那么简单请一定要告诉我！)

```sh
npm run dev
```
开启dev服务 

```sh
npm run build
```
development环境下进行静态资源文件的构建

```sh
npm run prod
```
production环境下进行静态资源文件的构建

```sh
npm run dev:lib
```
development环境下进行第三方库文件的构建

```sh
npm run prod:lib
```
production环境下进行第三方库文件的构建

## [Resource-dump-service/plugin](https://github.com/jzzj/res-dump-plugin)
再次让html变得好用了!  
因为我实在不喜欢在js里面导入所有的模块（有可能是html/css） 
所以最终是这样的：  
html文件还是入口文件!  
你以前是这么引用资源的：
```html
<script src="/some/page/index.js"></script>
```
现在，然后你所有的资源引用可以这么写，甚至在css文件里面:
```css
body{
  background-image: url(${require('@alias/path/to/your/image.jpg')})
}
```
```html
<head>
   <link href="${require('./client/page/index/index.css')}" rel="stylesheet" type="text/css"/>
</head>
<body>
   <img src="${require('@client/img/cat.jpg')}"/>
   <script src="${require('/some/awesome/index.js')}"></script>
</body>
```
你不仅仅可以require资源js中，也可以在任何地方了!  
享受一下吧!

## Test
```sh
npm run test
```
进行production的构建，然后启动一个python的服务（如果出现了错误，可能是你没有python的环境导致的），然后自动打开一个浏览器页面  
你能在server的日志中看到production环境的静态资源请求是这样的:
```text
127.0.0.1 - - [28/Nov/2016 15:17:21] "GET /static/template/index.html HTTP/1.1" 200 -
127.0.0.1 - - [28/Nov/2016 15:17:21] "GET /static/page/index/index.aef6601.css HTTP/1.1" 200 -
127.0.0.1 - - [28/Nov/2016 15:17:21] "GET /static/page/common.de04cfeb.js HTTP/1.1" 200 -
127.0.0.1 - - [28/Nov/2016 15:17:21] "GET /static/page/index/index.c0bc339.js HTTP/1.1" 200 -
```
浏览器的开发者工具中network中的请求是这样的:
```test
index.html	        200	document	Other	584 B	2 ms	
index.aef6601.css	200	stylesheet	index.html:5	222 B	3 ms	
common.de04cfeb.js	200	script	index.html:9	91.8 KB	4 ms	
index.c0bc339.js	200	script	index.html:10	140 KB	5 ms	
```
