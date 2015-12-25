/* global __dirname */

module.exports = {
	entry: __dirname + "/src/game.ts",
	output: {
		path: __dirname + "/dist",
		filename: "game.js"
	},
	resolve: {
		extensions: [ "", ".ts" ],
		moduleDirectories: [ "node_modules" ]
	},
	module: {
		loaders: [
			{ test: /\.ts$/, loaders: [ "ts" ] }	
		]		
	}
};