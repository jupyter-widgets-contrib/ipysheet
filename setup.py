from __future__ import print_function
from setuptools import setup, find_packages, Command
from setuptools.command.sdist import sdist
from setuptools.command.build_py import build_py
from setuptools.command.egg_info import egg_info
from subprocess import check_call
import os
import sys
from distutils import log
from os.path import join as pjoin
from pathlib import Path

from jupyter_packaging import (
    create_cmdclass,
    install_npm,
    ensure_targets,
    combine_commands,
    get_version,
)


here = os.path.dirname(os.path.abspath(__file__))
name = "ipysheet"
node_root = os.path.join(here, 'js')
is_repo = os.path.exists(os.path.join(here, '.git'))


log.set_verbosity(log.DEBUG)
log.info('setup.py entered')
log.info('$PATH=%s' % os.environ['PATH'])

LONG_DESCRIPTION = 'Spreadsheet in the Jupyter notebook'

version = get_version(pjoin(name, '_version.py'))
js_dir = pjoin(here, 'js')
jstargets = [
    pjoin(js_dir, 'lib', 'index.js'),
    pjoin('share', 'jupyter', 'nbextensions', 'ipysheet', 'index.js'),
]
data_files_spec = [
    ('share/jupyter/nbextensions/ipysheet', 'share/jupyter/nbextensions/ipysheet', '*.js'),
    ('share/jupyter/labextensions/ipysheet', 'share/jupyter/labextensions/ipysheet', '*'),
    ('share/jupyter/labextensions/ipysheet/static', 'share/jupyter/labextensions/ipysheet/static', '*'),
    ('etc/jupyter/nbconfig/notebook.d', 'etc/jupyter/nbconfig/notebook.d', 'ipysheet.json'),
]

js_command = combine_commands(
    install_npm(js_dir, build_cmd='build'), ensure_targets(jstargets),
)

cmdclass = create_cmdclass('jsdeps', data_files_spec=data_files_spec)
is_repo = os.path.exists(os.path.join(here, '.git'))
if is_repo:
    cmdclass['jsdeps'] = js_command
else:
    cmdclass['jsdeps'] = skip_if_exists(jstargets, js_command)

    
version_ns = {}
with open(os.path.join(here, 'ipysheet', '_version.py')) as f:
    exec(f.read(), {}, version_ns)

setup_args = {
    'name': 'ipysheet',
    'license': 'MIT License',
    'version': version_ns['__version__'],
    'description': 'Spreadsheet in the Jupyter notebook',
    'long_description': LONG_DESCRIPTION,
    'include_package_data': True,
    'install_requires': [
        'ipywidgets>=7.5.0,<8.0',
    ],
    'packages': find_packages(),
    'zip_safe': False,
    'cmdclass': cmdclass,

    'author': 'Maarten A. Breddels',
    'author_email': 'maartenbreddels@gmail.com',
    'url': 'http://jupyter.org',
    'keywords': [
        'ipython',
        'jupyter',
        'widgets',
    ],
    'classifiers': [
        'Development Status :: 4 - Beta',
        'Framework :: IPython',
        'Intended Audience :: Developers',
        'Intended Audience :: Science/Research',
        'Topic :: Multimedia :: Graphics',
        'Programming Language :: Python :: 2',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.3',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
    ],
    'extras_require': {
        'all':  ['flexx']
    }
}

setup(**setup_args)
