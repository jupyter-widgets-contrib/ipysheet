// Karma configuration
// Generated on Fri Apr 14 2017 18:21:49 GMT+0200 (CEST)
//var webpackConfig = require('./webpack.config')[1];
var webpack = require('webpack');

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'karma-typescript'],
    files: [
        'test/sheet.ts',
    ],
    exclude: ['**/embed.js'],
    preprocessors: {
        'test/**/*.ts': [ 'webpack', 'sourcemap']
    },
    webpack: {
          module: {
              loaders: [
                  { test: /\.json$/, loader: 'json-loader' },
                  { test: /\.tsx?$/, exclude: /node_modules/, loader: 'ts-loader'}
                ]
          },
          resolve: {
              extensions: ['.ts', '.js', ''],
              alias: {'handsontable$': '../src/handsontable_fix.js'}
          },
          devtool: 'inline-source-map',
    },
    mime: {
        "text/x-typescript": ["ts", "tsx"],
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    autoWatch: true,
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
