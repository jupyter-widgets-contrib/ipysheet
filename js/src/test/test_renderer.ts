import * as widgets from '@jupyter-widgets/base';
import * as _ from 'underscore';
import * as ipysheet from '../sheet';
import * as ipysheet_renderer from '../renderer';
import {DummyManager} from './dummy-manager';
import { expect } from 'chai';
import { extend } from 'lodash';
// @ts-ignore
import {Handsontable} from 'handsontable';

ipysheet.setTesting()

describe('renderer', function() {
    beforeEach(async function() {
        this.manager = new DummyManager({ipysheet: extend(ipysheet, ipysheet_renderer)});
        const modelId = 'u-u-i-d';
        this.sheet = await this.manager.new_widget({
            model_module: 'ipysheet',
            model_name: 'SheetModel',
            model_module_version : '*',
            view_module: 'jupyter-widgets',
            view_name: 'DOMWidgetView',
            view_module_version: '*',
            model_id: modelId,
        }, { rows: 2, columns: 4} );
        this.sheet.state_change = Promise.resolve(); // bug in ipywidgets?
        this.sheet.views = {}

        this.renderer = await this.manager.new_widget({
            model_module: 'ipysheet',
            model_name: 'RendererModel',
            model_module_version : '*',
            view_module: 'jupyter-widgets',
            view_name: 'WidgetView',
            view_module_version: '*',
            model_id: modelId,
        }, { code: `function (instance, td, row, col, prop, value, cellProperties) {
                Handsontable.renderers.TextRenderer.apply(this, arguments);
                if (value < 0)
                    td.style.backgroundColor = 'red'
                else
                    td.style.backgroundColor = 'green'
            }`, name: 'test_renderer' });
    });

    it('register', function() {
        expect(this.renderer.fn).to.not.equal(undefined);
        expect(Handsontable.renderers.getRenderer('test_renderer')).to.not.equal(undefined);
    });
});
