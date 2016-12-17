var path = require('path');

module.exports = {
  entry: ['babel-polyfill', path.resolve(__dirname, '../src/index.jsx')],

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
      query: { presets: ['es2015', 'react', 'stage-2'] }
    },
    { test: /\.json$/, loader: 'json' }
    ]
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};
