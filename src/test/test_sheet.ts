import * as widgets from '@jupyter-widgets/base';
import * as _ from 'underscore';
import * as ipysheet from '../sheet';
import {DummyManager} from './dummy-manager';
import { expect } from 'chai';
import { make_view, wait_validate, make_cell } from './utils'

var data_cloner = function() {
    var data = this.sheet.data
    return JSON.parse(JSON.stringify(data))
}

describe('sheet', function() {
    beforeEach(async function() {
        this.manager = new DummyManager({ipysheet: ipysheet});
        const modelId = 'u-u-i-d';
        this.sheet = await this.manager.new_widget({
            model_module: 'ipysheet',
            model_name: 'SheetModel',
            model_module_version : '*',
            view_module: 'jupyter-widgets',
            view_name: 'DOMWidgetView',
            view_module_version: '*',
            //model_module: 'test-widgets',
            //model_name: 'TestWidget',
            model_id: modelId,
        }, { rows: 2, columns: 4} );
        this.sheet.state_change = Promise.resolve(); // bug in ipywidgets?
        this.sheet.views = {}
    });

    it('sanity', function() {
        expect(this.sheet.get('rows')).to.equal(2);
        expect(this.sheet.get('columns')).to.equal(4);
    })
    it('data init', function() {
        //console.log(this.sheet.data)
        expect(this.sheet.data).to.have.lengthOf(2);
        expect(this.sheet.data[0]).to.have.lengthOf(4);
    })
    it('data row grow', function() {
        // test grow
        this.sheet.data[1][2].value = 123
        this.sheet.set('rows', 3)
        expect(this.sheet.data).to.have.lengthOf(3);
        expect(this.sheet.data[0]).to.have.lengthOf(4);
        expect(this.sheet.data[2]).to.have.lengthOf(4);
        expect(this.sheet.data[1][2].value, 'data should be preserved when changing size').to.equal(123);

        this.sheet.set('rows', 5)
        expect(this.sheet.data).to.have.lengthOf(5);
        expect(this.sheet.data[0]).to.have.lengthOf(4);
        expect(this.sheet.data[2]).to.have.lengthOf(4);
        expect(this.sheet.data[1][2].value, 'data should be preserved when changing size').to.equal(123);
    })
    it('data column shrink', function() {
        this.sheet.data[1][2].value = 123
        this.sheet.data[1][3].value = 1234
        this.sheet.set('columns', 3)
        expect(this.sheet.data).to.have.lengthOf(2);
        expect(this.sheet.data[0]).to.have.lengthOf(3);
        expect(this.sheet.data[1]).to.have.lengthOf(3);
        expect(this.sheet.data[1][2].value, 'data should be preserved when changing size').to.equal(123);
    })
    it('data column grow', function() {
        this.sheet.set('columns', 5)
        expect(this.sheet.data).to.have.lengthOf(2);
        expect(this.sheet.data[0]).to.have.lengthOf(5);
        expect(this.sheet.data[1]).to.have.lengthOf(5);
    })
    it('model reflecting view', async function() {
        var view = await make_view.call(this)
        await view._table_constructed;
        view.set_cell(1,2, 123)
        await wait_validate(view)
        expect(this.sheet.data[1][2].value, 'cell changes should be reflected in model').to.equal(123);
    })
    it('view reflecting model', async function() {
        var view = await make_view.call(this)
        var data = this.sheet.data
        await view._table_constructed;
        data[1][2].value = 123
        this.sheet.trigger('data_change')
        await view._last_data_set;
        expect(view.get_cell(1,2), 'model change should be reflected in view').to.equal(123);
    })
    it('view reflecting different view', async function() {
        var view1 = await make_view.call(this)
        var view2 = await make_view.call(this)
        view1.set_cell(1, 2, 123)
        var bla = await wait_validate(view1)
        expect(view1.get_cell(1, 2), 'model change should be reflected in view').to.equal(123);
        expect(view1.get_cell(1, 2), 'cell changes in one view should be reflected in a related view'). to.equal(view2.get_cell(1,2));
    })
    // we don't validate at the moment
    it.skip('invalid sheet should not propagate to model', async function() {
        var view = await make_view.call(this)
        var data_clone = data_cloner.call(this)
        data_clone[1][2].value = 123
        data_clone[1][2].options = {type: 'numeric'}
        expect(data_clone[1][2].value, 'cloned data check').to.equal(123);
        this.sheet.set('data', data_clone)
        view.set_cell(1,2, 'wrong')
        await wait_validate(view)
        expect(view.get_cell(1,2), 'sheet will reflect invalid data').to.equal('wrong');
        expect(this.sheet.data[1][2].value, 'model should not have invalid data').to.not.equal('wrong');
    })

    var make_cell = async function(options, skip_add) {
        const modelId = 'u-u-i-d-cell';
        var cell = await this.manager.new_widget({
            model_module: 'ipysheet',
            model_name: 'CellRangeModel',
            view_module: 'jupyter-widgets',
            view_name: 'DOMWidgetView',
            view_module_version: '*',
            model_module_version : '0.1.0',
            model_id: modelId,
        }, {row_start: 1, column_start: 2, row_end: 1, column_end: 2, value:888, ...options} );
        var cells = this.sheet.get('cells');
        if(!skip_add)
            this.sheet.set('cells', [...cells, cell])
        return cell
    }
    var make_range = async function(options, skip_add) {
        const modelId = 'u-u-i-d-cell';
        var cell = await this.manager.new_widget({
            model_module: 'ipysheet',
            model_name: 'CellRangeModel',
            view_module: 'jupyter-widgets',
            view_name: 'DOMWidgetView',
            view_module_version: '*',
            model_module_version : '0.1.0',
            model_id: modelId,
        }, {squeeze_row: false, squeeze_column: false, ...options} );
        var cells = this.sheet.get('cells');
        if(!skip_add)
            this.sheet.set('cells', [...cells, cell])
        return cell
    }
    it('cell changes should be reflected in datamodel', async function() {
        var cell = await make_cell.apply(this, [{value: 777}])
        var data = this.sheet.data
        expect(data[1][2].value, 'for initial value').to.equal(777);
        cell.set('value', 999)
        var data = this.sheet.data
        expect(data[1][2].value, 'when cell.value is change').to.equal(999);
    })
    it('numeric cell with value zero should indeed have value zero', async function() {
        await make_cell.apply(this, [{value: 0.00, type:'numeric'}]);
        var data = this.sheet.data;
        expect(data[1][2].value, 'for initial value').to.equal(0);
    })
    it('none cell with should be set', async function() {
        var cell = await make_cell.apply(this, [{value: 0.00, type:'numeric'}]);
        var data = this.sheet.data;
        expect(data[1][2].value, 'for initial value').to.equal(0);
        cell.set('value', null);
        var data = this.sheet.data;
        expect(data[1][2].value, 'for new value').to.equal(null);
    })
    it('multiple cells added', async function() {
        var cell1 = await make_cell.apply(this, [{value: 777}, true])
        var cell2 = await make_cell.apply(this, [{row_start: 0, row_end:0, value: 555}, true])
        var cells = this.sheet.get('cells');
        this.sheet.set('cells', [...cells, cell1, cell2])
        var data = this.sheet.data
        expect(data[1][2].value, 'for initial value').to.equal(777);
        expect(data[0][2].value, 'for initial value').to.equal(555);
        cell1.set('value', 999)
        cell2.set('value', 444)
        var data = this.sheet.data
        expect(data[1][2].value, 'when cell.value is change').to.equal(999);
        expect(data[0][2].value, 'when cell.value is change').to.equal(444);
    })
    it('model changes should be reflected in cell', async function() {
        var cell = await make_cell.apply(this, [{value: [[777]]}])
        var data = data_cloner.call(this)
        data[1][2].value = 999;
        this.sheet.data = data;
        this.sheet.trigger('data_change');
        expect(cell.get('value'), 'when the data in the sheet changes').to.equal(999);
    })
    it('range should be reflected in all cells', async function() {
        var range = await make_range.apply(this, [{row_start: 0, row_end: 1, column_start: 1, column_end:2, value: [[0, 1], [2, 3]]}])
        var data = data_cloner.call(this)
        expect(data[0][1].value, 'and in the underlying data grid').to.equal(0);
        expect(data[0][2].value, 'and in the underlying data grid').to.equal(1);
        expect(data[1][1].value, 'and in the underlying data grid').to.equal(2);
        expect(data[1][2].value, 'and in the underlying data grid').to.equal(3);

        var cell = await make_cell.apply(this, [{row_start:0, row_end: 0, value: 777}])
        data = data_cloner.call(this)
        expect(data[0][2].value, 'sanity check').to.equal(777);
        expect(range.get('value')[0][1], 'and in the underlying data grid, synced back').to.equal(777);

        var cell2 = await make_cell.apply(this, [{row_start:1, row_end: 1, value: null}])
        data = data_cloner.call(this)
        expect(data[1][2].value, 'should not be using a null value for an overlapping value').to.equal(3);
        expect(range.get('value')[1][1], 'and the original data should not be modified').to.equal(3);
        expect(cell2.get('value'), 'but the cell value should be updated').to.equal(3);

        //data[1][2].value = 999;
        //this.sheet.set('data', data)
        //expect(range.get('value'), 'when the data in the sheet changes').to.equal(999);
    })
    it('range tranposed should be reflected in all cells', async function() {
        var range = await make_range.apply(this, [{row_start: 0, row_end: 1, column_start: 1, column_end:2, transpose: true, value: [[0, 1], [2, 3]]}])
        var data = data_cloner.call(this)
        expect(data[0][1].value, 'and in the underlying data grid').to.equal(0);
        expect(data[0][2].value, 'and in the underlying data grid').to.equal(2);
        expect(data[1][1].value, 'and in the underlying data grid').to.equal(1);
        expect(data[1][2].value, 'and in the underlying data grid').to.equal(3);

        var cell = await make_cell.apply(this, [{row_start:0, row_end: 0, value: 777}])
        data = data_cloner.call(this)
        expect(data[0][2].value, 'sanity check').to.equal(777);
        expect(range.get('value')[1][0], 'and in the underlying data grid, synced back').to.equal(777);
        //data[1][2].value = 999;
        //this.sheet.set('data', data)
        //expect(range.get('value'), 'when the data in the sheet changes').to.equal(999);
    })
    it('should use the last style but not overwrite', async function() {
        var range = await make_range.apply(this, [{row_start: 0, row_end: 1, column_start: 1, column_end:2, transpose: true, value: [[0, 1], [2, 3]],
                                        style: {color: 'red', backgrouncColor: 'orange'}}])
        var data = data_cloner.call(this)
        expect(data[0][1].options.style.color, 'and in the underlying data grid').to.equal('red');
        expect(data[0][2].options.style.color, 'and in the underlying data grid').to.equal('red');
        expect(data[1][1].options.style.color, 'and in the underlying data grid').to.equal('red');
        expect(data[1][2].options.style.color, 'and in the underlying data grid').to.equal('red');
        expect(data[0][1].options.style.backgrouncColor, 'and in the underlying data grid').to.equal('orange');
        expect(data[0][2].options.style.backgrouncColor, 'and in the underlying data grid').to.equal('orange');
        expect(data[1][1].options.style.backgrouncColor, 'and in the underlying data grid').to.equal('orange');
        expect(data[1][2].options.style.backgrouncColor, 'and in the underlying data grid').to.equal('orange');
        var cell = await make_cell.apply(this, [{row_start:0, row_end: 0, value: 777, style: {color: 'blue'}}])
        data = data_cloner.call(this)
        expect(data[0][2].options.style.color, 'effective color should be blue').to.equal('blue');
        expect(data[0][2].options.style.backgrouncColor, 'effective backgrouncColor should be blue').to.equal('orange');
        expect(range.get('style').color, 'but the original should not be changed').to.equal('red');
    })
    it('should search at table creation', async function() {
        var cell = await make_cell.apply(this, [{value: [['Hello']]}]);
        this.sheet.set('search_token', 'Hell');
        var view = await make_view.call(this)
        await view._table_constructed;

        expect(view.el.querySelector('td[class*="htSearchResult"]')).to.not.equal(null);
    })
    it('should search', async function() {
        var cell = await make_cell.apply(this, [{value: [['Hello']]}]);
        var view = await make_view.call(this)
        await view._table_constructed;

        expect(view.el.querySelector('td[class*="htSearchResult"]')).to.equal(null);
        this.sheet.set('search_token', 'Hell');
        expect(view.el.querySelector('td[class*="htSearchResult"]')).to.not.equal(null);
    })
    it('should search after change', async function() {
        var cell = await make_cell.apply(this, [{value: [['Yop']]}]);
        var view = await make_view.call(this)
        await view._table_constructed;

        this.sheet.set('search_token', 'Hell');
        expect(view.el.querySelector('td[class*="htSearchResult"]')).to.equal(null);
        cell.set('value', [['Hello']]);
        await view._last_data_set;
        expect(view.el.querySelector('td[class*="htSearchResult"]')).to.not.equal(null);
    })
})
