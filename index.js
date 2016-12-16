var config = require('config');
var resolveAliasPlugin = (function requireAlias(aliases) {
	function replaceWithAlias(filepath) {
		Object.keys(aliases).forEach(function (key) {
		  if (filepath === key || filepath.indexOf(key + '/') === 0) filepath = filepath.replace(key, aliases[key]);
		});
		return filepath;
	}
	return {
		visitor: {
		    CallExpression(path) {
		        var node = path.node;

		    	// handle require('@alias/...')
				if (node.callee.name === "require" && node.arguments.length === 1) {
					var filepath = node.arguments[0].value;
					if (!filepath) return;
					node.arguments[0].value = replaceWithAlias(filepath);
					return;
				}
				
				var callee = node.callee;
				if (!callee.object) return;
				if (!callee.property) return;
				if (node.arguments.length !== 1) return;
				if (!node.arguments[0].value) return;

	        	// handle require.resolve
				if ( callee.object.name == 'require' && callee.property.name == 'resolve') {
					node.arguments[0].value = replaceWithAlias(node.arguments[0].value);
				}
		    }
		}
	};
})(config.alias);

require('babel-register')({
	// only use for this demo
    ignore: function(filename) {
        return filename.indexOf("tesseract.js")===-1 && filename.indexOf("node_modules")!==-1;
    },
    plugins: [
	    resolveAliasPlugin
	]
});
// es7: async await etc.
require("babel-polyfill");

function start(){
    // entry
    require('./server');
};

start();
