"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var core_1 = require("../../../src/core");
var HeroList_1 = require("../../src/View/HeroList");
var MockCollection = (function (_super) {
    __extends(MockCollection, _super);
    function MockCollection() {
        _super.apply(this, arguments);
    }
    MockCollection.prototype.fetch = function (options) {
        return null;
    };
    MockCollection.prototype.orderBy = function (key) {
        this.comparator = key;
        this.sort();
        return this;
    };
    return MockCollection;
}(core_1.Collection));
function HeroListSpec() {
    describe("Hero View", function () {
        beforeEach(function () {
            this.view = new HeroList_1.HeroListView({
                el: null,
                tagName: "ng-herolist",
                collections: {
                    heroes: new MockCollection([
                        new core_1.Model({ name: "name1", power: "power3" }),
                        new core_1.Model({ name: "name2", power: "power2" }),
                        new core_1.Model({ name: "name3", power: "power1" })
                    ])
                }
            });
        });
        it("renders into view all the models of the specified collection ", function () {
            this.view.render();
            var items = this.view.el.querySelectorAll("tr.list__tool-row");
            expect(items.length).toBe(this.view.collections.get("heroes").length);
        });
        it("sorts the table by a given key", function () {
            this.view
                .render()
                .orderBy("power");
            var first = this.view.el.querySelector("tr.list__tool-row");
            expect(first.textContent).toMatch("power3");
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HeroListSpec;
