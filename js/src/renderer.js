import * as widgets  from '@jupyter-widgets/base';
import Handsontable from 'handsontable';
import {extend} from 'lodash';
var version = require('../package.json').version
var semver_range = '~' + version;


var RendererModel = widgets.WidgetModel.extend({
    defaults: function() {
        return extend(RendererModel.__super__.defaults.call(this), {
            _model_name : 'RendererModel',
            _model_module : 'ipysheet',
            _model_module_version : semver_range,
            code: ''
        });
    },
    initialize: function() {
        RendererModel.__super__.initialize.apply(this, arguments);
        // we add Handsontable manually as extra argument to put it in the scope
        this.fn = new Function('Handsontable', 'return (' + this.get('code') + ')')
        Handsontable.renderers.registerRenderer(this.get('name'), this.fn(Handsontable))
        window.last_renderer = this;
    }
});


export {
    RendererModel, version
};
