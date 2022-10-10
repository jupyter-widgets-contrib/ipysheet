import {
    WidgetModel,
    DOMWidgetModel,
    DOMWidgetView,
    unpack_models,
    resolvePromisesDict,
    ISerializers
} from '@jupyter-widgets/base';
import {cloneDeep, extend, includes as contains, each, times, map, unzip as transpose} from 'lodash';
import {semver_range} from './version';
import {ipysheet_init_cell_type} from './widget_cell_type'

export * from './renderer';

// @ts-ignore
import Handsontable from 'handsontable';

// CSS
import 'pikaday/css/pikaday.css';
import 'handsontable/dist/handsontable.min.css';
import '../style/base.css';

ipysheet_init_cell_type();

export class CellRangeModel extends WidgetModel {
    defaults() {
        return {
            ...super.defaults(),
            _model_name : 'CellRangeModel',
            _model_module : 'ipysheet',
            _model_module_version : semver_range,
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
            numeric_format: '0.000',
            date_format: 'YYYY/MM/DD',
            time_format: 'h:mm:ss a'
        };
    }

    static serializers: ISerializers = {
        ...WidgetModel.serializers,
        value: { deserialize: unpack_models }
    }
}

export class SheetModel extends DOMWidgetModel {
    defaults() {
        return {
            ...super.defaults(),
            _model_name : 'SheetModel',
            _view_name : 'SheetView',
            _model_module : 'ipysheet',
            _view_module : 'ipysheet',
            _model_module_version : semver_range,
            _view_module_version : semver_range,
            rows: 3,
            columns: 4,
            cells: [],
            named_cells: {},
            row_headers: true,
            column_headers: true,
            stretch_headers: 'all',
            column_width: null,
            column_resizing: true,
            row_resizing: true,
            search_token: ''
        };
    }

    initialize(attributes: any, options: any) {
        super.initialize(attributes, options);

        this.data = [[]];
        this.update_data_grid(false);
        this._updating_grid = false;
        this.on('change:rows change:columns', this.update_data_grid, this);
        this.on('change:cells', this.on_change_cells, this);
        this.on('data_change', this.grid_to_cell, this);
        each(this.get('cells'), (cell) => this.cell_bind(cell))
        this.cells_to_grid()
    }

    on_change_cells() {
        this._updating_grid = true;
        try {
            let previous_cells = this.previous('cells');
            let cells = this.get('cells');
            for(let i = 0; i < cells.length; i++) {
                let cell = cells[i];
                if(!contains(previous_cells, cell)) {
                    this.cell_bind(cell);
                }
            }
            this.cells_to_grid()
            //this.save_changes();
        } finally {
            this._updating_grid = false;
        }
        this.grid_to_cell()
    }

    cell_bind(cell) {
        cell.on_some_change(['value', 'style', 'type', 'renderer', 'read_only', 'choice', 'numeric_format', 'date_format', 'time_format'], () => {
            this.cells_to_grid();
        });
    }

    cells_to_grid() {
        this.data = [[]];
        this.update_data_grid(false);

        each(this.get('cells'), (cell) => {
            this._cell_data_to_grid(cell)
        });
        this.trigger('data_change');
    }

