var path = require('path');
var ManifestPlugin = require('webpack-manifest-plugin');

module.exports = {
  entry: path.resolve(__dirname, '../src/index.jsx'),

  mode: 'development',

  node: {
    fs: "empty"
  },

  devtool: 'source-map',

  output: {
    path: path.resolve(__dirname, '../../public/assets'),
    publicPath: '/assets/',
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
    },
    { test: /\.json$/, loader: 'json' }
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx']
  },

  plugins: [
    new ManifestPlugin({
      fileName: 'webpack.manifest.json'
    })
  ]
};
