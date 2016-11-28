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
  
## Usage
```sh
npm install simple-boilerplate
```
fetch the boilerplate to local.
You could just start with change the project name, then you can develop your own project.

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
