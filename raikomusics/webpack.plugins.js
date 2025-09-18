const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
  new HtmlWebpackPlugin({
    // This is the source HTML file that will be used as a template
    template: './src/index.html',
  }),
];