"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var core_1 = require("../../../src/core");
var HeroPowerModel = (function (_super) {
    __extends(HeroPowerModel, _super);
    function HeroPowerModel() {
        _super.apply(this, arguments);
    }
    HeroPowerModel.prototype.parse = function (data) {
        return {
            item: data
        };
    };
    return HeroPowerModel;
}(core_1.Model));
exports.HeroPowerModel = HeroPowerModel;
var HeroPowerCollection = (function (_super) {
    __extends(HeroPowerCollection, _super);
    function HeroPowerCollection() {
        _super.apply(this, arguments);
        this.url = "./powers.json";
        this.model = HeroPowerModel;
    }
    return HeroPowerCollection;
}(core_1.Collection));
exports.HeroPowerCollection = HeroPowerCollection;
//# sourceMappingURL=HeroPower.js.map