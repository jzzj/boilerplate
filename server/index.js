import Koa from 'koa';
import compose from 'koa-compose';
import Injector from 'easy-injector';
import glob from "glob";
import path from 'path';
import config from 'config';
import service from './recipe/service';
import router from './recipe/router';
import interceptor from './recipe/interceptor';
import middleware from './recipe/middleware';

const controllerPath = config.path.controller;
const servicePath = config.path.servicePath;
const interceptorPath = config.path.interceptorPath;
const middlewarePath = config.path.middlewarePath;

const app = new Koa();

// setup $injector and other stuff
app.use(function * (next){
    this.$injector = Injector();
    this.$injector.service('context', this);
    this.$injector.service('app', app);
    yield next;
    //gc
    this.$injector = null;
});

// inject service, router, middleware
// order does matter.
function inject(){
    interceptor({
        path: interceptorPath
    })(app);

    service({
        path: servicePath
    })(app);

    middleware({
        path: middlewarePath
    })(app);

    if(config.isDebug){
        require('@root/devserver')(app, config.proxy);
    }

    router({
        path: controllerPath
    })(app);
}

inject();

app.listen(config.port);
console.log("=========== Server is listening on "+config.port+" ==========");