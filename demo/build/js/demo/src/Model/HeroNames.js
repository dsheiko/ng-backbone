"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var core_1 = require("../../../src/core");
// Model to request power list from the server
var HeroNamesModel = (function (_super) {
    __extends(HeroNamesModel, _super);
    function HeroNamesModel() {
        _super.apply(this, arguments);
        this.url = "names.json";
    }
    return HeroNamesModel;
}(core_1.Model));
exports.HeroNamesModel = HeroNamesModel;
//# sourceMappingURL=HeroNames.js.map