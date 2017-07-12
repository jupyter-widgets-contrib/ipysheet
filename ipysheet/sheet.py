import ipywidgets as widgets
from traitlets import Unicode, CFloat, CInt, List, Instance, Union, Dict, Bool


@widgets.register('ipysheet.Cell')
class Cell(widgets.Widget):
    _model_name = Unicode('CellModel').tag(sync=True)
    _model_module = Unicode('ipysheet').tag(sync=True)
    _view_module_version = Unicode('^0.1.0').tag(sync=True)
    _model_module_version = Unicode('^0.1.0').tag(sync=True)
    value = Union([CFloat(), Unicode()], allow_none=True, value=None).tag(sync=True)
    row =  CInt(3).tag(sync=True)
    column =  CInt(4).tag(sync=True)
    type = Unicode('text').tag(sync=True)
    style = Dict({}).tag(sync=True)
    renderer = Unicode(None, allow_none=True).tag(sync=True)

@widgets.register('ipysheet.Range')
class Range(widgets.Widget):
    value = Union([List(), List(Instance(list))], value=[0, 1]).tag(sync=True)

@widgets.register('ipysheet.Sheet')
class Sheet(widgets.DOMWidget):
    """"""
    _view_name = Unicode('SheetView').tag(sync=True)
    _model_name = Unicode('SheetModel').tag(sync=True)
    _view_module = Unicode('ipysheet').tag(sync=True)
    _model_module = Unicode('ipysheet').tag(sync=True)
    _view_module_version = Unicode('^0.1.0').tag(sync=True)
    _model_module_version = Unicode('^0.1.0').tag(sync=True)
    rows =  CInt(3).tag(sync=True)
    columns =  CInt(4).tag(sync=True)
    data = List(Instance(list), [[]]).tag(sync=True)
    cells = List(Instance(Cell), [], allow_none=False).tag(sync=True, **widgets.widget_serialization)
    row_headers = Union([Bool(), List(Unicode)], value=True).tag(sync=True)
    column_headers = Union([Bool(), List(Unicode)], value=True).tag(sync=True)
    stretch_headers = Unicode('all').tag(sync=True)
    column_width = Union([CInt(), List(CInt)], value=None, allow_none=True).tag(sync=True)
