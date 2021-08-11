export
async function make_view() {
    const options = { model: this.sheet, output: {handle_output: () => {}, handle_clear_output: () => {}}};
    const view = await this.manager.create_view(this.sheet, options); //new ipysheet.SheetView(options);
    await this.manager.display_view(undefined, view);
    return view;
}

export
async function wait_validate(view) {
    return new Promise(function(resolve, reject) {
        view.hot.validateCells(function(valid) {
            //console.log('waited for validate,', valid)
            resolve(valid)
        })
    })
}

export
async function make_cell(options, skip_add) {
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
