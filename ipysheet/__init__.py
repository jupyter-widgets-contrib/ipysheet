from ._version import version_info, __version__

from .sheet import *
from .easy import *
def _jupyter_nbextension_paths():
    return [{
        'section': 'notebook',
        'src': 'static',
        'dest': 'ipysheet',
        'require': 'ipysheet/extension'
    }]
