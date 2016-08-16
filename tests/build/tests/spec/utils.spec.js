"use strict";
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
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UtilsSpec;
