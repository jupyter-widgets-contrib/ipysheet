var widgets = require('@jupyter-widgets/base');
var _ = require('lodash');
var ipysheet = require('ipysheet')
var Handsontable = require('handsontable')

var PricerHybridSheetModel = ipysheet.SheetModel.extend({
    initialize : function () {
        PricerHybridSheetModel.__super__.initialize.apply(this, arguments)
        console.log('pre build')
        //console.log('bm', bm)
        /*this.set('rows', build_module.default.tableConfig.maxRows)
        this.set('columns', build_module.default.tableConfig.maxCols)
        _.each(build_module.default.blockConfig, _.bind(function(block){
            //console.log(block)
            if(block.pos) {
                //console.log('log', block.init)
                var options = {row:  block.pos[0], column: block.pos[1], value:block.init} 
                //if(block.renderer && block.renderer != "null")
                options.renderer = renderer_fix(block.renderer) || 'text'
                options.name = block.name || null;
                //options.renderer = 'text'
                //console.log(options)
                //debugger;
                var cellPromise = this.widget_manager.new_widget({
                    model_module: 'ipysheet',
                    model_name: 'CellModel',
                    model_module_version : '0.1.0',
                    view_name: null,
                    view_module: null,
                    view_module_version: '',
                    //view_module: 'ipywidgets',
                    //view_name: 'WidgetView',
                    //view_module_version: '*',
                    widget_class: 'ipysheet.sheet.Cell',
                }, options);
                cellPromise.then(_.bind(function(cell) {
                    var cells = this.get('cells').slice()
                    //debugger;
                    cells.push(cell)
                    //console.log(cell.get('renderer'))
                    this.set('cells', cells)

                    var named_cells = _.clone(this.get('named_cells'))
                    var name = cell.get('name')
                    if(name) {
                        named_cells[name] = cell
                        this.set('named_cells', named_cells)
                    }
                    this.save_changes()
                }, this))
            }
        }, this))*/
    }
})
var PricerHybridSheetView = ipysheet.SheetView.extend({
    /*_build_table: function(){
        return new Promise(_.bind(function(accept, reject) {
            window.bm = build_module // for debugging
            var hot = new Handsontable(this.el, _.extend({}, build_module.default.tableConfig, {
                data: this._get_cell_data(),
                cells: _.bind(this._cell, this)
            }, this._hot_settings(), ))
            _.each(build_module.default.hooks, function(hook) {
                Handsontable.hooks.add(hook.hook, hook.callback, hot);
            })
            //var hook = build_module.default.hooks[0];
            //Handsontable.hooks.add(hook.hook, hook.callback, hot);
            
            accept(hot)
        }, this))
    }*/
})



module.exports = {
    PricerHybridSheetModel : PricerHybridSheetModel,
    PricerHybridSheetView : PricerHybridSheetView
};
