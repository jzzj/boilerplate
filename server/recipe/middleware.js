import compose_es7 from 'composition';
import { getNormalFiles, watch } from '@lib/util';
import config from 'config';

let middlewares;
function getMiddlewares(servicePath){
     var s= getNormalFiles(servicePath)
        .map((file)=>{
            return require(file).default;
            Middleware = Middleware['default'] || Middleware;
            if (!Middleware) return;
            return Middleware;
        }).filter(Boolean);
        console.log(s);
        return compose_es7(s);
}

export default ({path})=>{
    middlewares = getMiddlewares(path);
    return function(app){
        app.use(function *(next){
            try{
                console.log(middlewares, "0000");
                yield middlewares.call(this, next);
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