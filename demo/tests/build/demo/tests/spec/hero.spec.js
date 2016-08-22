"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var core_1 = require("../../../src/core");
var Hero_1 = require("../../src/View/Hero");
var MockCollection = (function (_super) {
    __extends(MockCollection, _super);
    function MockCollection() {
        _super.apply(this, arguments);
    }
    MockCollection.prototype.fetch = function (options) {
        return null;
    };
    return MockCollection;
}(core_1.Collection));
function HeroSpec() {
    describe("Hero", function () {
        beforeEach(function () {
            this.view = new Hero_1.HeroView({
                el: null,
                tagName: "ng-hero",
                collections: {
                    heroes: new MockCollection(),
                    powers: new MockCollection(),
                    names: new MockCollection()
                }
            });
        });
        it("shows error msg when power not selected", function () {
            expect(this.view.el.textContent).not.toMatch("Power is required");
            this.view.models
                .get("hero.power")
                .set({ "dirty": true, "valid": false });
            expect(this.view.el.textContent).toMatch("Power is required");
        });
        it("disable submit when power not selected", function () {
            this.view.models
                .get("hero.power")
                .set({ "dirty": true, "valid": false });
            var btn = this.view.el.querySelector("button[type=submit]");
            expect(btn.disabled).toBeTruthy();
        });
        it("shows error msg when name not provided", function () {
            expect(this.view.el.textContent).not.toMatch("Name is required");
            this.view.models
                .get("hero.name")
                .set({ "dirty": true, "valid": false });
            expect(this.view.el.textContent).toMatch("Name is required");
        });
        it("disable submit when name not provided", function () {
            this.view.models
                .get("hero.name")
                .set({ "dirty": true, "valid": false });
            var btn = this.view.el.querySelector("button[type=submit]");
            expect(btn.disabled).toBeTruthy();
        });
        it("shows no error and enable submit when form is valid", function () {
            var power = this.view.el.querySelector("select[name=power]"), name = this.view.el.querySelector("input[name=name]"), btn = this.view.el.querySelector("button[type=submit]");
            power.value = "foo";
            name.value = "bar";
            this.view.models
                .get("hero.form")
                .checkValidity();
            expect(this.view.el.textContent).not.toMatch("Power is required");
            expect(this.view.el.textContent).not.toMatch("Name is required");
            expect(btn.disabled).toBeFalsy();
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HeroSpec;
