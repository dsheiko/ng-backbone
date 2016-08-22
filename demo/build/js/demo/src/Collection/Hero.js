"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var core_1 = require("../../../src/core");
var Hero_1 = require("../Model/Hero");
var HeroCollection = (function (_super) {
    __extends(HeroCollection, _super);
    function HeroCollection() {
        _super.apply(this, arguments);
        this.localStorage = new Backbone.LocalStorage("heroes");
        this.model = Hero_1.HeroModel;
    }
    /**
     * Shortcut for sorting
     */
    HeroCollection.prototype.orderBy = function (key) {
        this.comparator = key;
        this.sort();
        return this;
    };
    return HeroCollection;
}(core_1.Collection));
exports.HeroCollection = HeroCollection;
//# sourceMappingURL=Hero.js.map