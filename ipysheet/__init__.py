from ._version import version_info, __version__
from .sheet import Cell, Range, Sheet, Renderer
from .easy import *
from .pandas_loader import from_dataframe, to_dataframe
from .numpy_loader import from_array, to_array


def _prefix():
    import sys
    from pathlib import Path
    prefix = sys.prefix
    here = Path(__file__).parent
    # for when in dev mode
    if (here.parent / 'share/jupyter/nbextensions/ipysheet').exists():
        prefix = here.parent
    return prefix


def _jupyter_labextension_paths():
    return [{
        'src': f'{_prefix()}/share/jupyter/labextensions/ipysheet/',
        'dest': 'ipysheet',
    }]


def _jupyter_nbextension_paths():
    return [{
        'section': 'notebook',
        'src': f'{_prefix()}/share/jupyter/nbextensions/ipysheet/',
        'dest': 'ipysheet',
        'require': 'ipysheet/extension'
    }]
    
