import fs from 'fs';
import {extname} from 'path';

export default class Response{
	constructor(context){
		this.context = context;
	}

	sendJSON(data){
		this.context.type = "application/json";
		this.context.body = JSON.stringify(data);
	}

	sendFile(filepath){
		const ctx = this.context;
		try{
            var stats = fs.statSync(filepath);
        }catch(e){
            console.error(e.stack);
            ctx.body = e.stack;
            return ctx.status = 500;
        }
        if(!stats){
            return ctx.status = 500;
        }
        if (!stats.isFile()) {
            return ctx.status = 403;
        }
        // always use status 200, you should not sever your static resource in here, use cdn instead, this only for template file.
        ctx.response.status = 200;
        ctx.response.lastModified = stats.mtime;
        ctx.response.length = stats.size;
        ctx.response.type = extname(filepath);
        ctx.body = fs.createReadStream(filepath);
	}

	render(){
		
	}
}