var version = require('./package.json').version;
var path = require('path');


// Custom webpack rules are generally the same for all webpack bundles, hence
// stored in a separate local variable.
var rules = [
    { test: /\.css$/, use: ['style-loader', 'css-loader']},
    {
        test: /\.(js|ts)$/,
        use: ['source-map-loader'],
        enforce: 'pre'
    }
];

var resolve = {
    extensions: ['.js']
};

module.exports = [
    {
        // Notebook extension
        //
        // This bundle only contains the part of the JavaScript that is run on
        // load of the notebook. This section generally only performs
        // some configuration for requirejs, and provides the legacy
        // "load_ipython_extension" function which is required for any notebook
        // extension.
        //
        entry: './lib/src/extension.js',
        devtool: 'inline-source-map',
        resolve: resolve,
        module: {
            rules: rules
        },
        output: {
            filename: 'extension.js',
            path: path.resolve(__dirname, '../ipysheet/static'),
            libraryTarget: 'amd'
        }
    },
    {
        // same for renderer
        entry: './lib/src/extension-renderer.js',
        devtool: 'inline-source-map',
        resolve: resolve,
        output: {
            filename: 'extension-renderer.js',
            path: path.resolve(__dirname, '../ipysheet/static'),
            libraryTarget: 'amd'
        }
    },
    {
        // Bundle for the notebook containing the custom widget views and models
        //
        // This bundle contains the implementation for the custom widget views and
        // custom widget.
        // It must be an amd module
        //
        entry: './lib/src/index.js',
        devtool: 'inline-source-map',
        resolve: resolve,
        output: {
            filename: 'index.js',
            path: path.resolve(__dirname, '../ipysheet/static'),
            libraryTarget: 'amd'
        },
        module: {
            rules: rules
        },
        externals: ['@jupyter-widgets/base', 'handsontable']
    },
    {
        // same for render
        entry: './lib/src/renderer.js',
        devtool: 'inline-source-map',
        resolve: resolve,
        output: {
            filename: 'renderer.js',
            path: path.resolve(__dirname, '../ipysheet/static'),
            libraryTarget: 'amd'
        },
        module: {
            rules: rules
        },
        externals: ['@jupyter-widgets/base', 'handsontable']
    },
    {
        // Embeddable ipysheet bundle
        //
        // This bundle is generally almost identical to the notebook bundle
        // containing the custom widget views and models.
        //
        // The only difference is in the configuration of the webpack public path
        // for the static assets.
        //
        // It will be automatically distributed by unpkg to work with the static
        // widget embedder.
        //
        // The target bundle is always `dist/index.js`, which is the path required
        // by the custom widget embedder.
        //
        entry: './lib/src/embed.js',
        devtool: 'inline-source-map',
        resolve: resolve,
        output: {
            filename: 'index.js',
            path: path.resolve(__dirname, './dist'),
            libraryTarget: 'amd',
            publicPath: 'https://unpkg.com/ipysheet@' + version + '/dist/'
        },
        module: {
            rules: rules
        },
        externals: ['@jupyter-widgets/base', 'handsontable']
    },
    {
        // same for renderer
        entry: './lib/src/renderer.js',
        devtool: 'inline-source-map',
        resolve: resolve,
        output: {
            filename: 'renderer.js',
            path: path.resolve(__dirname, './dist'),
            libraryTarget: 'amd',
            publicPath: 'https://unpkg.com/ipysheet@' + version + '/dist/renderer'
        },
        module: {
            rules: rules
        },
        externals: ['@jupyter-widgets/base', 'handsontable']
    },
    {
        entry: './lib/src/handsontable.js',
        output: {
            filename: 'handsontable.js',
            path: path.resolve(__dirname, '../ipysheet/static'),
            libraryTarget: 'amd'
        },
        module: {
            rules: rules
        },
    }
];
