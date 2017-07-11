import ipywidgets as widgets
from traitlets import Unicode, CFloat, CInt, List, Instance, Union


@widgets.register('ipysheet.Sheet')
class Sheet(widgets.DOMWidget):
    """"""
    _view_name = Unicode('SheetView').tag(sync=True)
    _model_name = Unicode('SheetModel').tag(sync=True)
    _view_module = Unicode('ipysheet').tag(sync=True)
    _model_module = Unicode('ipysheet').tag(sync=True)
    _view_module_version = Unicode('^0.1.0').tag(sync=True)
    _model_module_version = Unicode('^0.1.0').tag(sync=True)
    value = Unicode('Sheet World!').tag(sync=True)
    rows =  CInt(3).tag(sync=True)
    columns =  CInt(4).tag(sync=True)
    data = List(Instance(list), [[]]).tag(sync=True)
