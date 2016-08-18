"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var utils_1 = require("./utils");
var Collection = (function (_super) {
    __extends(Collection, _super);
    function Collection(models, options) {
        _super.call(this, models, options);
        this.options = options || {};
    }
    /**
     * Shortcut for sorting
     */
    Collection.prototype.orderBy = function (key) {
        this.comparator = key;
        this.sort();
        this.trigger("change");
        return this;
    };
    /**
     * Promisable fetch
     */
    Collection.prototype.fetch = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return utils_1.promisify(function () {
            Backbone.Collection.prototype.fetch.call(_this, options);
        }, options);
    };
    /**
     * Promisable create
     */
    Collection.prototype.create = function (attributes, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return utils_1.promisify(function () {
            Backbone.Collection.prototype.create.call(_this, attributes, options);
        }, options);
    };
    return Collection;
}(Backbone.Collection));
exports.Collection = Collection;
//# sourceMappingURL=collection.js.map