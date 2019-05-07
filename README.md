# ipysheet

Spreadsheet in the Jupyter notebook:

   * Try it out using binder: [![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/QuantStack/ipysheet/stable?filepath=docs%2Fsource%2Findex.ipynb)
   * Or check out the documentation at https://ipysheet.readthedocs.io/

**Create a table and drive a value using ipywidgets:**

![Slider Screencast](docs/source/ipysheet_slider.gif)

**Perform a calculation on slider change:**

![Slider Calculation Screencast](docs/source/ipysheet_slider_calculation.gif)

**Change cell style depending on the value using renderers:**

![Conditional formatting](docs/source/conditional_formatting.png)

**Populate table using cell ranges:**

![Cell Ranges Screencast](docs/source/ipysheet_cell_range.gif)

# Installation

With conda:

```
$ conda install -c conda-forge ipysheet
```

With pip:

```
$ pip install ipysheet
```

To make it work for Jupyter lab:
```
$ jupyter labextension install ipysheet
```

If you have notebook 5.2 or below, you also need to execute:
```
$ jupyter nbextension enable --py --sys-prefix ipysheet
```

For a development installation (requires npm),

```
$ git clone https://github.com/QuantStack/ipysheet.git
$ cd ipysheet
$ pip install -e .
$ jupyter nbextension install --py --symlink --sys-prefix ipysheet
$ jupyter nbextension enable --py --sys-prefix ipysheet
$ jupyter labextension link js
```

For Jupyter lab development, you may want to start Jupyter lab with `jupyter lab --watch` so it instantly picks up changes.
