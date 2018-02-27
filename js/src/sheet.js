import * as widgets  from '@jupyter-widgets/base';
import {cloneDeep, extend, includes as contains, each, debounce, times, map, unzip as transpose} from 'lodash';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.min.css';
import 'pikaday/css/pikaday.css';
import './custom.css';

var CellRangeModel = widgets.WidgetModel.extend({
    defaults: function() {
        return extend(CellRangeModel.__super__.defaults.call(this), {
            _model_name : 'CellRangeModel',
            _model_module : 'ipysheet',
            _model_module_version : '0.1.0',
            value : null,
            row_start: 1,
            column_start: 1,
            row_end: 1,
            column_end: 1,
            type: null, //'text',
            name: null,
            style: {},
            renderer: null,
            read_only: false,
            choice: null,
            squeeze_row: true,
            squeeze_column: true, 
            transpose: false,
            format: '0.[000]'
        });
    },
});


var SheetModel = widgets.DOMWidgetModel.extend({
    defaults: function() {
        return extend(SheetModel.__super__.defaults.call(this), {
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
            named_cells: {},
            row_headers: true,
            column_headers: true,
            stretch_headers: 'all',
            column_width: null,
        });
    },
    initialize : function () {
        SheetModel.__super__.initialize.apply(this, arguments);
        this.update_data_grid();
        this._updating_grid = false;
        window.last_sheet_model = this;
        this.on('change:rows change:columns', this.update_data_grid, this);
        this.on('change:cells', this.on_change_cells, this);
        this.on('change:data', this.grid_to_cell, this);
        each(this.get('cells'), (cell) => this.cell_bind(cell))
        this.cells_to_grid()

    },
    on_change_cells: function() {
        console.log('change cells');
        this._updating_grid = true;
        try {
            var previous_cells = this.previous('cells');
            var cells = this.get('cells');
            for(var i = 0; i < cells.length; i++) {
                var cell = cells[i];
                if(!contains(previous_cells, cell)) {
                    console.log('adding cell', cell);
                    this.cell_bind(cell);
                }
            }
            this.cells_to_grid()
            //this.save_changes();
        } finally {
            this._updating_grid = false;
        }
        this.grid_to_cell()
    },
    cell_bind: function(cell) {
        //this.cell_to_grid(cell, false);
        cell.on('change:value change:style change:type change:renderer change:read_only change:choice change:format', function() {
            //this.cell_to_grid(cell, true);
            this.cells_to_grid()
        }, this);
    },
    cells_to_grid: function() {
        each(this.get('cells'), (cell) => this.cell_to_grid(cell, false))
        this.save_changes()
    },
    cell_to_grid: function(cell, save) {
        console.log('cell to grid', cell);
        var data = cloneDeep(this.get('data'));
        for(var i = cell.get('row_start'); i <= cell.get('row_end'); i++) {
            for(var j = cell.get('column_start'); j <= cell.get('column_end'); j++) {
                var cell_row = i - cell.get('row_start');
                var cell_col = j - cell.get('column_start');
                var value = cell.get('value');
                //console.log(cell.get('value'), i, j, cell_row, cell_col, ',', data.length, data[0].length, data, value)
                //console.log(value[cell_row][cell_col])
                var cell_data = data[i][j];
                if(cell.get('transpose')) {
                    if(!cell.get('squeeze_column'))
                        value = value[cell_col]
                    if(!cell.get('squeeze_row'))
                        value = value[cell_row]
                } else {
                    if(!cell.get('squeeze_row'))
                        value = value[cell_row]
                    if(!cell.get('squeeze_column'))
                        value = value[cell_col]
                }
                if(value != null)
                    cell_data.value = value;
                //console.log(i, j, cell.get('style'), value)
                cell_data.options['type'] = cell.get('type') || cell_data.options['type'];
                cell_data.options['style'] = extend({}, cell_data.options['style'], cell.get('style'));
                cell_data.options['renderer'] = cell.get('renderer') || cell_data.options['renderer'];
                cell_data.options['readOnly'] = cell.get('read_only') || cell_data.options['readOnly'];
                cell_data.options['source'] = cell.get('choice') || cell_data.options['source'];
                cell_data.options['format'] = cell.get('format') || cell_data.options['format'];
            }
        }
        this.set('data', data);
        if(save) {
            this.save_changes();
        }
    },
    grid_to_cell: function() {
        if(this._updating_grid) {
            console.log('grid to cell skipped');
            return;
        }
        console.log('grid to cell', this._massive_update);
        this._updating_grid = true;
        try {
            var data = this.get('data');
            each(this.get('cells'), function(cell) {
                var rows = [];
                for(var i = cell.get('row_start'); i <= cell.get('row_end'); i++) {
                    var row = [];
                    for(var j = cell.get('column_start'); j <= cell.get('column_end'); j++) {
                        //var cell_row = i - cell.get('row_start');
                        //var cell_col = j - cell.get('column_start');
                        var cell_data = data[i][j];
                        row.push(cell_data.value)
                        /*cell.set('value', cell_data.value);
                        cell.set('type', cell_data.options['type']);
                        cell.set('style', cell_data.options['style']);
                        cell.set('renderer', cell_data.options['renderer']);
                        cell.set('read_only', cell_data.options['readOnly']);
                        cell.set('choice', cell_data.options['source']);
                        cell.set('format', cell_data.options['format']);*/
                    }
                    if(cell.get('squeeze_column')) {
                        row = row[0];
                    }
                    rows.push(row);
                }
                if(cell.get('squeeze_row')) {
                    rows = rows[0];
                }
                if(cell.get('transpose')) {
                    cell.set('value', transpose(rows))
                } else {
                    cell.set('value', rows)
                }
                cell.save_changes();
            }, this);
        } finally {
            this._updating_grid = false;
        }
    },
    update_data_grid: function() {
        // create a row x column array of arrays filled with null
        var data = cloneDeep(this.get('data')); // clone, otherwise backbone/underscore won't notice the change
        var rows = this.get('rows');
        var columns = this.get('columns');

        var empty_cell = () => {
            return {value: null, options:{}};
        };
        var empty_row = () => {
            return times(this.get('columns'), empty_cell);
        };
        //console.log('data<', data)
        if(rows < data.length) {
            data = data.slice(0, rows);
        } else if(rows > data.length) {
            for(var i = data.length; i < rows; i++) {
                data.push(empty_row());
            }
        }
        for(var i = 0; i < rows; i++) {
            var row = data[i];
            if(columns < row.length) {
                row = row.slice(0, columns);
            } else if(columns > row.length) {
                for(var j = row.length; j < columns; j++) {
                    row.push(empty_cell());
                }
            }
            data[i] = row;
        }
        //console.log('data>', data)
        this.set('data', data);
        this.save_changes();
    }
}, {
    serializers: extend({
        cells: { deserialize: widgets.unpack_models }
    }, widgets.DOMWidgetModel.serializers)
});

