import compose from 'koa-compose';
import Router from 'koa-router';
import { getNormalFiles, watch } from '@lib/util';
import path from 'path';
import config from 'config';

let routes;
function getRoutes(controllerPath){
    const router = Router();
    var files = getNormalFiles(controllerPath)
        .map(file=>{
            let controller = require(file);
            controller = controller.default || controller;
            if(typeof controller === 'function'){
                controller = controller(app);
            }
            if(!controller)return;
            if(!Array.isArray(controller)){
                controller = [controller];
            }
            var fallbackUrl = "/"+path.relative(controllerPath, file).replace(/\.[^\/]*$/, '');
            controller.map(route=>{
                const url = route.url || fallbackUrl;
                const methods = [].concat(route.method || route.methods || "get").map(x => x.toLowerCase());
                const handlers = [].concat(route.middleware).concat(function * handle(next){

                    if(this.$injector){
                        yield this.$injector.invoke(route.handler, this);
                    }else{
                        yield route.handler.call(this);
                    }
                }).filter(Boolean);
                methods.forEach(method=>{
                    router[method](url, compose(handlers));
                });
            });
            
        });
    return router.routes();
}

export default ({path})=>{
    routes = getRoutes(path);
    return function(app){
        app.use(function *(next){
            try{
                yield routes.call(this, next);
            }catch(e){
                e && console.error(e && e.stack);
                this.status = 500;
                this.error = e;
                if(config.isDebug && e){
                    this.body = e.stack;
                }else{
                    yield next;
                }
            }
        });

        watch({
            path: path,
            test: /.js/,
            callback(file){
                delete require.cache[file];
                console.log('reload routes', path);
                routes = getRoutes(path);
            }
        });
    }
};