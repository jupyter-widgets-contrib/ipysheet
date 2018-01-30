ipysheet
===============================

Spreadsheet in the Jupyter notebook:
 
   * Try it out using binder: [![Binder](https://mybinder.org/badge.svg)](https://mybinder.org/v2/gh/QuantStack/ipysheet/master?filepath=docs%2Fsource%2Findex.ipynb)
   * Or check out the documentation at https://ipysheet.readthedocs.io/
   
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
