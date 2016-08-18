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
var HeroListView = (function (_super) {
    __extends(HeroListView, _super);
    function HeroListView() {
        _super.apply(this, arguments);
    }
    HeroListView.prototype.initialize = function () {
        this.collections.get("heroes").fetch();
        this.render();
    };
    HeroListView.prototype.syncCheckboxCounter = function () {
        var selected = this.el.querySelectorAll("[data-bind=checkbox]:checked").length, model = this.models.get("state");
        model.set("selected", selected);
    };
    HeroListView.prototype.onClickRemoveGroup = function (e) {
        var selected = Array.from(this.el.querySelectorAll("[data-bind=checkbox]:checked")), collection = this.collections.get("heroes");
        e.preventDefault();
        selected.forEach(function (el) {
            var model = collection.get(el.dataset["id"]);
            model.destroy();
        });
        this.syncCheckboxCounter();
    };
    HeroListView.prototype.onClickSort = function (e) {
        var el = e.target, state = this.models.get("state"), collection = this.collections.get("heroes"), order = el.dataset["sort"];
        e.preventDefault();
        state.set("isOrderName", order === "name");
        state.set("isOrderPower", order === "power");
        collection.orderBy(order);
    };
    HeroListView = __decorate([
        core_1.Component({
            el: "ng-herolist",
            events: {
                "change [data-bind=checkbox]": "syncCheckboxCounter",
                "click [data-sort]": "onClickSort",
                "click [data-bind=remove]": "onClickRemoveGroup"
            },
            models: {
                state: new core_1.Model({
                    selected: 0,
                    isOrderName: false,
                    isOrderPower: false,
                })
            },
            template: "\n\n<table class=\"table\">\n<tr>\n  <th data-bind=\"markall\"><i class=\"glyphicon glyphicon-ok\"></i>&nbsp;</th>\n  <th data-sort=\"name\">Name <i data-ng-class-list-toggle=\"'is-inactive', !state.isOrderName\" class=\"glyphicon glyphicon-chevron-down pull-right is-inactive\"></i></th>\n  <th data-sort=\"power\">Power <i data-ng-class-list-toggle=\"'is-inactive', !state.isOrderPower\" class=\"glyphicon glyphicon-chevron-down pull-right is-inactive\"></i></th>\n</tr>\n<tr data-ng-for=\"let p of heroes\" class=\"list__tool-row\">\n\n  <td>\n    <label>\n    <input data-bind=\"checkbox\" type=\"checkbox\" data-ng-data=\"'id', p.id\" />\n    </label>\n  </td>\n\n  <td data-ng-text=\"p.name\" ></td>\n  <td data-ng-text=\"p.power\" ></td>\n\n</tr>\n\n</table>\n\n<div class=\"row\">\n  <span><span data-ng-text=\"state.selected\">0</span> selected items</span>\n  <button data-bind=\"remove\" class=\"btn btn-danger\" data-ng-if=\"state.selected\">Remove selected</button>\n</div>\n\n"
        }), 
        __metadata('design:paramtypes', [])
    ], HeroListView);
    return HeroListView;
}(core_1.View));
exports.HeroListView = HeroListView;
//# sourceMappingURL=HeroList.js.map