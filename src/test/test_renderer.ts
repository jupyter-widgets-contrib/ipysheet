import * as widgets from '@jupyter-widgets/base';
import * as _ from 'underscore';
import * as ipysheet from '../sheet';
import * as ipysheet_renderer from '../renderer';
import {DummyManager} from './dummy-manager';
import { expect } from 'chai';
import { extend } from 'lodash';
import { make_view, wait_validate, make_cell } from './utils'

// @ts-ignore
import * as Handsontable from 'handsontable';


describe('custom', function() {
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
        expect(this.renderer.rendering_function).to.not.equal(undefined);
        expect((Handsontable.renderers as any).getRenderer('test_renderer')).to.not.equal(undefined);
    });
});

describe('widget_renderer', function() {
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

        const modelId1 = 'u-u-i-d1';
        this.first = await this.manager.new_widget({
            model_module: 'test-widgets',
            model_name: 'TestWidget',
            model_module_version: '1.0.0',
            view_module: 'test-widgets',
            view_name: 'TestWidgetView',
            view_module_version: '1.0.0',
            model_id: modelId1,
        }, {value: 2, _view_count: 0});

        const modelId2 = 'u-u-i-d2';
        this.second = await this.manager.new_widget({
            model_module: 'test-widgets',
            model_name: 'TestWidget',
            model_module_version: '1.0.0',
            view_module: 'test-widgets',
            view_name: 'TestWidgetView',
            view_module_version: '1.0.0',
            model_id: modelId2,
        }, {value: 5, _view_count: 0});

        this.renderer = (Handsontable.renderers as any).getRenderer('widget');
    });

    it('renderer_registered', function() {
        expect((Handsontable.renderers as any).getRenderer('widget')).to.not.equal(undefined);
    });

    it('widgets views should only be created once', async function() {
        var view = await make_view.call(this)
        var cell1 = await make_cell.apply(this, [{row_start: 1, row_end:1, value: 0}])
        cell1.set({value: this.first, type: 'widget'})

        await view._last_data_set;
        let view_widget_first = view.widget_views[[1, 2].join()];
        expect(view.widget_views[[1, 2].join()].model.cid).to.equal(this.first.cid)

        // we manually call building the widget views
        await view._build_widgets_views()
        expect(view.widget_views[[1, 2].join()].cid).to.equal(view_widget_first.cid)
    })

    it('widgets views should not be removed when updated', async function() {
        var view = await make_view.call(this)
        var cell1 = await make_cell.apply(this, [{row_start: 1, row_end:1, value: 0}])
        cell1.set({value: this.first, type: 'widget'})

        await view._last_data_set;
        let view_widget_first = view.widget_views[[1, 2].join()];
        expect(view.widget_views[[1, 2].join()].model.cid).to.equal(this.first.cid)

        // we manually call building the widget views
        let wid = view.widget_views[[1, 2].join()];
        await view._build_widgets_views()
        this.first.set('value', 36)
        expect(this.first.get('_view_count')).to.equal(1)
    })

    it('widgets should disappear', async function() {
        var view = await make_view.call(this)
        var cell1 = await make_cell.apply(this, [{row_start: 1, row_end:1, value: 0}])
        expect(this.first.get('_view_count')).to.equal(0)

        cell1.set({value: this.first, type: 'widget'})
        await view._last_data_set;
        let view_widget_first = view.widget_views[[1, 2].join()];
        expect(view.widget_views[[1, 2].join()].model.cid).to.equal(this.first.cid)
        expect(this.first.get('_view_count')).to.equal(1)

        cell1.set({value: '1', type: 'text'})
        await view._last_data_set;
        expect(view.widget_views[[1, 2].join()]).to.be.undefined
        expect(this.first.get('_view_count')).to.equal(0)
    })

    it('widgets can change', async function() {
        var view = await make_view.call(this)
        var cell1 = await make_cell.apply(this, [{row_start: 1, row_end:1, value: 0}])
        cell1.set({value: this.first, type: 'widget'})

        await view._last_data_set;
        let view_widget_first = view.widget_views[[1, 2].join()];
        expect(view.widget_views[[1, 2].join()].model.cid).to.equal(this.first.cid)
        expect(this.first.get('_view_count')).to.equal(1)

        cell1.set({value: this.second, type: 'widget'})
        await view._last_data_set;
        expect(view.widget_views[[1, 2].join()].model.cid).to.equal(this.second.cid)
        expect(this.first.get('_view_count')).to.equal(0)
        expect(this.second.get('_view_count')).to.equal(1)
    })
});
