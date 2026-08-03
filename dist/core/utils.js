"use strict";
/**
 * Debounce a callback bound to a given context, tracking the pending timer on contextKey
 */
function debounce(context, contextKey, wait, callback, args) {
    clearTimeout(context[contextKey]);
    context[contextKey] = setTimeout(function () {
        context[contextKey] = null;
        callback.apply(context, args);
    }, wait);
}
exports.debounce = debounce;
/**
 * Decorator to debounce
 */
function Debounce(wait) {
    return function (target, propKey, descriptor) {
        var callback = descriptor.value;
        return Object.assign({}, descriptor, {
            value: function () {
                var _this = this;
                var args = Array.from(arguments), onFire = function () {
                    var cbArgs = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        cbArgs[_i - 0] = arguments[_i];
                    }
                    return callback.apply(_this, cbArgs);
                };
                return new Promise(function (resolve) {
                    debounce(_this, "_debounceTimer", wait, function () {
                        var cbArgs = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            cbArgs[_i - 0] = arguments[_i];
                        }
                        return resolve(onFire.apply(void 0, cbArgs));
                    }, args);
                });
            }
        });
    };
}
exports.Debounce = Debounce;
/**
 * Decorator to mixin
 */
function Mixin(mixin) {
    return function (target) {
        Object.assign(target.prototype, mixin);
    };
}
exports.Mixin = Mixin;
function mapFrom(mixin) {
    var map = new Map();
    mapAssign(map, mixin);
    return map;
}
exports.mapFrom = mapFrom;
function mapAssign(map, mixin) {
    if (mixin === void 0) { mixin = {}; }
    Object.keys(mixin).forEach(function (key) {
        map.set(key, mixin[key]);
    });
}
exports.mapAssign = mapAssign;
