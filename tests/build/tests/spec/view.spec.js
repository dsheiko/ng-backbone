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
var core_1 = require("../../src/core");
function ViewSpec() {
    describe("View", function () {
        describe("@Component + View + no state", function () {
            it("applies tagName and template", function () {
                var TestView = (function (_super) {
                    __extends(TestView, _super);
                    function TestView() {
                        _super.apply(this, arguments);
                    }
                    TestView = __decorate([
                        core_1.Component({
                            tagName: "ng-component",
                            template: "<ng-el></ng-el>"
                        }), 
                        __metadata('design:paramtypes', [])
                    ], TestView);
                    return TestView;
                }(core_1.View));
                var view = new TestView();
                view.render();
                expect(view.el.querySelector("ng-el")).toBeTruthy();
            });
            it("applies tagName and className and template", function () {
                var TestView = (function (_super) {
                    __extends(TestView, _super);
                    function TestView() {
                        _super.apply(this, arguments);
                    }
                    TestView = __decorate([
                        core_1.Component({
                            tagName: "ng-component",
                            className: "ng-class",
                            template: "<ng-el></ng-el>"
                        }), 
                        __metadata('design:paramtypes', [])
                    ], TestView);
                    return TestView;
                }(core_1.View));
                var view = new TestView();
                view.render();
                expect(view.el.querySelector("ng-el")).toBeTruthy();
                expect(view.el.classList.contains("ng-class")).toBeTruthy();
            });
        });
        describe("@Component + View + Models", function () {
            it("binds specified models", function () {
                var TestView = (function (_super) {
                    __extends(TestView, _super);
                    function TestView() {
                        _super.apply(this, arguments);
                    }
                    TestView = __decorate([
                        core_1.Component({
                            tagName: "ng-component",
                            models: {
                                foo: new core_1.Model({ bar: "bar" })
                            },
                            template: "<ng-el data-ng-text=\"foo.bar\">none</ng-el>"
                        }), 
                        __metadata('design:paramtypes', [])
                    ], TestView);
                    return TestView;
                }(core_1.View));
                var view = new TestView(), errors = view.render().errors, el = view.el.querySelector("ng-el");
                expect(el).toBeTruthy();
                expect(el.textContent).toBe("bar");
                expect(errors.length).toBe(0);
            });
        });
        describe("@Component + View + Collections", function () {
            it("binds specified collections", function () {
                var TestView = (function (_super) {
                    __extends(TestView, _super);
                    function TestView() {
                        _super.apply(this, arguments);
                    }
                    TestView = __decorate([
                        core_1.Component({
                            tagName: "ng-component",
                            collections: {
                                foo: new core_1.Collection([
                                    new core_1.Model({ bar: 1 }),
                                    new core_1.Model({ bar: 2 })
                                ])
                            },
                            template: "<ng-el data-ng-for=\"let i of foo\" data-ng-text=\"i.bar\">none</ng-el>"
                        }), 
                        __metadata('design:paramtypes', [])
                    ], TestView);
                    return TestView;
                }(core_1.View));
                var view = new TestView(), errors = view.render().errors, els = Array.from(view.el.querySelectorAll("ng-el"));
                expect(els.length).toBe(2);
                expect(els[0].textContent).toBe("1");
                expect(els[1].textContent).toBe("2");
            });
        });
        describe("View with child View", function () {
            it("applies tagName and template", function () {
                var TestView = (function (_super) {
                    __extends(TestView, _super);
                    function TestView() {
                        _super.apply(this, arguments);
                    }
                    TestView = __decorate([
                        core_1.Component({
                            tagName: "ng-component",
                            template: "<ng-child></ng-child>"
                        }), 
                        __metadata('design:paramtypes', [])
                    ], TestView);
                    return TestView;
                }(core_1.View));
                var TestChildView = (function (_super) {
                    __extends(TestChildView, _super);
                    function TestChildView() {
                        _super.apply(this, arguments);
                    }
                    TestChildView = __decorate([
                        core_1.Component({
                            template: "<ng-el></ng-el>"
                        }), 
                        __metadata('design:paramtypes', [])
                    ], TestChildView);
                    return TestChildView;
                }(core_1.View));
                var view = new TestView();
                view.render();
                var child = new TestChildView({
                    el: view.el.querySelector("ng-child")
                });
                child.render();
                expect(view.el.querySelector("ng-el")).toBeTruthy();
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ViewSpec;
