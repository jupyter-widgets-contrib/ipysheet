# ipysheet

# WARNING

Due to [Handsontable licensing changes](https://handsontable.com/blog/articles/2019/3/handsontable-drops-open-source-for-a-non-commercial-license) ipysheet is stuck witch the outdated Handsontable version 6.2.2 (open-source).
We recommend not using ipysheet anymore. We suggest an alternative like [ipydatagrid](https://github.com/bloomberg/ipydatagrid).

Spreadsheet in the Jupyter notebook:

   * Try it out using binder: [![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/QuantStack/ipysheet/stable?filepath=docs%2Fsource%2Findex.ipynb)
   * Or check out the documentation at [https://ipysheet.readthedocs.io/](https://ipysheet.readthedocs.io/en/stable/)

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

### Development install

Note: You will need NodeJS to build the extension package.

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
# Change directory to the ipysheet directory
# Install package in development mode
pip install -e .
# Link your development version of the extension with JupyterLab
jupyter labextension develop . --overwrite
# Rebuild extension Typescript source after making changes
jlpm run build
```

You can watch the source directory and run JupyterLab at the same time in different terminals to watch for changes in the extension's source and automatically rebuild the extension.

```bash
# Watch the source directory in one terminal, automatically rebuilding when needed
jlpm run watch
# Run JupyterLab in another terminal
jupyter lab
```

With the watch command running, every saved change will immediately be built locally and available in your running JupyterLab. Refresh JupyterLab to load the change in your browser (you may need to wait several seconds for the extension to be rebuilt).

By default, the `jlpm run build` command generates the source maps for this extension to make it easier to debug using the browser dev tools. To also generate source maps for the JupyterLab core extensions, you can run the following command:

```bash
jupyter lab build --minimize=False
```

### Development uninstall

```bash
pip uninstall ipysheet
```

In development mode, you will also need to remove the symlink created by `jupyter labextension develop`
command. To find its location, you can run `jupyter labextension list` to figure out where the `labextensions`
folder is located. Then you can remove the symlink named `ipysheet` within that folder.
