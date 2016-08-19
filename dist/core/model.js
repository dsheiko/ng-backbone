"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var utils_1 = require("./utils");
var Model = (function (_super) {
    __extends(Model, _super);
    function Model(attributes, options) {
        _super.call(this, attributes, options);
        this.options = options || {};
    }
    /**
     * Promisable destroy
     */
    Model.prototype.destroy = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return utils_1.promisify(function () {
            Backbone.Model.prototype.destroy.call(_this, options);
        }, options);
    };
    /**
     * Promisable save
     */
    Model.prototype.save = function (attributes, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return utils_1.promisify(function () {
            Backbone.Model.prototype.save.call(_this, attributes, options);
        }, options);
    };
    /**
     * Promisable fetch
     */
    Model.prototype.fetch = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return utils_1.promisify(function () {
            Backbone.Model.prototype.fetch.call(_this, options);
        }, options);
    };
    return Model;
}(Backbone.Model));
exports.Model = Model;
