import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import * as base from '@jupyter-widgets/base';
import {version} from './version';
import * as sheet from './sheet';

/**
 * Initialization data for the ipysheet extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'ipysheet:plugin',
  autoStart: true,
  requires: [base.IJupyterWidgetRegistry],
  activate: (app: JupyterFrontEnd, widgets: base.IJupyterWidgetRegistry) => {
    widgets.registerWidget({
      name: 'ipysheet',
      version: version,
      exports: sheet
  });
  }
};

export default extension;
