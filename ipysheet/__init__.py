
import json
from pathlib import Path

from ._version import __version__
from .sheet import Cell, Range, Sheet, Renderer
from .easy import *
from .pandas_loader import from_dataframe, to_dataframe
from .numpy_loader import from_array, to_array

HERE = Path(__file__).parent.resolve()

with (HERE / "labextension" / "package.json").open() as fid:
    data = json.load(fid)


def _jupyter_nbextension_paths():
    return [{
        'section': 'notebook',
        'src': 'static',
        'dest': 'ipysheet',
        'require': 'ipysheet/extension'
    }]


def _jupyter_labextension_paths():
    return [{
        "section": "notebook",
        "src": "labextension",
        "dest": data["name"],
        "require": "ipysheet/extension"
    }]