    _cell_data_to_grid(cell) {
        cell.get('value');
        for(let i = cell.get('row_start'); i <= cell.get('row_end'); i++) {
            for(let j = cell.get('column_start'); j <= cell.get('column_end'); j++) {
                let value = cell.get('value');
                let cell_row = i - cell.get('row_start');
                let cell_col = j - cell.get('column_start');
                if((i >= this.data.length) || (j >= this.data[i].length))
                    continue; // skip cells that are out of the sheet
                let cell_data = this.data[i][j];
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
                if (value != null)
                    cell_data.value = value;
                if (cell.get('type') != null)
                    cell_data.options['type'] = cell.get('type');
                if (cell.get('renderer') != null)
                    cell_data.options['renderer'] = cell.get('renderer');
                if (cell.get('read_only') != null)
                    cell_data.options['readOnly'] = cell.get('read_only');
                if (cell.get('choice') != null)
                    cell_data.options['source'] = cell.get('choice')
                if (cell.get('numeric_format') && cell.get('type') == 'numeric')
                    cell_data.options['numericFormat'] = {'pattern': cell.get('numeric_format')};
                if (cell.get('date_format') && cell.get('type') == 'date') {
                    cell_data.options['correctFormat'] = true;
                    cell_data.options['dateFormat'] = cell.get('date_format') || cell_data.options['dateFormat'];
                }
                if (cell.get('time_format') && cell.get('type') == 'time') {
                    cell_data.options['correctFormat'] = true;
                    cell_data.options['timeFormat'] = cell.get('time_format') || cell_data.options['timeFormat'];
                }

                cell_data.options['style'] = extend({}, cell_data.options['style'], cell.get('style'));
            }
        }
    }

    grid_to_cell() {
        if(this._updating_grid) {
            return;
        }
        this._updating_grid = true;
        try {
            each(this.get('cells'), (cell) => {
                let rows: any[] = [];
                for(let i = cell.get('row_start'); i <= cell.get('row_end'); i++) {
                    let row: any[] = [];
                    for(let j = cell.get('column_start'); j <= cell.get('column_end'); j++) {
                        //let cell_row = i - cell.get('row_start');
                        //let cell_col = j - cell.get('column_start');
                        if((i >= this.data.length) || (j >= this.data[i].length))
                            continue; // skip cells that are out of the sheet
                        let cell_data = this.data[i][j];
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
            });
        } finally {
            this._updating_grid = false;
        }
    }

    update_data_grid(trigger_change_event=true) {
        // create a row x column array of arrays filled with null
        let rows = this.get('rows');
        let columns = this.get('columns');

        let empty_cell = () => {
            return {value: null, options:{}};
        };
        let empty_row = () => {
            return times(this.get('columns'), empty_cell);
        };
        if(rows < this.data.length) {
            this.data = this.data.slice(0, rows);
        } else if(rows > this.data.length) {
            for(let i = this.data.length; i < rows; i++) {
                this.data.push(empty_row());
            }
        }
        for(let i = 0; i < rows; i++) {
            let row = this.data[i];
            if(columns < row.length) {
                row = row.slice(0, columns);
            } else if(columns > row.length) {
                for(let j = row.length; j < columns; j++) {
                    row.push(empty_cell());
                }
            }
            this.data[i] = row;
        }
        if (trigger_change_event) {
            this.trigger('data_change');
        }
    }

    static serializers: ISerializers = {
        ...DOMWidgetModel.serializers,
        cells: { deserialize: unpack_models },
        data: { deserialize: unpack_models }
    }

    data: any[][];
    _updating_grid: boolean;
};

// go from 2d array with objects to a 2d grid containing just attribute `attr` from those objects
function extract2d(grid, attr) {
    return map(grid, function(column) {
        return map(column, function(value) {
            return value[attr];
        });
    });
};

// inverse of above
function put_values2d(grid, values) {
    // TODO: the Math.min should not be needed, happens with the custom-build
    for(let i = 0; i < Math.min(grid.length, values.length); i++) {
        for(let j = 0; j < Math.min(grid[i].length, values[i].length); j++) {
            grid[i][j].value = values[i][j];
        }
    }
};

// calls the original renderer and then applies custom styling
(Handsontable.renderers as any).registerRenderer('styled', function customRenderer(hotInstance, td, row, column, prop, value, cellProperties) {
    let name = cellProperties.original_renderer || cellProperties.type || 'text';
    let original_renderer = (Handsontable.renderers as any).getRenderer(name);
    original_renderer.apply(this, arguments);
    each(cellProperties.style, function(value, key) {
        td.style[key] = value;
    });
});

export class SheetView extends DOMWidgetView {
    render() {
        // this.widget_view_promises = {}
        this.widget_views = {}
        this.el.classList.add("handsontable");
        this.el.classList.add("jupyter-widgets");
        this.table_container = document.createElement('div');
        this.el.appendChild(this.table_container);
        // promise used for unittesting
        this._table_constructed = this.displayed.then(async () => {
            this.hot = await this._build_table();
            this.model.on('data_change', this.on_data_change, this);
            this.model.on('change:column_headers change:row_headers', this._update_hot_settings, this);
            this.model.on('change:stretch_headers change:column_width', this._update_hot_settings, this);
            this.model.on('change:column_resizing change:row_resizing', this._update_hot_settings, this);
            this.model.on('change:search_token', this._search, this);
            this._search()
        });
    }

    processPhosphorMessage(msg) {
        // @ts-ignore: The following line can only compile with ipywidgets 7
        this._processLuminoMessage(msg, super.processPhosphorMessage);
    }

    processLuminoMessage(msg) {
        this._processLuminoMessage(msg, super.processLuminoMessage);
    }

    _processLuminoMessage(msg, _super) {
        _super.call(this, msg);
        switch (msg.type) {
        case 'resize':
        case 'after-show':
            this._table_constructed.then(() => {
                this.hot.render();
                // working around table not re-rendering fully upon resize.
                this.hot._refreshBorders(null);
            });
            break;
        }
    }

    async _build_widgets_views() {
        let data = this.model.data;
        let rows = data.length;
        let cols = data[0].length;
        let widget_view_promises = {}
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let idx = [row, col].join();
                if (data[row][col] && data[row][col].options['type'] == 'widget') {
                    let widget = data[row][col].value;
                    let previous_view = this.widget_views[idx];
                    if (previous_view) {
                        if(previous_view.model.cid == widget.cid) { // if this a proper comparison?
                            widget_view_promises[idx] = Promise.resolve(previous_view)
                        } else {
                            previous_view.remove()
                            previous_view = null;
                        }
                    }
                    if (!previous_view && widget) {
                        widget_view_promises[idx] = this.create_child_view(widget);
                    }
                }
            }
        }
        for (let key in this.widget_views) {
            if(this.widget_views.hasOwnProperty(key)) {
                // Ugly, this should be properly done
                let [row, col] = String(key).split(',').map(x => parseInt(x));
                let widget_view = this.widget_views[key];
                if(data[row][col] && data[row][col].value && data[row][col].value.cid == widget_view.model.cid) {
                    // good, the previous widget_view should be reused
                } else {
                    // we have a leftover view from the previous run
                    widget_view.remove();
                }
            }
        }
        this.widget_views = await resolvePromisesDict(widget_view_promises)
    }

