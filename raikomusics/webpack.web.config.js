// webpack.web.config.js
const { merge } = require('webpack-merge');
const rendererConfig = require('./webpack.renderer.config.js'); // Import your existing renderer config
const path = require('path');

// Merge the renderer config with web-specific settings
module.exports = merge(rendererConfig, {
  // Target the web environment
  target: 'web', 
  
  output: {
    path: path.resolve(__dirname, 'dist_web'), // Output to a different folder
    filename: 'bundle.js',
    // IMPORTANT: Use an absolute path for the web. This is the key difference!
    publicPath: '/' 
  }
});