var widgets = require('jupyter-js-widgets');
var _ = require('underscore');
var Handsontable = require('../handsontable/handsontable.min.js')
require('style!css!../handsontable/handsontable.min.css')
require('style!css!./custom.css')

require('style!css!../handsontable/pikaday/pikaday.css')
//require('../handsontable/pikaday/pikaday.js')

var CellModel = widgets.WidgetModel.extend({
    defaults: function() {
        return _.extend(SheetModel.__super__.defaults.call(this), {
            _model_name : 'CellModel',
            //_view_name : 'CellView',
            _model_module : 'ipysheet',
            //_view_module : 'ipysheet',
            _model_module_version : '0.1.0',
            _view_module_version : '0.1.0',
            value : 1,
    		row: 1,
    		column: 1,
            type: 'text',
            style: {},
        })
    },
});

var SheetModel = widgets.DOMWidgetModel.extend({
    defaults: function() {
        return _.extend(SheetModel.__super__.defaults.call(this), {
            _model_name : 'SheetModel',
            _view_name : 'SheetView',
            _model_module : 'ipysheet',
            _view_module : 'ipysheet',
            _model_module_version : '0.1.0',
            _view_module_version : '0.1.0',
            rows: 3,
            columns: 4,
            data: [[]],
            cells: [],
            row_headers: true,
            column_headers: true
        })
    },
    initialize : function () {
        //widgets.DOMWidgetModel.prototype.constructor.apply(this, arguments);
        SheetModel.__super__.initialize.apply(this, arguments)
        this.update_data_grid()
        window.last_sheet_model = this;
        this.on('change:rows change:columns', this.update_data_grid, this)
        this.on('change:cells', this.on_change_cells, this)
        this.on('change:data', this.grid_to_cell, this)
    },
    on_change_cells: function() {
        console.log('change cells', arguments)
        var previous_cells = this.previous('cells');
        var cells = this.get('cells')
        for(var i = 0; i < cells.length; i++) {
            var cell = cells[i];
            if(!_.contains(previous_cells, cell)) {
                console.log('adding cell', cell)
                this.cell_bind(cell)
            }
        }
    },
    cell_bind: function(cell) {
        this.cell_to_grid(cell)
        cell.on('change:value change:style change:type', function() {
            this.cell_to_grid(cell)
        }, this)
    },
    cell_to_grid: function(cell) {
        console.log('cell to grid', cell)
        var data = clone_deep(this.get('data'))
        var cell_data = data[cell.get('row')][cell.get('column')]
        cell_data.value = cell.get('value')
        cell_data.options['type'] = cell.get('type')
        cell_data.options['style'] = cell.get('style')
        this.set('data', data)
        this.save_changes()
    },
    grid_to_cell: function() {
        console.log('grid to cell')
        var data = this.get('data');
        _.each(this.get('cells'), function(cell) {
            var cell_data = data[cell.get('row')][cell.get('column')]
            cell.set('value', cell_data.value)
            cell.set('type', cell_data.options['type'])
            cell.set('style', cell_data.options['style'])
            cell.save_changes()
        }, this)
    },
    update_data_grid: function() {
        // create a row x column array of arrays filled with null
        var data = clone_deep(this.get('data')); // clone, otherwise backbone/underscore won't notice the change
        var rows = this.get('rows');
        var columns = this.get('columns');

        empty_cell = function() {
            return {value: null, options:{}};
        };
        empty_row = _.bind(function() {
            return _.times(this.get('columns'), empty_cell)
        }, this)
        //console.log('data<', data)
        if(rows < data.length) {
            data = data.slice(0, rows);
        } else if(rows > data.length) {
            for(var i = data.length; i < rows; i++) {
                data.push(empty_row())
            }
        }
        for(var i = 0; i < rows; i++) {
            var row = data[i]
            if(columns < row.length) {
                row = row.slice(0, columns)
            } else if(columns > row.length) {
                for(var j = row.length; j < columns; j++) {
                    row.push(empty_cell())
                }
            }
            data[i] = row;
        }
        //console.log('data>', data)
        this.set('data', data)
        this.save_changes()
    }
}, {
    serializers: _.extend({
        cells: { deserialize: widgets.unpack_models }
    }, widgets.DOMWidgetModel.serializers)
});

