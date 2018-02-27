import ipywidgets as widgets
from traitlets import Unicode
import ipysheet

@widgets.register
class PricerHybridSheet(ipysheet.Sheet):
    """An example widget."""
    _view_name = Unicode('PricerHybridSheetView').tag(sync=True)
    _model_name = Unicode('PricerHybridSheetModel').tag(sync=True)
    _view_module = Unicode('jupyter-widget-pricer-hybrid').tag(sync=True)
    _model_module = Unicode('jupyter-widget-pricer-hybrid').tag(sync=True)
    _view_module_version = Unicode('^0.1.0').tag(sync=True)
    _model_module_version = Unicode('^0.1.0').tag(sync=True)
