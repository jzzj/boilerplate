const execSync = require('child_process').execSync;
const glob = require("glob");
const config = require('config');

let watched = [];
module.exports = {
	mkdirp(dir){
		execSync(`mkdir -p ${dir}`);
	},

	getNormalFiles(dir){
		return glob.sync(`${dir}/**/*`)
			.filter(file=>(!/\/\./.test(file) && !/\/_/.test(file)));
	},

	watch(opts){
		if(config.isOnline)return;
		let {path, callback, ignored="node_modules/*", test=[]} = opts;
		test = Array.isArray(test) ? test : [test];
		if(watched.indexOf(path)!==-1)return;
		watched.push(path);
		const chokidar = require('chokidar');
		chokidar.watch(path, {
			ignored: ignored,
			ignoreInitial: true
		})
		.on('change', change)
		.on('add', change)
		.on('unlink', change);
		function change(file){
			try{
				if(!test.every(item=>typeof item==='function' ? item(file) : item.test(file)))return;
				console.log(file, "has been changed.");
				callback(file);
			}catch(e){
				console.error('watch error:', e.stack);
			}
	    }
	}
}