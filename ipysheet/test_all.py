import ipysheet
import pytest
from ipysheet.easy import _transpose

def test_transpose():
    assert _transpose([[1, 2]]) == [[1], [2]]
    assert _transpose([[1, 2], [3, 4]]) == [[1,3], [2, 4]]
    assert _transpose([[1], [2]]) == [[1, 2]]

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

def test_calculation():
    sheet = ipysheet.sheet()
    a = ipysheet.cell(0, 0, value=1)
    b = ipysheet.cell(0, 0, value=2)
    c = ipysheet.cell(0, 0, value=0)
    @ipysheet.calculation(inputs=[a, b], output=c)
    def add(a, b):
        return a + b
    assert c.value == 3
    a.value = 10
    assert c.value == 10+2
    b.value = 20
    assert c.value == 10+20

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
    ipysheet.row(0, [0, 1, 2], column_end=2)
    ipysheet.row(0, [0, 1, 2], column_start=1)
    with pytest.raises(ValueError):
        ipysheet.row(0, [0, 1, 2, 4, 5])
    with pytest.raises(ValueError):
        ipysheet.row(0, [0, 1], column_end=3)
    with pytest.raises(ValueError):
        ipysheet.row(0, [0, 1, 2, 4], column_start=1)
    
    row = ipysheet.row(0, [0, 1, 2, 3])
    with pytest.raises(ValueError):
        row.value = [0, 1, 2]
    with pytest.raises(ValueError):
        row.value = 1
    row.value = [0, 1, 2, 4]
    assert row.value == [0, 1, 2, 4]

    ipysheet.column(0, [0, 1, 2])
    ipysheet.column(0, [0, 1])
    ipysheet.column(0, [0, 1], row_end=1)
    ipysheet.column(0, [0, 1], row_start=1)
    with pytest.raises(ValueError):
        ipysheet.column(0, [0, 1, 2, 3])
    with pytest.raises(ValueError):
        ipysheet.column(0, [0, 1], row_end=0)
    with pytest.raises(ValueError):
        ipysheet.column(0, [0, 1, 2, 4], row_start=1)

    col = ipysheet.column(0, [0, 1, 2])
    with pytest.raises(ValueError):
        col.value = [0, 1]
    with pytest.raises(ValueError):
        col.value = 1
    col.value = [0, 1, 3]
    assert col.value == [0, 1, 3]


def test_cell_range():
    sheet = ipysheet.sheet(rows=3, columns=4)
    # [row][column]
    ipysheet.cell_range([[0, 1]]) # 1 row, 2 columns
    ipysheet.cell_range([[0], [2]]) # 2 rows, 1 columns
    ipysheet.cell_range([[0, 1], [2, 3]]) # 2 rows, 2 columns
    ipysheet.cell_range([[0, 1], [2, 3], [4, 5]]) # 3 rows, 2 columns
    ipysheet.cell_range([[0, 1, 9], [2, 3, 9], [4, 5, 9]]) # 3 rows, 3 columns
    ipysheet.cell_range([[0, 1, 9]], column_end=2) # 3 rows, 3 columns
    ipysheet.cell_range([[0, 1, 9]], column_start=1) # 1 rows, 3 columns
    with pytest.raises(ValueError):
        ipysheet.cell_range([[0, 1], [2, 3], [4, 5], [6, 7]]) # 4 rows, 2 columns
    with pytest.raises(ValueError):
        ipysheet.cell_range([[0, 1, 2, 3, 4], [2, 3, 4, 5, 6], [3, 4, 5, 6, 7]]) # 3 rows, 5 columns
    with pytest.raises(ValueError):
        ipysheet.cell_range([[0, 1, 2, 3, 4], [2], [3, 4, 5, 6, 7]]) # not well shaped
    with pytest.raises(ValueError):
        ipysheet.cell_range([]) # empty rows
    with pytest.raises(ValueError):
        ipysheet.cell_range([[], []]) # empty columns


    value = [[0, 1], [2, 3], [4, 5]]
    valueT = [[0, 2, 4], [1, 3, 5]] # it's transpose
    assert value == _transpose(valueT)
    r = ipysheet.cell_range(value) # 3 rows, 2 columns
    with pytest.raises(ValueError):
        r.value = 1
    with pytest.raises(ValueError):
        r.value = [1, 2, 3]
    with pytest.raises(ValueError):
        r.value = [[1, 2]]
    assert r.value == _transpose(valueT)



    rT = ipysheet.cell_range(valueT, transpose=True) # 3 rows, 2 columns
    with pytest.raises(ValueError):
        rT.value = 1
    with pytest.raises(ValueError):
        rT.value = [1, 2, 3]
    with pytest.raises(ValueError):
        rT.value = [[1, 2]]
    rT.value = _transpose(value)
    assert rT.value == _transpose(value)


    # sheet = ipysheet.sheet(rows=3, columns=4)
    # range1, cells = ipysheet.cell_range([[0, 1], [2, 3]], return_cells=True)
    # assert range1.value == [[0, 1], [2, 3]]

    # sheet = ipysheet.sheet(rows=3, columns=4)
    # range1, cells = ipysheet.cell_range([[0, 1], [2, 3]], return_cells=True)
    # cells[1][0].value = 99
    # assert range1.value == [[0, 1], [99, 3]]
    # print('now we reset it')
    # range1.value = [[0, 1], [2, 8]]
    # print('now we reset it...')
    # assert cells[1][0].value == 2

    # sheet = ipysheet.sheet(rows=3, columns=4)
    # range2, cells = ipysheet.cell_range([[0, 1], [2, 3]], return_cells=True, transpose=True)
    # cells[1][0].value = 99
    # assert range2.value == [[0, 99], [1, 3]]
    # range2.value = [[0, 1], [2, 3]]
    # assert cells[1][0].value == 2

    # sheet = ipysheet.sheet(rows=2, columns=1)
    # range2 = ipysheet.cell_range([[0, 1]], transpose=True)
    # #range2.

    # sheet = ipysheet.sheet(rows=1, columns=2)
    # range2 = ipysheet.cell_range([[0], [2]], transpose=True)



def test_cell_values():
    cell = ipysheet.cell(0, 0, value=True)
    assert cell.value is True
    assert cell.type == 'checkbox'

    cell = ipysheet.cell(0, 0, value=1.2)
    assert cell.value == 1.2
    assert cell.type == 'numeric'
    cell = ipysheet.cell(0, 0, value=1)
    assert cell.value == 1
    assert cell.type == 'numeric'

    cell = ipysheet.Cell(value='1.2')
    assert cell.value == '1.2'
    assert cell.type == None


    cell = ipysheet.row(0, [True, False])
    assert cell.value == [True, False]
    assert cell.type == 'checkbox'

    cell = ipysheet.row(0, [0, 1.2])
    assert cell.value == [0, 1.2]
    assert cell.type == 'numeric'
    
    cell = ipysheet.row(0, [0, 1])
    assert cell.value == [0, 1]
    assert cell.type == 'numeric'

    cell = ipysheet.row(0, ['a', 'b'])
    assert cell.value == ['a', 'b']
    assert cell.type == 'text'


    cell = ipysheet.row(0, [True, 0])
    assert cell.type == 'numeric'

    cell = ipysheet.row(0, [True, 'bla'])
    assert cell.type == None

def test_renderer():
    ipysheet.sheet()
    renderer = ipysheet.renderer('code', 'name')
    assert renderer.code == 'code'
    assert renderer.name == 'name'
    def f(x):
        somefunction(x)
    renderer = ipysheet.renderer(f, 'name2')
    assert "somefunction" in renderer.code
    assert renderer.name == 'name2'

