"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("../../../src/core");
var HeroName_1 = require("../Collection/HeroName");
var HeroPower_1 = require("../Collection/HeroPower");
var HeroView = (function (_super) {
    __extends(HeroView, _super);
    function HeroView() {
        _super.apply(this, arguments);
    }
    HeroView.prototype.initialize = function () {
        this.collections.get("powers").fetch();
        this.collections.get("names").fetch();
        this.render();
    };
    HeroView.prototype.onSubmitForm = function (e) {
        var el = e.target;
        e.preventDefault();
        var collection = this.collections.get("heroes"), data = this.getData("hero");
        el.reset();
        if (data["name"]) {
            collection.create(data, {
                error: console.error
            });
        }
    };
    HeroView = __decorate([
        core_1.Component({
            el: "ng-hero",
            events: {
                "submit form": "onSubmitForm"
            },
            collections: {
                names: new HeroName_1.HeroNameCollection(),
                powers: new HeroPower_1.HeroPowerCollection()
            },
            template: "\n    <form data-ng-group=\"hero\" novalidate>\n      <div class=\"form-group\">\n        <i class=\"glyphicon glyphicon-user\"></i>\n        <label for=\"name\">Name</label>\n        <input id=\"name\" list=\"names\" name=\"name\" type=\"text\" class=\"form-control\" required >\n        <datalist id=\"names\">\n          <option data-ng-for=\"let n of names\" data-ng-prop=\"'value', n.item\">\n        </datalist>\n        <div class=\"alert alert-danger\" data-ng-if=\"!hero.name.valid\">\n          Name is required\n        </div>\n      </div>\n      <div class=\"form-group\">\n        <i class=\"glyphicon glyphicon-star-empty\"></i>\n        <label for=\"power\">Hero Power</label>\n        <select id=\"power\" name=\"power\" class=\"form-control\" required>\n          <option data-ng-for=\"let p of powers\" data-ng-text=\"p.item\" >Nothing here</option>\n        </select>\n        <div class=\"alert alert-danger\" data-ng-if=\"hero.power.dirty && !hero.power.valid\">\n          Power is required\n        </div>\n      </div>\n       <button type=\"submit\" class=\"btn btn-default\" data-ng-prop=\"'disabled', !hero.form.valid\">Submit</button>\n\n    </form>\n\n"
        }), 
        __metadata('design:paramtypes', [])
    ], HeroView);
    return HeroView;
}(core_1.FormView));
exports.HeroView = HeroView;
