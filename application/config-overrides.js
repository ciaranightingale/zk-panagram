const webpack = require('webpack');

module.exports = function override(config) {
  // Add fallback for process/browser and specify the extension for Webpack to resolve
  config.resolve = {
    ...config.resolve,
    fallback: {
      ...config.resolve.fallback,
      process: require.resolve('process/browser.js'), // Add .js extension here
      stream: require.resolve('stream-browserify'),  // Add polyfill for stream
      vm: require.resolve('vm-browserify'),
    },
  };

  // Provide process globally
  config.plugins = [
    ...(config.plugins || []),
    new webpack.ProvidePlugin({
      process: 'process/browser', // Global process polyfill
    }),
  ];

  return config;
};