// go from 2d array with objects to a 2d grid containing just attribute `attr` from those objects
var extract2d = function(grid, attr) {
    return map(grid, function(column) {
        return map(column, function(value) {
            return value[attr];
        });
    });
};
// inverse of above
var put_values2d = function(grid, values) {
    // TODO: the Math.min should not be needed, happens with the custom-build
    for(var i = 0; i < Math.min(grid.length, values.length); i++) {
        for(var j = 0; j < Math.min(grid[i].length, values[i].length); j++) {
            grid[i][j].value = values[i][j];
        }
    }
};

// calls the original renderer and then applies custom styling
Handsontable.renderers.registerRenderer('styled', function customRenderer(hotInstance, td, row, column, prop, value, cellProperties) {
    var name = cellProperties.original_renderer || cellProperties.type || 'text';
    var original_renderer = Handsontable.renderers.getRenderer(name);
    if(!original_renderer) {
        console.error('could not find renderer: ' + original_renderer)
    } else {
        original_renderer.apply(this, arguments);
        each(cellProperties.style, function(value, key) {
            td.style[key] = value;
        });
    }
});

var testing = false;
var setTesting = function() {
    testing = true;
};

var SheetView = widgets.DOMWidgetView.extend({
    render: function() {
        this._refresh_requested = false;
        /*
        We debounce rendering of the table, since rendering can take quite some time, however that
        makes unittesting difficult, since the results don't happend instanely. Maybe a better solution
        is to use a deferred object.
        */
        if(testing) {
            this.throttled_on_data_change = this._real_on_data_change;
            this.throttled_render = this._real_table_render;

        } else {
            this.throttled_on_data_change = debounce(() => this._real_on_data_change(), 100);
            this.throttled_render = debounce(() => this._real_table_render(), 100);
        }
        // 
        //this.listenTo(this.model, 'change:data', this.on_data_change)
        this.displayed.then(() => {
            this._build_table().then(hot => {
                this.hot = hot;
                Handsontable.hooks.add('afterChange',    () => this._on_change(),      this.hot);
                Handsontable.hooks.add('afterRemoveCol', () => this._on_change_grid(), this.hot);
                Handsontable.hooks.add('afterRemoveRow', () => this._on_change_grid(), this.hot);
            });
        });
        window.last_sheet_view = this;
        this.model.on('change:data', this.on_data_change, this);
        this.model.on('change:column_headers change:row_headers', this._update_hot_settings, this);
        this.model.on('change:stretch_headers change:column_width', this._update_hot_settings, this);
    },
    processPhosphorMessage: function(msg) {
        SheetView.__super__.processPhosphorMessage.apply(this, arguments);
        switch (msg.type) {
        case 'resize':
        case 'after-show':
            this.throttled_render();
            break;
        }
    },
    _build_table(options) {
        return Promise.resolve(new Handsontable(this.el, extend({}, options, {
            data: this._get_cell_data(),
            rowHeaders: true,
            colHeaders: true,
            cells: (...args) => this._cell(...args)
        }, this._hot_settings())));
    },
    _update_hot_settings: function() {
        console.log('update', this._hot_settings());
        this.hot.updateSettings(this._hot_settings());
    },
    _hot_settings: function() {
        return {
            colHeaders: this.model.get('column_headers'),
            rowHeaders: this.model.get('row_headers'),
            stretchH: this.model.get('stretch_headers'),
            colWidths: this.model.get('column_width') || undefined
        };
    },
    _get_cell_data: function() {
        return extract2d(this.model.get('data'), 'value');
    },
    _cell: function(row, col) {
        var cellProperties = {};
        var data = this.model.get('data');
        if((row < data.length) && (col < data[row].length)) {
            extend(cellProperties, data[row][col].options);
        } else {
            console.error('cell out of range');
        }
        if(cellProperties['type'] == null)
            delete cellProperties['type'];
        if(cellProperties['style'] == null)
            delete cellProperties['style'];
        if(cellProperties['source'] == null)
            delete cellProperties['source'];
        if('renderer' in cellProperties)
            cellProperties.original_renderer = cellProperties.renderer;
        cellProperties.renderer = 'styled';
        //console.log(row, col, prop, cellProperties)
        return cellProperties;
    },
    _on_change_grid: function(changes, source) {
        var data = this.hot.getSourceDataArray();
        console.log('table altered, make sure this is reflected in the model', data.length, data[0].length);
        this.model.set({'rows': data.length, 'columns': data[0].length});
        this.model.save_changes();
    },
    _on_change: function(changes, source) {
        console.log('table altered...', changes, source);
        //*
        if(source == 'loadData')
            return; // ignore loadData
        if(source == 'alter') {
            console.log('table altered, make sure this is reflected in the model');
            var data = this.hot.getSourceDataArray();
            this.model.set({'rows': data.length, 'columns': data[0].length});
            this.model.save_changes();
            return;
        }
        //this.hot.validateCells()
        //*
        //this.hot.validateCells(_.bind(function(valid){
        //    console.log('valid?', valid)
        //    if(valid) {
        var data = cloneDeep(this.model.get('data'));
        var value_data = this.hot.getSourceDataArray();
        put_values2d(data, value_data);
        this.model.set('data', cloneDeep(data));
        this.model.save_changes();
        //    }
        //}, this))
        /**/
    },
    on_data_change: function() {
        this.throttled_on_data_change();
        //this._real_on_data_change()
    },
    _real_on_data_change: function() {
        var data = extract2d(this.model.get('data'), 'value');
        var rows = data.length;
        var cols = data[0].length;
        var changed = false;
        var rows_previous = this.hot.countRows();
        var cols_previous = this.hot.countCols();
        //*
        if(rows > rows_previous) {
            this.hot.alter('insert_row', rows-1, rows-rows_previous);
            changed = true;
        }
        if(rows < this.hot.countRows()) {
            this.hot.alter('remove_row', rows-1, rows_previous-rows);
            changed = true;
        }
        if(cols > cols_previous) {
            this.hot.alter('insert_col', cols-1, cols-cols_previous);
            changed = true;
        }
        if(cols < cols_previous) {
            this.hot.alter('remove_col', cols-1, cols_previous-cols);
            changed = true;
        }/**/

        this.hot.loadData(data);
        // if headers are not shows, loadData will make them show again, toggling
        // will fix this (handsontable bug?)
        this.hot.updateSettings({colHeaders: true, rowHeaders: true});
        this.hot.updateSettings({
            colHeaders: this.model.get('column_headers'),
            rowHeaders: this.model.get('row_headers')
        });
        this.throttled_render();
        //this.hot.render()
    },
    set_cell: function(row, column, value) {
        this.hot.setDataAtCell(row, column, value);
    },
    get_cell: function(row, column) {
        return this.hot.getDataAtCell(row, column);
    },
    refresh_table: function() {
        //this.hot.render()
        if(!this._refresh_requested) {
            this._refresh_requested = true;
            requestAnimationFrame(() => this._real_refresh_table(), this);
        }
    },
    _real_table_render: function() {
        this.hot.render();
        this._refresh_requested = false;
    }
});


var RendererModel = widgets.WidgetModel.extend({
    defaults: function() {
        return extend(RendererModel.__super__.defaults.call(this), {
            _model_name : 'RendererModel',
            _model_module : 'ipysheet',
            _model_module_version : '0.1.0',
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
    SheetModel,
    SheetView,
    CellRangeModel,
    RendererModel,
    Handsontable,
    setTesting
};
