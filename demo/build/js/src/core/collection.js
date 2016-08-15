"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
    Collection.prototype.fetch = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return new Promise(function (resolve, reject) {
            options.success = function () {
                return resolve.apply(this, arguments);
            };
            options.error = function () {
                return reject.apply(this, arguments);
            };
            Backbone.Collection.prototype.fetch.call(_this, options);
        });
    };
    return Collection;
}(Backbone.Collection));
exports.Collection = Collection;
//# sourceMappingURL=collection.js.map