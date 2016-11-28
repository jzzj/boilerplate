const execSync = require('child_process').execSync;
const crypto = require('crypto');
const config = require('config');
const fs = require('fs');

var versionCache = {};
module.exports = {
	getVersion: function(file, mode){
		mode = mode || config.versionMode;
		console.log(file, "getVersion");
		if(versionCache[file]!=null){
			return versionCache[file];
		}
		var versionMethod = {
			"git": function(){
				var version = execSync(`git log -1 --format="%h" -- ${file}`, {encoding:"utf8"});
				return version.replace(/\s/g, "");
			},
			"md5": function(){
				var content = fs.readFileSync(file, "utf8");
				var md5sum = crypto.createHash('md5');
				md5sum.update(String(content));
				return md5sum.digest("hex").slice(0, 8);
			}
		};
		var ret = versionMethod[mode]();
		versionCache[file] = ret;
		return ret;
	}
}