var path = require('path');

module.exports = {
	port: 3000,
	// all path args must be indicated.
	path: {
		client: path.join(__dirname, "/../client"),
		"static": path.join(__dirname, "/../static"),
		page: path.join(__dirname, "/../client/page"),
		template: path.join(__dirname, "/../client/template"),
		publicPath: "/static/page",
		staticServerPath: "/static",


		//path that above used for client, below is for server
		controller: path.join(__dirname, "/../server/controller"),
		servicePath: path.join(__dirname, "/../server/service"),
		interceptorPath: path.join(__dirname, "/../server/interceptor"),
		middlewarePath: path.join(__dirname, "/../server/middleware")
	},
	alias: {
		"@client": path.join(__dirname, "/../client"),
		"@lib": path.join(__dirname, "/../lib"),
		"@root": path.join(__dirname, "/..")
	},
	// options: git, md5. recommand git, faster. Git will use your git commit hash. Md5 will calculate your file's md5 value.
	versionMode: "git"
}