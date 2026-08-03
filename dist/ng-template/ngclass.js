"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_args_directive_1 = require("./abstract-args-directive");
/**
 * <i data-ng-class="'is-hidden', isHidden"></i>
 */
var NgClass = (function (_super) {
    __extends(NgClass, _super);
    function NgClass(el, reporter) {
        _super.call(this, el, reporter, NgClass.selector);
    }
    NgClass.prototype.apply = function (el, args) {
        args[0] && el.classList.toggle(args[0], Boolean(args[1]));
    };
    NgClass.selector = "ng-class";
    return NgClass;
}(abstract_args_directive_1.AbstractArgsDirective));
exports.NgClass = NgClass;
