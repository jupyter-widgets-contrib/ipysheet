__all__ = ['sheet', 'cell', 'calculation', 'row', 'hold_cells']
import copy
import numbers

import ipywidgets as widgets
from .sheet import *
_last_sheet = None
_hold_cells = False # when try (using hold_cells() it does not add cells directly)
_cells = [] # cells that aren't added directly

def sheet(rows=5, columns=5, column_width=None, row_headers=True, column_headers=True,
        stretch_headers='all', **kwargs):
    global _last_sheet
    _last_sheet = Sheet(rows=rows, columns=columns, column_width=column_width,
    row_headers=row_headers, column_headers=column_headers,
    stretch_headers=stretch_headers, **kwargs)
    return _last_sheet

def cell(row, column, value=0., type=None, color=None, backgroundColor=None,
    fontStyle=None, fontWeight=None, style=None, label_left=None, choice=None,
    read_only=False, format='0.[000]', renderer=None):
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
    c = Cell(value=value, row=row, column=column, type=type, style=style,
        read_only=read_only, choice=choice, renderer=renderer, format=format)
    if _hold_cells:
        print("holding cells")
        _cells.append(c)
    else:
        _last_sheet.cells = _last_sheet.cells+[c]
    if label_left:
        assert column-1 >= 0, "cannot put label to the left"
        cell(row, column-1, value=label_left, fontWeight='bold')
    return c

def row(row, value, column_start=0, column_end=None):
    if column_end is None:
        column_end = column_start+len(value)
    length = column_end - column_start
    assert length == len(value), "length or array doesn't match index"
    cellrange = Range(value=value)
    column_indices = range(column_start, column_end)
    cells = [cell(row, i, value[i-column_start]) for i in column_indices]
    for i, cell_offset in zip(column_indices, cells):
        def set(*ignore, cell_offset=cell_offset, column=i):
            offset = column - column_start
            value = copy.deepcopy(cellrange.value)
            print("setting array offset", offset, "with", value, cell_offset.value)
            value[offset] = cell_offset.value
            cellrange.value = value
        cell_offset.observe(set, 'value')
    def set(*ignore):
        print("copying cells to array")
        value = cellrange.value
        for i, cell_offset in enumerate(cells):
            cell_offset.value = value[i]
    cellrange.observe(set)
    return cellrange


def _assign(object, value):
    if isinstance(object, widgets.Widget):
        object, trait = object, 'value'
    else:
        object, trait = object
    setattr(object, trait, value)
def calculation(inputs, output, initial_calulation=True):
    def decorator(f):
        def calculate(*ignore_args):
            values = [getattr(input, 'value') for input in inputs]
            result = f(*values)
            _assign(output, result)
        for input in inputs:
            input.observe(calculate, 'value')
        if initial_calulation:
            calculate()
    return decorator

from contextlib import contextmanager
@contextmanager
def hold_cells():
    """Hold adding any cell widgets until done"""
    global _hold_cells
    global _cells
    if _hold_cells is True:
        yield
    else:
        try:
            _hold_cells = True
            yield
        finally:
            print("flushing cells")
            _hold_cells = False
            _last_sheet.cells = _last_sheet.cells+_cells
            _cells = []
