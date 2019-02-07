const path = require('path');

module.exports = {
  entry: './client/index.jsx',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'server/static'),
    filename: 'bundle.js'
  },
  module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
              "style-loader", // creates style nodes from JS strings
              "css-loader", // translates CSS into CommonJS
              "sass-loader" // compiles Sass to CSS, using Node Sass by default
          ]
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        }
      ]
  }
};