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

def test_getitem():
    sheet = ipysheet.sheet()
    cell00 = ipysheet.cell(0, 0, value='0_0')
    cell10 = ipysheet.cell(1, 0, value='1_0')
    cell21 = ipysheet.cell(2, 1, value='2_1')
    assert sheet[0,0] is cell00
    assert sheet[1,0] is cell10
    assert sheet[2,1] is cell21
    with pytest.raises(IndexError):
        sheet[1,1]
    # TODO: what do we do with copies.. ? now we return the first values
    cell00_copy = ipysheet.cell(0, 0, value='0_0')
    assert sheet[0,0] is cell00

def test_row_and_column():
    sheet = ipysheet.sheet(rows=3, columns=4)
    ipysheet.row(0, [0, 1, 2, 3])
    ipysheet.row(0, [0, 1, 2])
    ipysheet.row(0, [0, 1, 2], column_end=3)
    ipysheet.row(0, [0, 1, 2], column_start=1)
    with pytest.raises(ValueError):
        ipysheet.row(0, [0, 1, 2, 4, 5])
    with pytest.raises(ValueError):
        ipysheet.row(0, [0, 1], column_end=3)
    with pytest.raises(ValueError):
        ipysheet.row(0, [0, 1, 2, 4], column_start=1)


    ipysheet.column(0, [0, 1, 2])
    ipysheet.column(0, [0, 1])
    ipysheet.column(0, [0, 1], row_end=2)
    ipysheet.column(0, [0, 1], row_start=1)
    with pytest.raises(ValueError):
        ipysheet.column(0, [0, 1, 2, 3])
    with pytest.raises(ValueError):
        ipysheet.column(0, [0, 1], row_end=1)
    with pytest.raises(ValueError):
        ipysheet.column(0, [0, 1, 2, 4], row_start=1)

def test_cell_values():
    cell = ipysheet.Cell(value=True)
    assert cell.value is True
    cell = ipysheet.Cell(value=1.2)
    assert cell.value == 1.2
    cell = ipysheet.Cell(value='1.2')
    assert cell.value == '1.2'

