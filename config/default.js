var path = require('path');

module.exports = {
	path: {
		client: path.join(__dirname, "/../client"),
		"static": path.join(__dirname, "/../static"),
		page: path.join(__dirname, "/../client/page"),
		template: path.join(__dirname, "/../client/template"),
		publicPath: "/static/page"
	},
	alias: {
		"@client": path.join(__dirname, "/../client"),
		"@lib": path.join(__dirname, "/../lib")
	},
	//options: git, md5. recommand git, faster. Git will use your git commit hash. Md5 will calculate your file's md5 value.
	versionMode: "git", 
	complier: {
		css: "scss"
	}
}