var example = require('./example');
var version = require('../package.json').version;

module.exports = [
  {
    id: 'jupyter-widget-pricer-hybrid',
    requires: [base.IJupyterWidgetRegistry],
    activate: function(app, widgets) {
        widgets.registerWidget({
            name: 'jupyter-widget-pricer-hybrid',
            version: version,
            exports: example
        });
    },
    autoStart: true
  }
];
