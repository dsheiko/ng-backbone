"use strict";
var fetchOrigin = window.fetch;
var utils = (function () {
    function utils() {
    }
    utils.mockFetch = function (json) {
        window.fetch = function (url, init) {
            var blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' }), rsp = new Response(blob, { "status": 200 });
            return Promise.resolve(rsp);
        };
    };
    utils.restoreFetch = function () {
        window.fetch = fetchOrigin;
    };
    return utils;
}());
exports.utils = utils;
