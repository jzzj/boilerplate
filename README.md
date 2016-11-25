# boilerplate
Boilerplate for front-end project only use webpack.

## What this for?
It is aim to make a common front-end project boilerplate. Everyone could just fetch it and start working right away without caring about building stuff.

## Directories structure
--project
  --client
    --page      => the entry points go here
    --component 
    --...
  --static => builded static files.
  --lib
  --config
  
## Usage
Unfortunately, currently only setup the development env. Without production processes.
I'll add production features as soon as possible.

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
