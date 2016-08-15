"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_directive_1 = require("./abstract-directive");
/**
 * <i data-ng-class-list-toggle="'is-hidden', isHidden"></i>
 */
var NgClassListToggle = (function (_super) {
    __extends(NgClassListToggle, _super);
    function NgClassListToggle(el) {
        _super.call(this);
        this.nodes = this.initNodes(el, "ng-class-list-toggle", function (node, expr, evaluate, cache) {
            return {
                el: node,
                exp: evaluate(expr, "__toArray"),
                cache: cache
            };
        });
    }
    NgClassListToggle.prototype.sync = function (data) {
        this.nodes.forEach(function (node) {
            node.cache.evaluate(node.exp.call(node.el, data), function (args) {
                node.el.classList.toggle(args[0], args[1]);
            });
        });
    };
    return NgClassListToggle;
}(abstract_directive_1.AbstractDirective));
exports.NgClassListToggle = NgClassListToggle;
