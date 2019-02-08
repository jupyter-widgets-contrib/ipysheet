// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import * as widgets from '@jupyter-widgets/base';

let numComms = 0;

export class MockComm {
    constructor () {
        this.comm_id = `mock-comm-id-${numComms}`;
        numComms += 1;
    }
    on_open (fn) {
        this._on_open = fn;
    }
    on_close (fn) {
        this._on_close = fn;
    }
    on_msg (fn) {
        this._on_msg = fn;
    }
    _process_msg (msg) {
        if (this._on_msg) {
            return this._on_msg(msg);
        } else {
            return Promise.resolve();
        }
    }
    open () {
        if (this._on_open) {
            this._on_open();
        }
        return '';
    }
    close () {
        if (this._on_close) {
            this._on_close();
        }
        return '';
    }
    send () {
        return '';
    }
}

export class DummyManager extends widgets.ManagerBase {
    constructor (library) {
        super();
        this.el = window.document.createElement('div');
        window.document.body.appendChild(this.el);
        this.library = library;
    }

    display_view (msg, view, options) {
        // TODO: make this a spy
        // TODO: return an html element
        return Promise.resolve(view).then(view => {
            this.el.appendChild(view.el);
            view.on('remove', () => console.log('view removed', view));
            window.last_view = view;
            // view.render()
            view.trigger('displayed');
            return view.el;
        });
    }

    loadClass (className, moduleName, moduleVersion) {
        if (moduleName === '@jupyter-widgets/controls') {
            if (widgets[className]) {
                return Promise.resolve(widgets[className]);
            } else {
                return Promise.reject(Error(`Cannot find class ${className}`));
            }
        } else if (moduleName in this.library) {
            return Promise.resolve(this.library[moduleName][className]);
        } else {
            return Promise.reject(Error(`Cannot find module ${moduleName}`));
        }
    }

    _get_comm_info () {
        return Promise.resolve({});
    }

    _create_comm () {
        return Promise.resolve(new MockComm());
    }
}
