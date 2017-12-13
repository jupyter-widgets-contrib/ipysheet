var ipysheet = require('./index');
var base = require('@jupyter-widgets/base');

module.exports = {
  id: 'jupyter-sheet',
  requires: [base.IJupyterWidgetRegistry],
  activate: function(app, widgets) {
      widgets.registerWidget({
          name: 'ipysheet',
          version: ipysheet.version,
          exports: ipysheet
      });
  },
  autoStart: true
};
