var path = require('path');
var webpack = require("webpack");
var { WebpackManifestPlugin } = require('webpack-manifest-plugin');

module.exports = {
  entry: path.resolve(__dirname, '../src/index.jsx'),

  mode: 'production',

  output: {
    path: path.resolve(__dirname, '../../public/assets'),
    publicPath: '',
    filename: '[name].[contenthash].js',
    chunkFilename: 'chunk.[name].[contenthash].js'
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
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production')
      }
    }),
    new WebpackManifestPlugin({
      fileName: 'webpack.manifest.json'
    }),
    new webpack.ProvidePlugin({
       process: 'process/browser'
    })
  ]
};
