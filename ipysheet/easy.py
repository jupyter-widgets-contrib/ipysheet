__all__ = ['sheet', 'cell', 'calculation']
import numbers
from .sheet import *
_last_sheet = None

def sheet(rows=5, columns=5, column_width=None, row_headers=True, column_headers=True,
        stretch_headers='all', **kwargs):
    global _last_sheet
    _last_sheet = Sheet(rows=rows, columns=columns, column_width=column_width,
    row_headers=row_headers, column_headers=column_headers, **kwargs)
    return _last_sheet

def cell(row, column, value=0., type=None, color=None, backgroundColor=None, fontStyle=None, fontWeight=None, style=None):
    if type is None:
        if isinstance(value, numbers.Number):
            type = 'numeric'
        else:
            type = 'text'
    style = style or {}
    if color is not None:
        style['color'] = color
    if backgroundColor is not None:
        style['backgroundColor'] = backgroundColor
    if fontStyle is not None:
        style['fontStyle'] = fontStyle
    if fontWeight is not None:
        style['fontWeight'] = fontWeight
    cell = Cell(value=value, row=row, column=column, type=type, style=style)
    _last_sheet.cells = _last_sheet.cells+[cell]
    return cell


def calculation(inputs, output, initial_calulation=True):
    def decorator(f):
        def calculate(*ignore_args):
            values = [getattr(input, 'value') for input in inputs]
            result = f(*values)
            setattr(output, 'value', result)
        for input in inputs:
            input.observe(calculate, 'value')
        if initial_calulation:
            calculate()
    return decorator
