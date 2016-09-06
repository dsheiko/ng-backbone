"use strict";
var ngif_1 = require("./ng-template/ngif");
var ngel_1 = require("./ng-template/ngel");
var ngtext_1 = require("./ng-template/ngtext");
var ngfor_1 = require("./ng-template/ngfor");
var ngswitch_1 = require("./ng-template/ngswitch");
var ngswitchcase_1 = require("./ng-template/ngswitchcase");
var ngswitchcasedefault_1 = require("./ng-template/ngswitchcasedefault");
var ngclass_1 = require("./ng-template/ngclass");
var ngprop_1 = require("./ng-template/ngprop");
var ngattr_1 = require("./ng-template/ngattr");
var ngdata_1 = require("./ng-template/ngdata");
var exception_1 = require("./ng-template/exception");
var reporter_1 = require("./ng-template/reporter");
var DIRECTIVES = [ngfor_1.NgFor, ngswitch_1.NgSwitch, ngswitchcase_1.NgSwitchCase, ngswitchcasedefault_1.NgSwitchCaseDefault, ngif_1.NgIf,
    ngclass_1.NgClass, ngdata_1.NgData, ngprop_1.NgProp, ngattr_1.NgAttr, ngel_1.NgEl, ngtext_1.NgText];
var NgTemplate = (function () {
    /**
     * Initialize template for a given Element
     * If template passed, load it into the Element
     */
    function NgTemplate(el, template, options) {
        if (options === void 0) { options = {}; }
        this.el = el;
        this.template = template;
        this.options = options;
        this.directives = [];
        if (!this.el) {
            throw new exception_1.Exception("(NgTemplate) Invalid first parameter: must be an existing DOM node");
        }
        this.reporter = new reporter_1.Reporter();
        this.template || this.init(DIRECTIVES);
    }
    NgTemplate.factory = function (el, template, options) {
        return new NgTemplate(el, template || null, options);
    };
    NgTemplate.prototype.init = function (directives) {
        var _this = this;
        directives.forEach(function (Directive) {
            _this.directives.push(new Directive(_this.el, _this.reporter));
        });
    };
    NgTemplate.prototype.report = function () {
        return this.reporter.get();
    };
    NgTemplate.prototype.sync = function (data) {
        // Late initialization: renders from a given template on first sync
        if (this.template) {
            typeof this.options.willMount === "function" && this.options.willMount();
            this.el.innerHTML = this.template;
            this.init(DIRECTIVES);
            this.template = null;
            typeof this.options.didMount === "function" && this.options.didMount();
        }
        this.directives.forEach(function (d) {
            d.sync(data, NgTemplate);
        });
        return this;
    };
    NgTemplate.prototype.pipe = function (cb, context) {
        if (context === void 0) { context = this; }
        cb.call(context, this.el, this.reporter);
        return this;
    };
    return NgTemplate;
}());
exports.NgTemplate = NgTemplate;
// element.matches polyfill
// @link https://developer.mozilla.org/en/docs/Web/API/Element/matches
if (!Element.prototype.matches) {
    var eProto = Element.prototype;
    Element.prototype.matches =
        eProto.matchesSelector ||
            eProto.mozMatchesSelector ||
            eProto.msMatchesSelector ||
            eProto.oMatchesSelector ||
            eProto.webkitMatchesSelector ||
            function (s) {
                var matches = (this.document || this.ownerDocument).querySelectorAll(s), i = matches.length;
                while (--i >= 0 && matches.item(i) !== this) { }
                return i > -1;
            };
}
