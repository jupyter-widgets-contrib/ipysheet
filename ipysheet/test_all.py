import ipysheet
import pytest

def test_current_sheet():
    sheet1 = ipysheet.sheet()
    assert sheet1 is ipysheet.current()
    sheet2 = ipysheet.sheet()
    assert sheet2 is ipysheet.current()
    assert sheet1 is ipysheet.sheet(sheet1)
    assert sheet1 is ipysheet.current()

    sheet3 = ipysheet.sheet('key3')
    assert sheet3 is ipysheet.current()
    sheet4 = ipysheet.sheet('key4')
    assert sheet4 is ipysheet.current()
    assert sheet3 is ipysheet.sheet('key3')
    assert sheet3 is ipysheet.current()
    assert sheet4 is ipysheet.sheet('key4')
    assert sheet4 is ipysheet.current()

def test_cell_add():
    sheet1 = ipysheet.sheet()
    sheet2 = ipysheet.sheet()
    cell2a = ipysheet.cell(0, 0, value='1')
    assert len(sheet1.cells) == 0
    assert len(sheet2.cells) == 1
    ipysheet.sheet(sheet1)
    cell1a = ipysheet.cell(0, 0, value='2')
    cell1b = ipysheet.cell(0, 1, value='2')
    assert len(sheet1.cells) == 2
    assert len(sheet2.cells) == 1

    with ipysheet.hold_cells():
        cell1c = ipysheet.cell(1, 0, value='3')
        cell1d = ipysheet.cell(1, 1, value='4')
        assert len(sheet1.cells) == 2
        assert len(sheet2.cells) == 1
    assert len(sheet1.cells) == 4
    assert len(sheet2.cells) == 1

