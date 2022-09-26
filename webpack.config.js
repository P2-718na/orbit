const { resolve: pathResolve } = require("path");
const { readdirSync } = require("fs-extra")

const HtmlWebpackPlugin = require('html-webpack-plugin')

const pages = readdirSync("./pages");

// Code to add multiple pages taken from:
// https://dev.to/marcinwosinek/tutorial-for-building-multipage-website-with-webpack-4gdk

// Todo tutti questi path andrebbero cambiati in modo da avere path assoluto e da usare pathResolve.
const entry = pages
  .reduce((acc, pageName) => {
    acc[pageName] = `./pages/${pageName}/${pageName}.js`; // Js location. Need one js file per page.

    return acc;
  }, {})

const htmlPagePlugins = pages
  .map((pageName) =>
    new HtmlWebpackPlugin({
      inject: true,
      template: `./pages/${pageName}/${pageName}.ejs`, // Input ejs template file location
      filename: `./html/${pageName}.html`, // Output html file name
      chunks: [pageName],
    })
  )

module.exports = {
  entry,

  // Add other plugins in the array here.
  plugins: [].concat(htmlPagePlugins),

  output: {
    path: pathResolve(__dirname, 'dist'),
    filename: './js/[name].js',
    clean: true,
  },

  // Following tutorial from: https://dev.to/marcinwosinek/tutorial-for-building-multipage-website-with-webpack-4gdk
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },

  mode: "development",
}
