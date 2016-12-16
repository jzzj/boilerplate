import compose from 'koa-compose';
import { getNormalFiles, watch } from '@lib/util';

let services;
function getServices(servicePath){
    return getNormalFiles(servicePath)
        .reduce((ret, file)=>{
            let Service = require(file);
            Service = Service['default'] || Service;
            if (!Service) return;
            const filename = file.replace(/\.[^\/.]*$/, "").replace(/^.*\//, '');
            ret[filename] = Service;
            return ret;
        }, {});
}

export default ({path})=>{
    services = getServices(path);
    return function(app){
        app.use(function *(next){
            if(this.$injector){
                Object.keys(services).forEach(key=>{
                    this.$injector.service(key, services[key]);
                })
            }
            yield next;
        });

        watch({
            path: path,
            test: /.js/,
            callback(file){
                delete require.cache[file];
                console.log('reload services', path);
                services = getServices(path);
            }
        });
    }
};