module.exports = {
	entry: './app/src/index.js',
	output: { path:'./app/dist', filename:'index.js' },
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel'
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