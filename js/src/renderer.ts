import * as widgets  from '@jupyter-widgets/base';
import {extend} from 'lodash';
import {version, semver_range} from './version';
// @ts-ignore
import * as Handsontable from 'handsontable';


let RendererModel = widgets.WidgetModel.extend({
    defaults: function() {
        return extend(RendererModel.__super__.defaults.call(this), {
            _model_name : 'RendererModel',
            _model_module : 'ipysheet',
            _model_module_version : semver_range,
            name: '',
            code: ''
        });
    },
    initialize: function() {
        RendererModel.__super__.initialize.apply(this, arguments);
        // we add Handsontable manually as extra argument to put it in the scope
        this.fn = new Function('Handsontable', 'return (' + this.get('code') + ')');
        (Handsontable.renderers as any).registerRenderer(this.get('name'), this.fn(Handsontable));
    }
});

export {
    RendererModel, version
};
