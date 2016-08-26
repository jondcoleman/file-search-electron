module.exports = {
	entry: './src/index.js',
	output: { path:'./build', filename:'index.js' },
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel'
			},
			{
				test: /\.json$/,
				loader: 'json'
			}
		]
	},
	devtool: 'source-map',
	devServer: {
		port: process.env.PORT || 8080,
		contentBase: './src'
	},
	target: 'electron-renderer'
}