__all__ = ["sheet"]
from .sheet import *
_last_sheet = None

def sheet(rows=5, columns=5):
    global _last_sheet
    _last_sheet = Sheet(rows=rows, columns=columns)
    return _last_sheet
