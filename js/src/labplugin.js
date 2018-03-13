var sheet = require('./sheet');
var renderer = require('./renderer');
var base = require('@jupyter-widgets/base');
var version = require('../package.json').version;

module.exports = [
  {
    id: 'ipysheet',
    requires: [base.IJupyterWidgetRegistry],
    activate: function(app, widgets) {
        widgets.registerWidget({
            name: 'ipysheet',
            version: version,
            exports: sheet
        });
    },
    autoStart: true
  },
  {
    id: 'ipysheet:renderer',
    requires: [base.IJupyterWidgetRegistry],
    activate: function(app, widgets) {
        widgets.registerWidget({
            name: 'ipysheet/renderer',
            version: version,
            exports: renderer
        });
    },
    autoStart: true
  }
];
