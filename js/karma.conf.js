// Karma configuration
// Generated on Fri Apr 14 2017 18:21:49 GMT+0200 (CEST)
// var webpackConfig = require('./webpack.config')[1];
var webpack = require('webpack');
const process = require('process');
process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['mocha', 'chai'],
        files: [
            { pattern: 'src/*.js' }
        ],
        exclude: ['**/embed.js'],
        preprocessors: {
            'src/**/*.js': ['babel'],
            'test/**/*.js': ['babel']
        },
        webpack: {
            module: {
                rules: [
                    { test: /\.json$/, user: 'json-loader' },
                    { test: /\.css$/, use: ['style-loader', 'css-loader'] },
                    { test: /\.js$/, use: ['babel-loader'], exclude: /node_modules/ }
                ]
            },
            resolve: {
                extensions: ['.js', ''],
                alias: { 'handsontable$': '../src/handsontable_fix.js' }
            },
            devtool: 'inline-source-map'
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
    });
};
