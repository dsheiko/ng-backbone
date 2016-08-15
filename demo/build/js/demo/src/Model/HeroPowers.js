"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var core_1 = require("../../../src/core");
// Model to request power list from the server
var HeroPowersModel = (function (_super) {
    __extends(HeroPowersModel, _super);
    function HeroPowersModel() {
        _super.apply(this, arguments);
        this.url = "powers.json";
    }
    return HeroPowersModel;
}(core_1.Model));
exports.HeroPowersModel = HeroPowersModel;
//# sourceMappingURL=HeroPowers.js.map