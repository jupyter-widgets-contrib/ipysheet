import * as base from '@jupyter-widgets/base';
import {version} from './version';
import * as sheet from './sheet';

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

export default ipysheetPlugin;
