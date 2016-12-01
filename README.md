# boilerplate
Boilerplate for front-end project only use webpack.

## What this for?
It is aim to make a common front-end project boilerplate. Everyone could just fetch it and start working right away without caring about building stuff.

## Directories structure
--project   
&nbsp;&nbsp;--client  
&nbsp;&nbsp;&nbsp;&nbsp;--page      => the entry points go here  
&nbsp;&nbsp;&nbsp;&nbsp;--component    
&nbsp;&nbsp;&nbsp;&nbsp;--...   
&nbsp;&nbsp;--static => builded static files.  
&nbsp;&nbsp;--lib   
&nbsp;&nbsp;--config  

## Update
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
