"use strict";
/**
 * Decorator to debounce
 */
function Debounce(wait) {
    return function (target, propKey, descriptor) {
        var callback = descriptor.value;
        var timer = null;
        return Object.assign({}, descriptor, {
            value: function () {
                var _this = this;
                var args = Array.from(arguments);
                clearTimeout(timer);
                return new Promise(function (resolve) {
                    timer = setTimeout(function () {
                        timer = null;
                        resolve(callback.apply(_this, args));
                    }, wait);
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
/**
 * make promisable methods of model/collection
 */
function promisify(callback, options) {
    return new Promise(function (resolve, reject) {
        if (options.success || options.error) {
            throw new SyntaxError("The method returns a Promise. " +
                "Please use syntax like collection.fetch().then( success ).catch( error );");
        }
        options.success = function () {
            return resolve.apply(this, arguments);
        };
        options.error = function () {
            return reject.apply(this, arguments);
        };
        callback();
    });
}
exports.promisify = promisify;
