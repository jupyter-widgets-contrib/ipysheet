import * as widgets from 'jupyter-js-widgets';
import * as _ from 'underscore';
import * as ipysheet from '../../js';
import {DummyManager} from './dummy-manager';
import { expect } from 'chai';

describe('sheet', function() {
    beforeEach(async function() {
        this.manager = new DummyManager({ipysheet: ipysheet});
        const modelId = 'u-u-i-d';
        this.sheet = await this.manager.new_widget({
            model_module: 'ipysheet',
            model_name: 'SheetModel',
            model_module_version : '0.1.0',
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
        //console.log(this.sheet.get('data'))
        expect(this.sheet.get('data')).to.have.lengthOf(2);
        expect(this.sheet.get('data')[0]).to.have.lengthOf(4);
    })
    it('data row grow', function() {
        // test grow
        this.sheet.get('data')[1][2].value = 123
        this.sheet.set('rows', 3)
        expect(this.sheet.get('data')).to.have.lengthOf(3);
        expect(this.sheet.get('data')[0]).to.have.lengthOf(4);
        expect(this.sheet.get('data')[2]).to.have.lengthOf(4);
        expect(this.sheet.get('data')[1][2].value, 'data should be preserved when changing size').to.equal(123);

        this.sheet.set('rows', 5)
        expect(this.sheet.get('data')).to.have.lengthOf(5);
        expect(this.sheet.get('data')[0]).to.have.lengthOf(4);
        expect(this.sheet.get('data')[2]).to.have.lengthOf(4);
        expect(this.sheet.get('data')[1][2].value, 'data should be preserved when changing size').to.equal(123);
    })
    it('data column shrink', function() {
        this.sheet.get('data')[1][2].value = 123
        this.sheet.get('data')[1][3].value = 1234
        this.sheet.set('columns', 3)
        expect(this.sheet.get('data')).to.have.lengthOf(2);
        expect(this.sheet.get('data')[0]).to.have.lengthOf(3);
        expect(this.sheet.get('data')[1]).to.have.lengthOf(3);
        expect(this.sheet.get('data')[1][2].value, 'data should be preserved when changing size').to.equal(123);
    })
    it('data column grow', function() {
        this.sheet.set('columns', 5)
        expect(this.sheet.get('data')).to.have.lengthOf(2);
        expect(this.sheet.get('data')[0]).to.have.lengthOf(5);
        expect(this.sheet.get('data')[1]).to.have.lengthOf(5);
    })
    var make_view = async function() {
        const options = { model: this.sheet };
        const view = await this.manager.create_view(this.sheet); //new ipysheet.SheetView(options);
        await this.manager.display_view(undefined, view);
        return view;
    }
    var wait_validate = async function(view) {
        return new Promise(function(resolve, reject) {
            view.hot.validateCells(function(valid) {
                console.log('waited for validate,', valid)
                resolve(valid)
            })
        })
    }
    it('model reflecting view', async function() {
        var view = await make_view.call(this)
        view.set_cell(1,2, 123)
        await wait_validate(view)
        expect(this.sheet.get('data')[1][2].value, 'cell changes should be reflected in model').to.equal(123);
        /**/
    })
    it('view reflecting model', async function() {
        var view = await make_view.call(this)
        var data = _.clone(this.sheet.get('data'))
        var data_clone = JSON.parse(JSON.stringify(data))
        data_clone[1][2].value = 123
        expect(data[1][2].value, 'cloned data check').to.not.equal(123);
        this.sheet.set('data', data_clone)
        expect(view.get_cell(1,2), 'model change should be reflected in view').to.equal(123);
    })
    it('view reflecting different view', async function() {
        var view1 = await make_view.call(this)
        var view2 = await make_view.call(this)
        view1.set_cell(1,2, 123)
        var bla = await wait_validate(view1)
        expect(view1.get_cell(1,2), 'model change should be reflected in view').to.equal(123);
        expect(view1.get_cell(1,2), 'cell changes in one view should be reflected in a related view'). to.equal(view2.get_cell(1,2));
    })
    /*it('invalid sheet should not propagate to model', async function() {
        var view = await make_view.call(this)
        var data = _.clone(this.sheet.get('data'))
        var data_clone = JSON.parse(JSON.stringify(data))
        data_clone[1][2].value = 123
        data_clone[1][2].options = {type: 'numeric'}
        expect(data[1][2].value, 'cloned data check').to.not.equal(123);
        expect(data_clone[1][2].value, 'cloned data check').to.equal(123);
        this.sheet.set('data', data_clone)

        view.set_cell(1,2, 'wrong')
        await wait_validate(view)
        expect(view.get_cell(1,2), 'sheet will reflect invalid data').to.equal('wrong');
        expect(this.sheet.get('data')[1][2].value, 'model should not have invalid data').to.not.equal('wrong');
    })*/
    it('should fail', function() {
        expect(false).to.be.false;
    });
})