    async _build_table() {
        await this._build_widgets_views()
        return new Handsontable(this.table_container, extend({
            data: this._get_cell_data(),
            rowHeaders: true,
            colHeaders: true,
            search: true,
            columnSorting: {
                sortEmptyCells: false,
                indicator: true,
                headerAction: true,
                compareFunctionFactory: this._compareFunctionFactory
            },
            cells: (row, col) => this._cell(row, col),
            afterChange: (changes, source) => { this._on_change(changes, source); },
            afterRemoveCol: (changes, source) => { this._on_change_grid(changes, source); },
            afterRemoveRow: (changes, source) => { this._on_change_grid(changes, source); }
        }, this._hot_settings()));
    }

    _compareFunctionFactory(sortOrder, columnMeta) {
        return function(value, nextValue) {
            let a, b;
            if (sortOrder == 'desc') {
                a = value;
                b = nextValue;
            } else {
                a = nextValue;
                b = value;
            }

            if (a instanceof WidgetModel) {
                a = a.get("value");
            }

            if (b instanceof WidgetModel) {
                b = b.get("value");
            }

            if (a == undefined || b == undefined) {
                return 0;
            }

            if (a < b) {
                return -1;
            }
            if (a > b) {
                return 1;
            }

            return 0;
        }
    }

    _update_hot_settings() {
        this.hot.updateSettings(this._hot_settings());
    }

