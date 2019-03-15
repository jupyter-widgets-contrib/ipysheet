import * as sheet from './sheet';
import * as renderer from './renderer';
import * as base from '@jupyter-widgets/base';
import {version} from './version';

const ipysheetPlugin = {
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
};

const rendererPlugin = {
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
};

export default [ipysheetPlugin, rendererPlugin];
