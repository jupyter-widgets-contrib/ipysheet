def transpose(list_of_lists):
    return [list(k) for k in zip(*list_of_lists)]


def adapt_value(value):
    # a pandas dataframe will hit this path first
    if hasattr(value, "to_numpy"):
        value = value.to_numpy()
    # a pandas series will hit this path
    if hasattr(value, "values"):
        import numpy as np
        value = np.array(value.values)
    # numpy arrays will hit this path
    if hasattr(value, "tolist"):
        value = value.tolist()
    return value


def extract_cell_data(cell, data):
    for row in range(cell.row_start, cell.row_end + 1):
        for col in range(cell.column_start, cell.column_end + 1):
            value = cell.value
            if cell.transpose:
                if not cell.squeeze_column:
                    value = value[col]
                if not cell.squeeze_row:
                    value = value[row]
            else:
                if not cell.squeeze_row:
                    value = value[row]
                if not cell.squeeze_column:
                    value = value[col]

            data[row][col]['value'] = value
            data[row][col]['options']['type'] = cell.type


def extract_data(sheet):
    data = []
    for _ in range(sheet.rows):
        data.append([
            {'value': None, 'options': {'type': type(None)}}
            for _ in range(sheet.columns)
        ])

    for cell in sheet.cells:
        extract_cell_data(cell, data)

    return data


def get_cell_type(dt):
    # TODO Differentiate integer and float? Using custom renderers and
    # validators for integers?
    # Add support for void type from NumPy?
    # See https://handsontable.com/docs/6.2.2/tutorial-cell-types.html
    return {
        'b': 'checkbox',
        'i': 'numeric',
        'u': 'numeric',
        'f': 'numeric',
        'm': 'numeric',
        'M': 'date',
        'S': 'text',
        'U': 'text'
    }.get(dt.kind, 'text')


def get_cell_numeric_format(dt):
    return {
        'i': '0[.]0',
        'f': '0.000',
    }.get(dt.kind)
