import path from 'path';
import webpack from 'webpack';

module.exports = {
	entry: [
		'./src/main.js',
	],
	output: {
		path: path.join(__dirname, 'dist'),
		publicPath: 'dist/',
		filename: '[name].js',
		chunkFilename: '[id].js',
	},
  // devtool: '#cheap-module-eval-source-map',
	module: {
		loaders: [
			{
				test: /\.scss$/,
				loaders: ['style', 'css', 'sass'],
			},
			{
				test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
				loader: 'file-loader',
			},
 			{
				test: /\.(jpg|png)$/,
				loader: 'url?limit=1024',
		  },
 			{
				test: /\.jsx?$/,
				exclude: ['/node_modules/'],
				loader: 'babel',
				include: __dirname,
			},
		],
	},
};
