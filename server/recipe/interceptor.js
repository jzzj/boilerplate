import compose from 'koa-compose';
import { getNormalFiles, watch } from '@lib/util';

let interceptors;
function getInterceptor(path){
    return getNormalFiles(path)
        .map(file=>{
            let Interceptor = require(file);
            Interceptor = Interceptor['default'] || Interceptor;
            if (!Interceptor) return;
            return Interceptor;
        }).filter(Boolean);
}

export default ({path})=>{
    interceptors = getInterceptor(path);
    return function(app){
        app.use(function *(next){
            const result = interceptors.every(interceptor=>{
                let reg = interceptor.test;
                const ret = typeof reg === 'function' ? reg(this.path) : reg.test(this.path);
                return ret ? interceptor.handler.call(this, this) !== false : true;
            });
            
            if(result){
                yield next;
            }
        });

        watch({
            path: path,
            test: /.js/,
            callback(file){
                delete require.cache[file];
                console.log('reload interceptors', path);
                interceptors = getInterceptor(path);
            }
        });
    }
};