"use strict";
var utils_1 = require("./utils");
function Component(options) {
    var mixin = {
        _component: {
            models: utils_1.mapFrom(options.models),
            collections: utils_1.mapFrom(options.collections),
            views: options.views || [],
            template: options.template,
        },
        el: options.el || null,
        events: options.events || null,
        id: options.id || null,
        className: options.className || null,
        tagName: options.tagName || null,
        formValidators: options.formValidators || null
    };
    return function (target) {
        Object.assign(target.prototype, mixin);
        // This way we trick invokation of this.initialize after constructor
        // Keeping in mind that @Component belongs to View that knows about this._initialize
        if ("initialize" in target.prototype) {
            _a = [target.prototype["initialize"], function () { }], target.prototype["_initialize"] = _a[0], target.prototype["initialize"] = _a[1];
        }
        var _a;
    };
}
exports.Component = Component;
//# sourceMappingURL=component.js.map