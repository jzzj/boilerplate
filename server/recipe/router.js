import compose from 'koa-compose';
import Router from 'koa-router';
import { getNormalFiles, watch } from '@lib/util';
import path from 'path';
import config from 'config';

let routes;
let templateMap = {};
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
                if(route.template) {
                    getTemplate(route.template);
                }

                const handlers = [].concat(route.middleware || []).concat(function * handle(next){
                    if(config.isDebug) {
                        getTemplate(route.template);
                    }
                    if(route.template) {
                        this.templateName = route.template;
                        this.template = templateMap[route.template];
                    }
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

function getTemplate(templateName) {
    let templatePath;
    if(!config.isOnline) {
        templatePath = config.path.template;
    } else {
        templatePath = config.path.template.replace(config.path.client, config.path['static']);
    }
    const fileTransform = require('res-dump-service').fileTransform;
    templateMap[templateName] = fileTransform(path.join(templatePath, templateName + '.html'));  // hardcode
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
                    //yield next;
                    throw e;
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