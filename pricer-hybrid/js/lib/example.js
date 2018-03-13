var widgets = require('@jupyter-widgets/base');
var _ = require('lodash');
var ipysheet = require('ipysheet')
var Handsontable = require('handsontable')
require('./renderers');
var config = require('./config');
var hooks = require('./hooks');

console.log(config)

var PricerHybridSheetModel = ipysheet.SheetModel.extend({
    initialize : function () {
        PricerHybridSheetModel.__super__.initialize.apply(this, arguments)
        console.log('pre build')
        //console.log('bm', bm)
        this.set('rows', config.table.maxRows)
        this.set('columns', config.table.maxCols)
        let named_cells = {}
        var cellPromises = _.map(config.block, (block, key) => {
            if(block.pos) {
                var options = {
                        row_start:    block.pos[0],
                        column_start: block.pos[1],
                        row_end:      block.pos[0],
                        column_end:   block.pos[1],
                        value:        block.init
                } 
            } else {
                var options = {
                        row_start:    block.posLo[0],
                        column_start: block.posLo[1],
                        row_end:      block.posHi[0],
                        column_end:   block.posHi[1],
                        squeeze_row: false,
                        squeeze_column: false,
                        transpose: block.transpose ? true : false,
                        value:        block.init || null,
                } 

            }
            options.renderer = block.renderer;
            options.name = block.name || null;
            var cellPromise = this.widget_manager.new_widget({
                model_module: 'ipysheet',
                model_name: 'CellRangeModel',
                model_module_version : ipysheet.version,
                view_name: null,
                view_module: null,
                view_module_version: ipysheet.version,
                widget_class: 'ipysheet.sheet.CellRange',
            }, options);
            cellPromises.then((cell) => {
                if(block.name)
                    named_cells[block.name] = cell;
            })

            return cellPromise
        })
        Promise.all(cellPromises).then((cells) => {
            this.set('cells', cells);
            this.set('named_cells', named_cells);

        });
        //this.save_changes()
    }
})
var PricerHybridSheetView = ipysheet.SheetView.extend({
    _build_table: function(){
        return new Promise(_.bind(function(accept, reject) {
            //window.bm = build_module // for debugging
            var hot = new Handsontable(this.el, _.extend({}, config.table, {
                data: this._get_cell_data(),
                cells: _.bind(this._cell, this)
            }, this._hot_settings()))
            _.each(hooks.default, function(hook) {
                Handsontable.hooks.add(hook.hook, hook.callback, hot);
            })
            //var hook = build_module.default.hooks[0];
            //Handsontable.hooks.add(hook.hook, hook.callback, hot);
            
            accept(hot)
        }, this))
    }
})



module.exports = {
    PricerHybridSheetModel : PricerHybridSheetModel,
    PricerHybridSheetView : PricerHybridSheetView
};
