pricer-hybrid
===============================

Pricer Hybrid extension for ipysheet

Installation
------------

To install use pip:

    $ pip install pricer_hybrid
    $ jupyter nbextension enable --py --sys-prefix pricer_hybrid


For a development installation (requires npm),

    $ git clone https://github.com/QuantStack/pricer-hybrid.git
    $ cd pricer-hybrid
    $ pip install -e .
    $ jupyter nbextension install --py --symlink --sys-prefix pricer_hybrid
    $ jupyter nbextension enable --py --sys-prefix pricer_hybrid