    _hot_settings() {
        return {
            colHeaders: this.model.get('column_headers'),
            rowHeaders: this.model.get('row_headers'),
            stretchH: this.model.get('stretch_headers'),
            colWidths: this.model.get('column_width') || undefined,
            manualColumnResize: this.model.get('column_resizing'),
            manualRowResize: this.model.get('row_resizing')
        };
    }

    _search(render=true, ignore_empty_string=false) {
        let token = this.model.get('search_token');
        if (ignore_empty_string && token == '') {
            return;
        }

        this.hot.getPlugin('search').query(token);
        if (render) {
            this.hot.render();
        }
    }

    _get_cell_data() {
        return extract2d(this.model.data, 'value');
    }

    _cell(row, col) {
        let data = this.model.data;
        let cellProperties = cloneDeep(data[row][col].options);
        if(!((row < data.length) && (col < data[row].length))) {
            console.error('cell out of range');
        }
        if(cellProperties['type'] == null)
            delete cellProperties['type'];
        if(cellProperties['style'] == null)
            delete cellProperties['style'];
        if(cellProperties['source'] == null)
            delete cellProperties['source'];
        if('renderer' in cellProperties)
            cellProperties.original_renderer = cellProperties['renderer'];
        cellProperties.renderer = 'styled';
        if(this.widget_views[[row, col].join()]) {
            cellProperties.widget_view = this.widget_views[[row, col].join()]
        }
        return cellProperties;
    }

    _on_change_grid(changes, source) {
        let data = this.hot.getSourceDataArray();
        this.model.set({'rows': data.length, 'columns': data[0].length});
        this.model.save_changes();
    }

    _on_change(changes, source) {
        if(this.hot === undefined || source == 'loadData' || source == 'ObserveChanges.change') {
            return;
        }
        if(source == 'alter') {
            let data = this.hot.getSourceDataArray();
            this.model.set({'rows': data.length, 'columns': data[0].length});
            this.model.save_changes();
            return;
        }
        //this.hot.validateCells()
        //*
        //this.hot.validateCells(_.bind(function(valid){
        //    console.log('valid?', valid)
        //    if(valid) {
        let data = this.model.data;
        let value_data = this.hot.getSourceDataArray();
        put_values2d(data, value_data);
        this.model.trigger('data_change');
        //    }
        //}, this))
        /**/
    }

    on_data_change() {
        // we create a promise here such that the unittests can wait till the data is really set
        this._last_data_set = new Promise(async (resolve, reject) => {
            let data = extract2d(this.model.data, 'value');
            let rows = data.length;
            let cols = data[0].length;
            let rows_previous = this.hot.countRows();
            let cols_previous = this.hot.countCols();
            //*
            if(rows > rows_previous) {
                this.hot.alter('insert_row', rows-1, rows-rows_previous);
            }
            if(rows < this.hot.countRows()) {
                this.hot.alter('remove_row', rows-1, rows_previous-rows);
            }
            if(cols > cols_previous) {
                this.hot.alter('insert_col', cols-1, cols-cols_previous);
            }
            if(cols < cols_previous) {
                this.hot.alter('remove_col', cols-1, cols_previous-cols);
            }/**/
            await this._build_widgets_views()

            this.hot.loadData(data);
            // if headers are not shows, loadData will make them show again, toggling
            // will fix this (handsontable bug?)
            this.hot.updateSettings({colHeaders: true, rowHeaders: true});
            this.hot.updateSettings({
                colHeaders: this.model.get('column_headers'),
                rowHeaders: this.model.get('row_headers')
            });
            this._search(false, true);
            this.hot.render();
            resolve(undefined);
        })
    }

    set_cell(row, column, value) {
        this.hot.setDataAtCell(row, column, value);
    }

    get_cell(row, column) {
        return this.hot.getDataAtCell(row, column);
    }

    widget_views: any;
    hot: any;
    _last_data_set: any;
    table_container: any;
    _table_constructed: any;
    model: SheetModel;
};
