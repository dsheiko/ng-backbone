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
        //    describe("@Component + View + no state", function(){
        //      it( "applies tagName and template", function() {
        //        @Component({
        //          tagName: "ng-component",
        //          template: "<ng-el></ng-el>"
        //        })
        //        class TestView extends View {
        //        }
        //        let view = new TestView();
        //        view.render();
        //        expect( view.el.querySelector( "ng-el" ) ).toBeTruthy();
        //      });
        //      it( "applies tagName and className and template", function() {
        //        @Component({
        //          tagName: "ng-component",
        //          className: "ng-class",
        //          template: "<ng-el></ng-el>"
        //        })
        //        class TestView extends View {
        //        }
        //        let view = new TestView();
        //        view.render();
        //        expect( view.el.querySelector( "ng-el" ) ).toBeTruthy();
        //        expect( view.el.classList.contains( "ng-class" ) ).toBeTruthy();
        //      });
        //    });
        //
        //    describe("@Component + View + Models", function(){
        //      it( "binds specified models", function() {
        //        @Component({
        //          tagName: "ng-component",
        //          models: {
        //            foo: new Model({ bar: "bar" })
        //          },
        //          template: `<ng-el data-ng-text="foo.bar">none</ng-el>`
        //        })
        //        class TestView extends View {
        //        }
        //        let view = new TestView(),
        //            errors = view.render().errors,
        //            el = view.el.querySelector( "ng-el" );
        //        expect( el ).toBeTruthy();
        //        expect( el.textContent ).toBe( "bar" );
        //        expect( errors.length ).toBe( 0 );
        //      });
        //    });
        //
        //    describe("@Component + View + Collections", function(){
        //      it( "binds specified collections", function() {
        //        @Component({
        //          tagName: "ng-component",
        //          collections: {
        //            foo: new Collection([
        //              new Model({ bar: 1 }),
        //              new Model({ bar: 2 })
        //            ])
        //          },
        //          template: `<ng-el data-ng-for="let i of foo" data-ng-text="i.bar">none</ng-el>`
        //        })
        //        class TestView extends View {
        //        }
        //        let view = new TestView(),
        //            errors = view.render().errors,
        //            els = Array.from( view.el.querySelectorAll( "ng-el" ) );
        //          expect( els.length ).toBe( 2 );
        //          expect( els[ 0 ].textContent ).toBe( "1" );
        //          expect( els[ 1 ].textContent ).toBe( "2" );
        //      });
        //    });
        //
        //
        //    describe("View with nested views straigtforward", function(){
        //      it( "renders both parent and child views", function() {
        //        @Component({
        //          tagName: "ng-component",
        //          template: "<ng-child></ng-child>"
        //        })
        //        class TestView extends View {
        //        }
        //        @Component({
        //          template: "<ng-el></ng-el>"
        //        })
        //        class TestChildView extends View {
        //        }
        //
        //        let view = new TestView();
        //        view.render();
        //        let child = new TestChildView({
        //          el: view.el.querySelector( "ng-child" )
        //        });
        //        child.render();
        //        expect( view.el.querySelector( "ng-el" ) ).toBeTruthy();
        //      });
        //    });
        describe("View with nested views as @Component.views = [Ctor, Ctor]", function () {
            it("renders both parent and child views", function () {
                var TestChildView = (function (_super) {
                    __extends(TestChildView, _super);
                    function TestChildView() {
                        _super.apply(this, arguments);
                    }
                    TestChildView.prototype.initialize = function () {
                        this.render();
                    };
                    TestChildView = __decorate([
                        core_1.Component({
                            el: "ng-child",
                            template: "<ng-el></ng-el>"
                        }), 
                        __metadata('design:paramtypes', [])
                    ], TestChildView);
                    return TestChildView;
                }(core_1.View));
                var TestView = (function (_super) {
                    __extends(TestView, _super);
                    function TestView() {
                        _super.apply(this, arguments);
                    }
                    TestView = __decorate([
                        core_1.Component({
                            tagName: "ng-component",
                            template: "<ng-child></ng-child>",
                            views: {
                                foo: TestChildView
                            }
                        }), 
                        __metadata('design:paramtypes', [])
                    ], TestView);
                    return TestView;
                }(core_1.View));
                var view = new TestView();
                view.render();
                expect(view.views.get("foo") instanceof TestChildView).toBeTruthy();
                expect(view.el.querySelector("ng-el")).toBeTruthy();
            });
        });
        describe("View with nested views as @Component.views = [[Ctor, options]]", function () {
            it("renders both parent and child views", function () {
                var TestChildView = (function (_super) {
                    __extends(TestChildView, _super);
                    function TestChildView() {
                        _super.apply(this, arguments);
                    }
                    TestChildView.prototype.initialize = function (options) {
                        expect(options.id).toBe("ngId");
                        this.render();
                    };
                    TestChildView = __decorate([
                        core_1.Component({
                            el: "ng-child",
                            template: "<ng-el></ng-el>"
                        }), 
                        __metadata('design:paramtypes', [])
                    ], TestChildView);
                    return TestChildView;
                }(core_1.View));
                var TestView = (function (_super) {
                    __extends(TestView, _super);
                    function TestView() {
                        _super.apply(this, arguments);
                    }
                    TestView = __decorate([
                        core_1.Component({
                            tagName: "ng-component",
                            template: "<ng-child></ng-child>",
                            views: {
                                foo: [TestChildView, { id: "ngId" }]
                            }
                        }), 
                        __metadata('design:paramtypes', [])
                    ], TestView);
                    return TestView;
                }(core_1.View));
                var view = new TestView();
                view.render();
                expect(view.views.get("foo") instanceof TestChildView).toBeTruthy();
                expect(view.el.querySelector("ng-el")).toBeTruthy();
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ViewSpec;
