var ipysheet = require('ipysheet');
var jupyterlab_widgets = require('@jupyter-widgets/jupyterlab-manager');

module.exports = {
  id: 'jupyter.extensions.jupyter-sheet',
  requires: [jupyterlab_widgets.INBWidgetExtension],
  activate: function(app, widgets) {
      widgets.registerWidget({
          name: 'ipysheet',
          version: ipysheet.version,
          exports: ipysheet
      });
  },
  autoStart: true
};
