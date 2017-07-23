// This file contains the javascript that is run when the notebook is loaded.
// It contains some requirejs configuration and the `load_ipython_extension`
// which is required for any notebook extension.

// Configure requirejs
if (window.require) {
    window.require.config({
        map: {
            "*" : {
                "ipysheet": "nbextensions/ipysheet/index",
                "handsontable": "nbextensions/ipysheet/handsontable",
                "handsontable/dist/handsontable.full.js":  "nbextensions/ipysheet/handsontable",
                "jupyter-js-widgets": "nbextensions/jupyter-js-widgets/extension"
            }
        }
    });
}

// Export the required load_ipython_extention
module.exports = {
    load_ipython_extension: function() {}
};
