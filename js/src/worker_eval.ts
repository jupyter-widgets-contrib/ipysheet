export function safeEval(untrustedCode) {
  return new Promise(function (resolve, reject) {
    var blobURL = URL.createObjectURL(new Blob([
      "(",
      function () {
        var _postMessage = postMessage;
        var _addEventListener = addEventListener;

        (function (obj) {
          "use strict";

          var current = obj;
          var keepProperties = [
            // required
            'Object', 'Function', 'Infinity', 'NaN', 'undefined', 'caches', 'TEMPORARY', 'PERSISTENT', 
            // optional, but trivial to get back
            'Array', 'Boolean', 'Number', 'String', 'Symbol',
            // optional
            'Map', 'Math', 'Set',
          ];

          do {
            Object.getOwnPropertyNames(current).forEach(function (name) {
              if (keepProperties.indexOf(name) === -1) {
                delete current[name];
              }
            });
            current = Object.getPrototypeOf(current);
          }
          while (current !== Object.prototype);
        })(this);

        _addEventListener("message", function (e) {
          var f = new Function("", "return (" + e.data + "\n);");
            _postMessage(f(), undefined);
        });
      }.toString(),
      ")()"
    ], {
      type: "application/javascript"
    }));

    var worker = new Worker(blobURL);

    URL.revokeObjectURL(blobURL);

    worker.onmessage = function (evt) {
      worker.terminate();
      resolve(evt.data);
    };

    worker.onerror = function (evt) {
      reject(new Error(evt.message));
    };

    worker.postMessage(untrustedCode);

    setTimeout(function () {
      worker.terminate();
      reject(new Error('The worker timed out.'));
    }, 1000);
  });
}
