"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var core_1 = require("../../../src/core");
var HeroNameModel = (function (_super) {
    __extends(HeroNameModel, _super);
    function HeroNameModel() {
        _super.apply(this, arguments);
    }
    HeroNameModel.prototype.parse = function (data) {
        return {
            item: data
        };
    };
    return HeroNameModel;
}(core_1.Model));
exports.HeroNameModel = HeroNameModel;
var HeroNameCollection = (function (_super) {
    __extends(HeroNameCollection, _super);
    function HeroNameCollection() {
        _super.apply(this, arguments);
        this.url = "./names.json";
        this.model = HeroNameModel;
    }
    return HeroNameCollection;
}(core_1.Collection));
exports.HeroNameCollection = HeroNameCollection;
