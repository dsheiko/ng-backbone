"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var utils_1 = require("../../src/core/utils");
function UtilsSpec() {
    describe("Utils", function () {
        describe("#mapFrom", function () {
            it("converts object literal for map ", function () {
                var map = utils_1.mapFrom({
                    foo: 1,
                    bar: 2
                });
                expect(map instanceof Map).toBe(true);
                expect(map.get("foo")).toBe(1);
            });
        });
        describe("#mapAssign", function () {
            it("mixes in object literal into map ", function () {
                var map = new Map();
                map.set("foo", 1);
                utils_1.mapAssign(map, {
                    bar: 2
                });
                expect(map instanceof Map).toBe(true);
                expect(map.get("foo")).toBe(1);
                expect(map.get("bar")).toBe(2);
            });
        });
        describe("#Debounce", function () {
            it("debounces a method", function (done) {
                var Foo = (function () {
                    function Foo() {
                    }
                    Foo.prototype.bar = function () {
                        return "bar";
                    };
                    __decorate([
                        utils_1.Debounce(50), 
                        __metadata('design:type', Function), 
                        __metadata('design:paramtypes', []), 
                        __metadata('design:returntype', Object)
                    ], Foo.prototype, "bar", null);
                    return Foo;
                }());
                var foo = new Foo();
                foo.bar().then(function (val) {
                    expect(val).toBe("bar");
                    done();
                });
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UtilsSpec;
