import fs from 'fs';
import glob from 'glob';
import config from 'config';

const staticPath = config.path["static"];
let routes = [];
if(fs.existsSync(staticPath)){
    const templatePath = config.path.template.replace(config.path.client, staticPath);
    glob
        .sync(templatePath + "/**/*.html")
        .forEach(function (f) {
            const url = f.replace(templatePath, "");
            routes.push(routeShape(url, f));
            if(/index\.html$/.test(f)){
                routes.push(routeShape(url.replace("index.html", ""), f));
            }
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
}
export default routes;