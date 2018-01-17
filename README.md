ipysheet
===============================

Spreadsheet in the Jupyter notebook

Installation
------------

To install use pip:

    $ pip install ipysheet
    $ jupyter nbextension enable --py --sys-prefix ipysheet  # can be skipped for notebook version 5.3 and above


For a development installation (requires npm),

    $ git clone https://github.com/QuantStack/ipysheet.git
    $ cd ipysheet
    $ pip install -e .
    $ jupyter nbextension install --py --symlink --sys-prefix ipysheet
    $ jupyter nbextension enable --py --sys-prefix ipysheet  # can be skipped for notebook version 5.3 and above
