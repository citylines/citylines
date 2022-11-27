var path = require('path');
var { WebpackManifestPlugin } = require('webpack-manifest-plugin');
var webpack = require('webpack')

module.exports = {
  entry: path.resolve(__dirname, '../src/index.jsx'),

  mode: 'development',

  devtool: 'source-map',

  output: {
    path: path.resolve(__dirname, '../../public/assets'),
    filename: '[name].js',
    chunkFilename: 'chunk.[name].js'
  },

  module: {
    rules: [
    {
      loader: 'babel-loader',
      test: /\.jsx?$/,
      exclude: /node_modules/,
      options: { presets: [['@babel/preset-env', {useBuiltIns: 'usage', corejs:3}], '@babel/preset-react'], babelrc: false }
    }
    ]
  },

  plugins: [
    new WebpackManifestPlugin({
      fileName: 'webpack.manifest.json'
    }),
    new webpack.ProvidePlugin({
       process: 'process/browser'
    })
  ]
};
