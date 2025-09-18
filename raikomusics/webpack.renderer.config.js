// The corrected webpack.renderer.config.js
const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'postcss-loader' }],
});

module.exports = {
  // THIS IS THE MISSING PIECE:
  // Tell Webpack to start bundling from your renderer's JavaScript file.
  entry: './src/renderer.js',

  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
};