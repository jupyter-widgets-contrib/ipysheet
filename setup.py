"""
ipysheet setup
"""
import os
import json
from pathlib import Path

import setuptools

from jupyter_packaging import (
    create_cmdclass,
    install_npm,
    ensure_targets,
    combine_commands,
    skip_if_exists
)

HERE = Path(__file__).parent.resolve()

# The name of the project
name = "ipysheet"

nb_path = (HERE / name / "static")
lab_path = (HERE / name / "labextension")

# Representative files that should exist after a successful build
ensured_targets = [
    str(lab_path / "package.json"),
    str(lab_path / "static/style.js")
]

data_files_spec = [
    ('share/jupyter/nbextensions/ipysheet', str(nb_path), '**'),
    ("share/jupyter/labextensions/ipysheet", str(lab_path), "**"),
    ("share/jupyter/labextensions/ipysheet", str(HERE), "install.json"),
    ('etc/jupyter/nbconfig/notebook.d', str(HERE), 'ipysheet.json')
]

long_description = (HERE / "README.md").read_text()

# Get the package info from package.json
pkg_json = json.loads((HERE / "package.json").read_bytes())

cmdclass = create_cmdclass('jsdeps', data_files_spec=data_files_spec)
js_command = combine_commands(
    install_npm(str(HERE), npm=["yarn"], build_cmd='build:extensions'),
    ensure_targets(ensured_targets),
)

is_repo = os.path.exists(str(HERE / '.git'))
if is_repo:
    cmdclass['jsdeps'] = js_command
else:
    cmdclass['jsdeps'] = skip_if_exists(ensured_targets, js_command)

setup_args = dict(
    name=name,
    version=pkg_json["version"],
    url=pkg_json["homepage"],
    author=pkg_json["author"]["name"],
    author_email=pkg_json["author"]["email"],
    description=pkg_json["description"],
    license=pkg_json["license"],
    long_description=long_description,
    long_description_content_type="text/markdown",
    packages=setuptools.find_packages(),
    cmdclass=cmdclass,
    install_requires=[
        "jupyter_server>=1.6,<2",
        "ipywidgets>=7.5.0,<8.0",
    ],
    zip_safe=False,
    include_package_data=True,
    python_requires=">=3.6",
    platforms="Linux, Mac OS X, Windows",
    keywords=["Jupyter", "JupyterLab", "JupyterLab3"],
    classifiers=[
        "License :: OSI Approved :: BSD License",
        "Programming Language :: Python",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Framework :: Jupyter",
    ],
)

if __name__ == "__main__":
    setuptools.setup(**setup_args)
