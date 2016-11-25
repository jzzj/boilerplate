var path = require('path');

module.exports = {
	path: {
		"static": path.join(__dirname, "/../static"),
		template: path.join(__dirname, "/../client/page"),
		publicPath: "/static/page"
	},
	alias: {
		"@client": path.join(__dirname, "/../client")
	}
}