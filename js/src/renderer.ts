import * as widgets  from '@jupyter-widgets/base';
import * as Handsontable from 'handsontable';
import {extend} from 'lodash';
import {semver_range} from './version';
import {safeEval} from './worker_eval';

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
        // We add Handsontable manually as extra argument to put it in the scope
        var that = this;
        this.fn = function (instance, td, row, col, prop, value, cellProperties) {
          Handsontable.renderers.TextRenderer.apply(this, arguments);
          safeEval(`(${that.get('code')})(${value})`).then(function(style) {
            (Object as any).assign(td.style, style);
          });
        };
        (Handsontable.renderers as any).registerRenderer(this.get('name'), this.fn);
    }
});

export {
    RendererModel 
};
