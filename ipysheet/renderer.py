
def _jupyter_nbextension_paths():
    return [{
        'section': 'notebook',
        'src': 'static',
        'dest': 'ipysheet-renderer',
        'require': 'ipysheet/extension-renderer'
    }]