var clone_deep = function(obj) {
    return JSON.parse(JSON.stringify(obj))
}

var extract2d = function(grid, attr) {
    return _.map(grid, function(column) {
        return _.map(column, function(value) {
            return value[attr]
        })
    })
}
var put_values2d = function(grid, values) {
    for(var i = 0; i < grid.length; i++) {
        for(var j = 0; j < grid[i].length; j++) {
            grid[i][j].value = values[i][j]
        }
    }
}

// calls the original renderer and then applies custom styling
Handsontable.renderers.registerRenderer('styled', function customRenderer(hotInstance, td, row, column, prop, value, cellProperties) {
    var name = cellProperties.original_renderer || cellProperties.type || 'text'
    var original_renderer = Handsontable.renderers.getRenderer(name)
    original_renderer.apply(this, arguments);
    _.each(cellProperties.style, function(value, key) {
        td.style[key] = value;
    })
})

var SheetView = widgets.DOMWidgetView.extend({
    render: function() {
        this._refresh_requested = false;
        this.throttle_on_data_change = _.throttle(_.bind(this._real_on_data_change, this), 300)
        //this.listenTo(this.model, 'change:data', this.on_data_change)
		this.displayed.then(_.bind(function() {
			this.hot = new Handsontable(this.el, _.extend({
                data: extract2d(this.model.get('data'), 'value'),
                rowHeaders: true,
                colHeaders: true,
                cells: _.bind(this._cell, this)
			}, this._hot_settings()));
            Handsontable.hooks.add('afterChange', _.bind(this._on_change, this), this.hot);
		}, this));
        window.last_sheet_view = this;
        this.model.on('change:data', this.on_data_change, this)
        this.model.on('change:column_headers change:row_headers', this._update_hot_settings, this)
        this.model.on('change:stretch_headers change:column_width', this._update_hot_settings, this)
    },
    _update_hot_settings: function() {
        console.log('update', this._hot_settings())
        this.hot.updateSettings(this._hot_settings())
    },
    _hot_settings: function() {
        return {
            colHeaders: this.model.get('column_headers'),
            rowHeaders: this.model.get('row_headers'),
            stretchH: this.model.get('stretch_headers'),
            colWidths: this.model.get('column_width') || undefined
        }
    },
    _cell: function(row, col, prop) {
        var cellProperties = {}
        _.extend(cellProperties, this.model.get('data')[row][col].options)
        if('renderer' in cellProperties)
               cellProperties.original_renderer = cellProperties.renderer;
        cellProperties.renderer = 'styled'
        //console.log(row, col, prop, cellProperties)
        return cellProperties;
    },
    _on_change: function(changes, source) {
        if(source == 'loadData')
            return; // ignore loadData
        this.hot.validateCells(_.bind(function(valid){
            if(valid) {
                var data = clone_deep(this.model.get('data'))
                var value_data = this.hot.getSourceDataArray()
                put_values2d(data, value_data)
                this.model.set('data', clone_deep(data))
                this.model.save_changes()
            }
        }, this))
    },
    on_data_change: function() {
        this.throttle_on_data_change()
        //this._real_on_data_change()
    },
    _real_on_data_change: function() {
        var data_previous = this.model.previous('data')
        var data = extract2d(this.model.get('data'), 'value')
        var rows = data.length;
        var rows_previous = data_previous.length;
        var cols = data[0].length;
        var cols_previous = data_previous[0].length;
        if(rows > rows_previous)
            this.hot.alter('insert_row', rows-1, rows-rows_previous)
        if(rows < rows_previous)
            this.hot.alter('remove_row', rows-1, rows_previous-rows)
        if(cols > cols_previous)
            this.hot.alter('insert_col', cols-1, cols-cols_previous)
        if(cols < cols_previous)
            this.hot.alter('remove_col', cols-1, cols_previous-cols)

        this.hot.loadData(data)
    },
    set_cell: function(row, column, value) {
        this.hot.setDataAtCell(row, column, value)
    },
    get_cell: function(row, column) {
        return this.hot.getDataAtCell(row, column)
    },
	refresh_table: function() {
		this.hot.render()
	},
});


module.exports = {
    SheetModel : SheetModel,
    SheetView : SheetView,
    CellModel: CellModel
};
