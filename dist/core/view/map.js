"use strict";
var ViewMap = (function () {
    function ViewMap() {
        this.map = new Map();
    }
    ViewMap.prototype.clear = function () {
        return this.map.clear();
    };
    ViewMap.prototype.delete = function (key) {
        return this.map.delete(key);
    };
    ViewMap.prototype.forEach = function (cb, thisArg) {
        return this.map.forEach(cb, thisArg);
    };
    ViewMap.prototype.get = function (key, inx) {
        if (inx === void 0) { inx = 0; }
        return this.map.get(key)[inx];
    };
    ViewMap.prototype.getAll = function (key) {
        return this.map.get(key);
    };
    ViewMap.prototype.has = function (key) {
        return this.map.has(key);
    };
    ViewMap.prototype.hasElement = function (el) {
        var toggle = false;
        this.map.forEach(function (views) {
            if (views.find(function (view) { return view.el === el; })) {
                toggle = true;
            }
        });
        return toggle;
    };
    ViewMap.prototype.set = function (key, value) {
        return this.map.set(key, value);
    };
    Object.defineProperty(ViewMap.prototype, "size", {
        get: function () {
            return this.map.size;
        },
        enumerable: true,
        configurable: true
    });
    return ViewMap;
}());
exports.ViewMap = ViewMap;
