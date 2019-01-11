# ipysheet

Spreadsheet in the Jupyter notebook:
 
   * Try it out using binder: [![Binder](https://mybinder.org/badge.svg)](https://mybinder.org/v2/gh/QuantStack/ipysheet/master?filepath=docs%2Fsource%2Findex.ipynb)
   * Or check out the documentation at https://ipysheet.readthedocs.io/
   
# Installation

To install use pip:

```
$ pip install ipysheet
```

To make it work for Jupyter lab:
```
$ jupyter labextension ipysheet
```

If you have notebook 5.2 or below, you also need to execute:
```
$ jupyter nbextension enable --py --sys-prefix ipysheet
$ jupyter nbextension enable --py --sys-prefix ipysheet.renderer_nbext
```


For a development installation (requires npm),

```
$ git clone https://github.com/QuantStack/ipysheet.git
$ cd ipysheet
$ pip install -e .
$ jupyter nbextension install --py --symlink --sys-prefix ipysheet
$ jupyter nbextension enable --py --sys-prefix ipysheet
$ jupyter nbextension enable --py --sys-prefix ipysheet.renderer_nbext
$ jupyter labextension link js
```

For Jupyter lab development, you may want to start Jupyter lab with `jupyter lab --watch` so it instantly picks up changes.

# Security

*If you are a regular Jupyter notebook or lab user you can ignore this section, it is only relevant is shared multiusers environment, like with Jupyter hub.*

ipysheet contains a part (the Renderer widget) that will allow arbitrary Javascript injection from a user into a webpage that contains the notebook. In situation where notebooks are shared, this can lead to security issues. If you want to disable this, run for the Jupyter notebook and Jupyter lab respectively:

```
$ jupyter nbextension disable --py --sys-prefix ipysheet.renderer_nbext
$ jupyter labextension disable ipysheet:renderer # for jupyter lab
```
