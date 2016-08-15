"use strict";
var ngtemplate_1 = require("../ngtemplate");
var utils_1 = require("./utils");
function Component(options) {
    var el = typeof options.el === "string" ? document.querySelector(options.el) : options.el;
    if (!(el instanceof Element)) {
        throw new Error("options.el not found");
    }
    var mixin = {
        models: utils_1.mapFrom(options.models) || null,
        collections: utils_1.mapFrom(options.collections) || null,
        el: options.el || null,
        events: options.events || null,
        id: options.id || null,
        className: options.className || null,
        tagName: options.tagName || null,
        template: new ngtemplate_1.NgTemplate(el, options.template),
        formValidators: options.formValidators || null
    };
    return function (target) {
        Object.assign(target.prototype, mixin);
        // This way we trick invokation of this.initialize after constructor
        // Keeping in mind that @Component belongs to View that knows about this._initialize
        if ("initialize" in target.prototype) {
            _a = [target.prototype.initialize, function () { }], target.prototype._initialize = _a[0], target.prototype.initialize = _a[1];
        }
        var _a;
    };
}
exports.Component = Component;
