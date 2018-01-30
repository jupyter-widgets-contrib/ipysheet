import ipywidgets as widgets
from traitlets import Unicode, CFloat, CInt, List, Tuple, Instance, Union, Dict, Bool, Float, Int

import ipyvolume._version
semver_range_frontend = "~" + ipyvolume._version.__version_js__

@widgets.register('ipysheet.Cell')
class Cell(widgets.Widget):
    _model_name = Unicode('CellModel').tag(sync=True)
    _model_module = Unicode('ipysheet').tag(sync=True)
    #_view_module_version = Unicode('^0.1.0').tag(sync=True)
    _model_module_version = Unicode(semver_range_frontend).tag(sync=True)
    value = Union([Bool(), Unicode(), Float(), Int()], allow_none=True, default_value=None).tag(sync=True)
    row =  CInt(3).tag(sync=True)
    column =  CInt(4).tag(sync=True)
    type = Unicode('text').tag(sync=True)
    name = Unicode(None, allow_none=True).tag(sync=True)
    style = Dict({}).tag(sync=True)
    renderer = Unicode(None, allow_none=True).tag(sync=True)
    read_only = Bool(False).tag(sync=True)
    choice = List(Unicode(), allow_none=True, default_value=None).tag(sync=True)
    format = Unicode('0.[000]', allow_none=True).tag(sync=True)

# Bug in traitlets, it doesn't set it, which triggers the bug fixed here:
# https://github.com/jupyter-widgets/ipywidgets/pull/1675
# which is not released yet (7.0.2 should have it)
Cell.choice.default_value = None

@widgets.register('ipysheet.Range')
class Range(widgets.Widget):
    value = Union([List(), List(Instance(list))], default_value=[0, 1]).tag(sync=True)

@widgets.register('ipysheet.Sheet')
class Sheet(widgets.DOMWidget):
    """"""
    _view_name = Unicode('SheetView').tag(sync=True)
    _model_name = Unicode('SheetModel').tag(sync=True)
    _view_module = Unicode('ipysheet').tag(sync=True)
    _model_module = Unicode('ipysheet').tag(sync=True)
    _view_module_version = Unicode(semver_range_frontend).tag(sync=True)
    _model_module_version = Unicode(semver_range_frontend).tag(sync=True)
    rows =  CInt(3).tag(sync=True)
    columns =  CInt(4).tag(sync=True)
    data = List(Instance(list), [[]]).tag(sync=True)
    cells = Tuple().tag(sync=True, **widgets.widget_serialization)
    named_cells = Dict(value={}, allow_none=False).tag(sync=True, **widgets.widget_serialization)
    row_headers = Union([Bool(), List(Unicode())], default_value=True).tag(sync=True)
    column_headers = Union([Bool(), List(Unicode())], default_value=True).tag(sync=True)
    stretch_headers = Unicode('all').tag(sync=True)
    column_width = Union([CInt(), List(CInt())], default_value=None, allow_none=True).tag(sync=True)

    def __getitem__(self, item):
        '''Gets a previously created cell at row and column

        Example:

        >>> sheet = ipysheet.sheet(rows=10, columns=5)
        >>> cell = ipysheet.cell(2,0, value='hello')
        >>> assert sheet[2,0] is cell
        >>> sheet[2,0].value = 'bonjour'

        '''
        row, column = item
        for cell in self.cells:
            if cell.row == row and cell.column == column:
                return cell
        raise IndexError('no cell was previously created for (row, index) = (%s, %s)'.format(row, column))
