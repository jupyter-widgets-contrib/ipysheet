// Karma configuration
// Generated on Wed Jun 20 2018 16:46:14 GMT+0200 (CEST)
var webpackConfig = require('./webpack.config.js');
var webpack = require('webpack');
var path = require('path');
const process = require('process');
process.env.CHROME_BIN = require('puppeteer').executablePath();


module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['mocha', 'chai', 'sinon'],
        files: [
            // we use 1 bundle for testing
            { pattern: 'lib/src/test/index.js' },
        ],
        exclude: ['**/embed.js'],
        preprocessors: {
            // the bundle goes through webpack, and will emit (inline) source maps, which karma needs to read again
            'lib/src/test/index.js': ['webpack', 'sourcemap'],
        },
        webpack: {
            module: {
                rules: webpackConfig[2].module.rules
            },
            // source mapping without inline does not seem to work
            devtool: 'inline-source-map',
            mode: 'development',
            resolve: {
                extensions: ['.js'],
                alias: {'handsontable$': path.resolve(__dirname, './lib/src/handsontable.js')}
            },
        },
        reporters: ['progress', 'mocha'],
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
        singleRun: true,
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
}
