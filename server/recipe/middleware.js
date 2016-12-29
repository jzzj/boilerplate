import compose from 'koa-compose';
import { getNormalFiles, watch } from '@lib/util';
import config from 'config';

let middlewares;
function getMiddlewares(servicePath){
     var ret = getNormalFiles(servicePath)
        .map((file)=>{
            var Middleware = require(file);
            Middleware = Middleware['default'] || Middleware;
            if (!Middleware) return;
            return wrap(Middleware);
        }).filter(Boolean);
    ret.unshift(require("koa-body")());
    return compose(ret);

    // because can't yield *asyncFunction, so i wrap async function to generator function. 
    function wrap(func){
        return function*(next){
            yield func.call(this, next);
        }
    }
}

export default ({path})=>{
    middlewares = getMiddlewares(path);
    return function(app){
        app.use(function *(next){
            try{
                yield middlewares.call(this);
                yield next;
            }catch(e){
                console.error(e.stack);
                this.status = 500;
                this.error = e;
                if(config.isDebug){
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
                console.log('reload middlewares', path);
                middlewares = getMiddlewares(path);
            }
        });
    }
};