const execSync = require('child_process').execSync;

module.exports = {
	mkdirp: function(dir){
		execSync(`mkdir -p ${dir}`);
	}
}