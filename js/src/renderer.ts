import * as widgets  from '@jupyter-widgets/base';
import * as Handsontable from 'handsontable';
import {extend, forEach} from 'lodash';
import {semver_range} from './version';


export class ExecuteRequest {
    constructor(code: string) {
        this.id = widgets.uuid();
        this.code = code;

        this.execute_promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }

    id: string;
    code: string;
    execute_promise: Promise<any>;
    resolve: Function;
    reject: Function;
};


export class SafeJSKernel {
    constructor() {
        this.initialize();
    }

    execute(code: string) {
        const request = new ExecuteRequest(code);

        this.requests[request.id] = request;

        this.worker.postMessage({ id: request.id, code: request.code });

        return request.execute_promise;
    }

    initialize() {
        const blobURL = URL.createObjectURL(new Blob([
            '(',
            function () {
                const _postMessage = postMessage;
                const _addEventListener = addEventListener;

                ((obj) => {
                    'use strict';

                    let current = obj;
                    const keepProperties = [
                        // required
                        'Object', 'Function', 'Infinity', 'NaN', 'undefined', 'caches', 'TEMPORARY', 'PERSISTENT',
                        // optional, but trivial to get back
                        'Array', 'Boolean', 'Number', 'String', 'Symbol',
                        // optional
                        'Map', 'Math', 'Set',
                    ];

                    do {
                        Object.getOwnPropertyNames(current).forEach((name) => {
                            if (keepProperties.indexOf(name) === -1) {
                                delete current[name];
                            }
                        });
                        current = Object.getPrototypeOf(current);
                    }
                    while (current !== Object.prototype);
                })(this);

                _addEventListener('message', ({ data }) => {
                    const f = new Function('', `return (${data.code}\n);`);
                    _postMessage({ id: data.id, result: f() }, undefined);
                });
            }.toString(),
            ')()'
        ], {
            type: 'application/javascript'
        }));

        this.worker = new Worker(blobURL);

        this.worker.onmessage = ({ data }) => {
            // Resolve the right Promise with the return value
            this.requests[data.id].resolve(data.result);
            delete this.requests[data.id];
        };

        this.worker.onerror = ({ message }) => {
            // Reject all the pending promises, terminate the worker and start again
            forEach(this.requests, (request) => {
                request.reject(message);
            });
            this.requests = {};

            this.worker.terminate();

            this.initialize();
        };

        URL.revokeObjectURL(blobURL);
    }

    worker: Worker;
    requests: { [key:string] : ExecuteRequest; } = {};
}


export class RendererModel extends widgets.WidgetModel {
    defaults() {
        return {...widgets.WidgetModel.prototype.defaults(),
            _model_name : 'RendererModel',
            _model_module : 'ipysheet',
            _model_module_version : semver_range,
            name: '',
            code: ''
        };
    }

    initialize(attributes: any, options: any) {
        super.initialize(attributes, options);

        this.kernel = new SafeJSKernel();

        const that = this;
        this.rendering_function = function (instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments);

            that.kernel.execute(`(${that.get('code')})(${value})`).then((style) => {
                (Object as any).assign(td.style, style);
            });
        };

        (Handsontable.renderers as any).registerRenderer(this.get('name'), this.rendering_function);
    }

    kernel: SafeJSKernel;
    rendering_function: Function;
};
