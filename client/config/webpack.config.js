var path = require('path');

module.exports = {
  entry: ['babel-polyfill', path.resolve(__dirname, '../src/index.jsx')],

  node: {
    fs: "empty"
  },

  devtool: 'source-map',

  output: {
    path: path.resolve(__dirname, '../assets'),
    filename: 'bundle.js'
  },

  module: {
    loaders: [
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: { presets: ['es2015', 'react', 'stage-2'], babelrc: false }
    },
    { test: /\.json$/, loader: 'json' }
    ]
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};
