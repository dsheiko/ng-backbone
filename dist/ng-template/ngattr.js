"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_args_directive_1 = require("./abstract-args-directive");
/**
 * <i data-ng-attr="'checked', true"></i>
 */
var NgAttr = (function (_super) {
    __extends(NgAttr, _super);
    function NgAttr(el, reporter) {
        _super.call(this, el, reporter, "ng-attr");
    }
    NgAttr.prototype.apply = function (el, args) {
        if (!args[1]) {
            el.removeAttribute(args[0]);
            return;
        }
        el.setAttribute(args[0], args[1]);
    };
    NgAttr.selector = "ng-attr";
    return NgAttr;
}(abstract_args_directive_1.AbstractArgsDirective));
exports.NgAttr = NgAttr;
