"use strict";
var fetchOrigin = window.fetch;
var MockFetch = (function () {
    function MockFetch(stored, err) {
        var that = this;
        window.fetch = function (url, init) {
            if (err) {
                throw err;
            }
            var jsonStr = stored ? JSON.stringify(stored, null, 2) : init.body;
            var blob = new Blob([jsonStr], { type: 'application/json' }), rsp = new Response(blob, { "status": 200 });
            that.url = url;
            that.init = init;
            return Promise.resolve(rsp);
        };
    }
    MockFetch.prototype.restore = function () {
        window.fetch = fetchOrigin;
    };
    return MockFetch;
}());
exports.MockFetch = MockFetch;
