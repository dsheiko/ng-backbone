"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var core_1 = require("../../src/core");
var utils_1 = require("../utils");
var TestCollection = (function (_super) {
    __extends(TestCollection, _super);
    function TestCollection() {
        _super.apply(this, arguments);
        this.url = "./mock";
    }
    return TestCollection;
}(core_1.Collection));
function UtilsSpec() {
    describe("Collection", function () {
        describe("#fetch", function () {
            it("returns a resolvable Promise", function (done) {
                utils_1.utils.mockFetch({ foo: "foo" });
                var col = new TestCollection();
                col.fetch().then(function (collection) {
                    var model = collection.shift();
                    expect(model.get("foo")).toBe("foo");
                    utils_1.utils.restoreFetch();
                    done();
                });
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UtilsSpec;
