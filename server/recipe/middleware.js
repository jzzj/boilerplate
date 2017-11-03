import compose from 'composition';  // koa-compose 在yield前部分的执行顺序是倒的
import { getNormalFiles, watch } from '@lib/util';
import config from 'config';
import co from 'co';

let middlewares;
function getMiddlewares(middlewarePath){
    var ret = getNormalFiles(middlewarePath)
        .map((file)=>{
            var Middleware = require(file);
            Middleware = Middleware['default'] || Middleware;
            if (!Middleware) return;
            return wrapAsyncToGenerator(Middleware);
        }).filter(Boolean);
    // ret.unshift(require("koa-body")());
    return compose(ret);

    function wrapAsyncToGenerator(fn) {
      return function* (next) {
        var p = fn.call(this, co(next));
        // only yield if return a promise
        if (p && typeof p.then === 'function') return yield p;
      }
    }
}

export default ({path})=>{
    middlewares = getMiddlewares(path);
    return function(app){
        app.use(function *(next){
            yield middlewares.call(this, next);
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