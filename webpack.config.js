const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'index_bundle.js',
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin(
      {
        template: './src/index.ejs',
        filename: "./index.html",
      }
    )
  ],
  mode: "development",
}
