/*
*   This should not used for production!
*   Highly recommend you use cdn instead of it, 
*   even use a nginx server is better than this one!
*/
import fs from 'fs';
import glob from 'glob';
import config from 'config';

const staticPath = config.path["static"];
const staticServerPath = config.path.staticServerPath;
let routes = [];
glob
    .sync(staticPath + "/**/*")
    .forEach(function (f) {
        const url = staticServerPath+f.replace(staticPath, "");
        routes.push(routeShape(url, f));
        function routeShape(url, f){
            return {
                url,
                method: "get",
                handler: async function(response){
                    response.sendFile(f);
                }
            };
        }
    });
export default routes;