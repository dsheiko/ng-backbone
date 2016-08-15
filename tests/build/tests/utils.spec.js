"use strict";
var utils_1 = require("../src/core/utils");
var expect = chai.expect;
function UtilsSpec() {
    describe("Utils", function () {
        describe("#mapFrom", function () {
            it("converts object literal for map ", function () {
                var map = utils_1.mapFrom({
                    foo: 1,
                    bar: 2
                });
                expect(map).to.be.instanceOf(Map);
                expect(map.get("foo")).to.eql(1);
            });
        });
        describe("#mapAssign", function () {
            it("mixes in object literal into map ", function () {
                var map = new Map();
                map.set("foo", 1);
                utils_1.mapAssign(map, {
                    bar: 2
                });
                expect(map).to.be.instanceOf(Map);
                expect(map.get("foo")).to.eql(1);
                expect(map.get("bar")).to.eql(2);
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UtilsSpec;
