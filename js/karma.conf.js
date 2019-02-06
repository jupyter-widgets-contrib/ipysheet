// Karma configuration
// Generated on Fri Apr 14 2017 18:21:49 GMT+0200 (CEST)
//var webpackConfig = require('./webpack.config')[1];
var webpack = require('webpack');
const process = require('process');
process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'karma-typescript'],
    files: [
        {pattern: 'test/*.ts'},
        {pattern: 'src/*.js', included: false, served: false},
    ],
    exclude: ['**/embed.js'],
    preprocessors: {
        'test/**/*.ts': [ 'karma-typescript']
    },
    karmaTypescriptConfig: {
      bundlerOptions: {
        transforms: [
            require("karma-typescript-es6-transform")()
        ]
      },
      compilerOptions: {
          target: "es5",
          sourceMap: true
      },
      coverageOptions: {
          exclude: [/\.(d|test)\.ts$/i, /.*node_modules.*/]
      },
      tsconfig: "./test/tsconfig.json"
    },
    webpack: {
          module: {
              rules: [
                  { test: /\.json$/, user: 'json-loader' },
                  { test: /\.css$/, use: ['style-loader', 'css-loader']},
                  { test: /\.tsx?$/, exclude: /node_modules/, use: 'ts-loader'}
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
    browsers: ['HeadlessChrome'],
    customLaunchers: {
      HeadlessChrome: {
          base: 'ChromeHeadless',
          flags: ['--no-sandbox']
      }
    },
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
