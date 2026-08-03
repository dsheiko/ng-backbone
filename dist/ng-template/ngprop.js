"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_args_directive_1 = require("./abstract-args-directive");
/**
 * <i data-ng-prop="'disabled', isDisabled"></i>
 */
var NgProp = (function (_super) {
    __extends(NgProp, _super);
    function NgProp(el, reporter) {
        _super.call(this, el, reporter, "ng-prop");
    }
    NgProp.prototype.apply = function (el, args) {
        var target = el;
        target[args[0]] = args[1];
    };
    NgProp.selector = "ng-prop";
    return NgProp;
}(abstract_args_directive_1.AbstractArgsDirective));
exports.NgProp = NgProp;
