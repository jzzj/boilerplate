# boilerplate
Boilerplate for front-end project only use webpack.

## Motivation
It is aim to make a common front-end project boilerplate. Everyone could just fetch it and start working right away without caring about building stuff.

## Directories structure
--project   
&nbsp;&nbsp;--client  
&nbsp;&nbsp;&nbsp;&nbsp;--page      => the entry points go here  
&nbsp;&nbsp;&nbsp;&nbsp;--component    
&nbsp;&nbsp;&nbsp;&nbsp;--vendor => third-party library stuff goes here
&nbsp;&nbsp;&nbsp;&nbsp;--...   
&nbsp;&nbsp;--static => builded static files.  
&nbsp;&nbsp;--lib   
&nbsp;&nbsp;--config  

## [中文文档](https://github.com/jzzj/boilerplate/blob/master/README-CN.md)

## Usage
```sh
git clone https://github.com/jzzj/boilerplate.git
```
fetch/fork the boilerplate to your own repository.
Change the project name to your awesome name, and then:
```sh
npm install
```
Finally you can develop your own project, that's not too long, right?!(Tell me if your feel that's not as simple as you thought.)

```sh
npm run dev
```
start a development server.

```sh
npm run build
```
build static files in development env.

```sh
npm run prod
```
build static files in production env.

```sh
npm run dev:lib
```
build third-party library files in development env.

```sh
npm run prod:lib
```
build third-party library files in production env.  

Actually, when your run ```npm run dev/prod```, it will run ```npm run dev/prod:lib``` automatically. You really run those two commands above rarely. And, by the way, if your change the vendor file, it won't automatically applied. Yes, it is a bug/feature, i will support it in next generation!

## Resource-dump-service/plugin
https://github.com/jzzj/res-dump-plugin
This time i had make html great again!  
Because i'm really don't like import everything in js. (like css/html etc..)  
So, what did is:
html file is still the entry file, and you used to refer to a js will look like this:
```html
<script src="/some/page/index.js"></script>
```
Now, you refer js/css just use require, even in the css file:
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
You can require assets not just in js file now!  
Just enjoy!

## Config
```js
{
	port: 3000,
	// all path args must be indicated.
	path: {
		client: path.join(__dirname, "/../client"),
		"static": path.join(__dirname, "/../static"),
		page: path.join(__dirname, "/../client/page"),
		template: path.join(__dirname, "/../client/template"),
		publicPath: "/static/page",
		staticServerPath: "/static"
	},
	alias: {
		"@client": path.join(__dirname, "/../client"),
		"@lib": path.join(__dirname, "/../lib")
	},
	// options: git, md5. recommand git, faster. Git will use your git commit hash. Md5 will calculate your file's md5 value.
	versionMode: "git"
}
```
There two kind of config within different NODE_ENV: development.js & production.js. [config](https://github.com/lorenwest/node-config)  
### cdn
In some cases, you may want to upload all your resources to cdn server. Then indicates cdn field in production.js(i can't figure out why you would use cdn in development!) like this:
```js
cdn: "http://cdn.example.com/some/path",
```
It still would take care all resources and hash stuff to your static folder, in addition, use cdn as prefix to your reference! 

## Server
Yes, i had finished server support on boilerplate.  
I use koa as a server framework, and take care of router define, middleware, interceptors, and server.  

### Examples
```js
// controller
export default {
	url: "/test",
	method: "get",
	middleware: [],
	handler: async function(response){	// yes, response is registered from service, you can use it directly, the param will injected automatically
		this.body = "test content";
	}
};

// interceptor
export default {
	test: url=>true, // => intercept all requests
	handler: function(){	// => handle is a normal function, not generator function, only support synchronize call.
		this.set('Cache-Control', 'no-cache');
	}
}

// service
export default function(){
	// ...
}	// service would inject as controller arguments.
```
Uh, you maybe dont want to use koa, in such cases, you could use a proxy to redirect request to your own server.

## Test
```sh
npm run test
```
start production build, then start a python simple server, and automatically open a browser page. 
You can tell the production static resource's requests like this:
```text
127.0.0.1 - - [28/Nov/2016 15:17:21] "GET /static/template/index.html HTTP/1.1" 200 -
127.0.0.1 - - [28/Nov/2016 15:17:21] "GET /static/page/index/index.aef6601.css HTTP/1.1" 200 -
127.0.0.1 - - [28/Nov/2016 15:17:21] "GET /static/page/common.de04cfeb.js HTTP/1.1" 200 -
127.0.0.1 - - [28/Nov/2016 15:17:21] "GET /static/page/index/index.c0bc339.js HTTP/1.1" 200 -
```
browser network table will look like this:
```test
index.html	        200	document	Other	584 B	2 ms	
index.aef6601.css	200	stylesheet	index.html:5	222 B	3 ms	
common.de04cfeb.js	200	script	index.html:9	91.8 KB	4 ms	
index.c0bc339.js	200	script	index.html:10	140 KB	5 ms	
```
