var path = require('path');
var webpack = require("webpack");
var ManifestPlugin = require('webpack-manifest-plugin');

module.exports = {
  entry: path.resolve(__dirname, '../src/index.jsx'),

  mode: 'production',

  node: {
    fs: "empty"
  },

  output: {
    path: path.resolve(__dirname, '../../public/assets'),
    publicPath: process.env.NODE_ENV == 'staging' ? 'https://d1lna4hvnypvq3.cloudfront.net/' : 'https://cdn.citylines.co/assets/',
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
    new ManifestPlugin({
      fileName: 'webpack.manifest.json'
    })
  ]
};
