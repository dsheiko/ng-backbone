"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_directive_1 = require("./abstract-directive");
/**
 * Shared base for directives that compile their expression via `__toArray`
 * and evaluate a cached [key, value]-shaped args tuple on sync
 * (ngattr, ngclass, ngdata, ngprop)
 */
var AbstractArgsDirective = (function (_super) {
    __extends(AbstractArgsDirective, _super);
    function AbstractArgsDirective(el, reporter, identifier) {
        _super.call(this, el, reporter);
        this.nodes = this.initNodes(el, identifier, function (node, expr, compile, cache) {
            return {
                el: node,
                exp: compile(expr, "__toArray", reporter),
                cache: cache
            };
        });
    }
    AbstractArgsDirective.prototype.sync = function (data) {
        var _this = this;
        this.nodes.forEach(function (node) {
            node.cache.evaluate(node.exp.call(node.el, data), function (args) {
                _this.apply(node.el, args);
            });
        });
    };
    return AbstractArgsDirective;
}(abstract_directive_1.AbstractDirective));
exports.AbstractArgsDirective = AbstractArgsDirective;
