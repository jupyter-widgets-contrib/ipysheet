var widgets = require('jupyter-js-widgets');
var _ = require('underscore');
var Handsontable = require('./handsontable-master/dist/handsontable.full.js')
require('style!css!./handsontable-master/dist/handsontable.full.css')
require('style!css!./custom.css')

var SheetModel = widgets.DOMWidgetModel.extend({
    defaults: function() {
        return _.extend(SheetModel.__super__.defaults.call(this), {
            _model_name : 'SheetModel',
            _view_name : 'SheetView',
            _model_module : 'ipysheet',
            _view_module : 'ipysheet',
            _model_module_version : '0.1.0',
            _view_module_version : '0.1.0',
            value : 'Sheet World',
    		rows: 3,
    		columns: 4,
            data: [[]],
        })
    },
    initialize : function () {
        //widgets.DOMWidgetModel.prototype.constructor.apply(this, arguments);
        SheetModel.__super__.initialize.apply(this, arguments)
        this.update_data_grid()
        window.last_sheet_model = this;
        this.on('change:rows change:columns', this.update_data_grid, this)
    },
    update_data_grid() {
        // create a row x column array of arrays filled with null
        var data = this.get('data');
        var rows = this.get('rows');
        var columns = this.get('columns');

        empty_cell = function() {
            return {value: 1, options:{}};
        };
        empty_row = _.bind(function() {
            return _.times(this.get('columns'), empty_cell)
        }, this)
        console.log('data<', data)
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
        console.log('data>', data)
        this.set('data', data)
        this.save_changes()
    }
});

var clone_deep = function(obj) {
    console.log('clone', JSON.stringify(obj))
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
    console.log(Handsontable.renderers.getRenderer(name))
    var original_renderer = Handsontable.renderers.getRenderer(name)
    console.log('renderer', original_renderer)
    original_renderer.apply(this, arguments);
    _.each(cellProperties.style, function(value, key) {
        console.log('setting style')
        td.style[key] = value;
    })/**/
})

var SheetView = widgets.DOMWidgetView.extend({
    render: function() {
        console.log('render!')
        this.value_changed();
        this.model.on('change:value', this.value_changed, this);
        this.listenTo(this.model, 'change:data', this.on_data_change)
		this.displayed.then(_.bind(function() {
			console.log('displayed, creating table', this.model.get('data'))
			this.hot = new Handsontable(this.el, {
                startRows: this.model.get('rows'),
                startCols: this.model.get('cols'),
                data: extract2d(this.model.get('data'), 'value'),
                rowHeaders: true,
                colHeaders: true,
                stretchH: 'all',
                cells: _.bind(this._cell, this)
			});
            Handsontable.hooks.add('afterChange', _.bind(this._on_change, this), this.hot);
		}, this));
        window.last_sheet_view = this;
    },
    _cell: function(row, col, prop) {
        var cellProperties = {}
        if (row === 0 && col === 0) {
              cellProperties.readOnly = true;
        }
        _.extend(cellProperties, this.model.get('data')[row][col].options)
        if('renderer' in cellProperties)
               cellProperties.original_renderer = cellProperties.renderer;
        cellProperties.renderer = 'styled'
        console.log(row, col, prop, cellProperties)
        return cellProperties;
    },
    _on_change: function(changes, source) {
        this.hot.validateCells(_.bind(function(valid){
            console.log('valid?', valid)
            if(valid) {
                var data = clone_deep(this.model.get('data'))
                var value_data = this.hot.getSourceDataArray()
                put_values2d(data, value_data)
                console.log('changes', changes)
                console.log('data', data)
                this.model.set('data', clone_deep(data))
                this.model.save_changes()
            }
        }, this))
    },
    on_data_change: function() {
        var data = extract2d(this.model.get('data'), 'value')
        this.hot.loadData(data)
        this.hot.validateCell
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
    value_changed: function() {
        //this.el.textContent = this.model.get('value');
    }
});


module.exports = {
    SheetModel : SheetModel,
    SheetView : SheetView
};
