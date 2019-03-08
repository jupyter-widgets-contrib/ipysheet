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
