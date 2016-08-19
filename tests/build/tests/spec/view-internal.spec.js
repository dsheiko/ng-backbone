"use strict";
var core_1 = require("../../src/core");
var utils_1 = require("../../src/core/utils");
function ViewInternalSpec() {
    describe("View (internal)", function () {
        describe("#modelsToScope", function () {
            it("converts flat into scope", function () {
                var models = utils_1.mapFrom({
                    foo: new core_1.Model({ name: "foo" }),
                    bar: new core_1.Model({ name: "bar" })
                }), scope = core_1.View.modelsToScope(models);
                expect(scope["foo"].name).toBe("foo");
                expect(scope["bar"].name).toBe("bar");
            });
            it("converts form states into scope", function () {
                var models = utils_1.mapFrom({
                    "foo.bar": new core_1.Model({ name: "bar" }),
                    "bar.baz": new core_1.Model({ name: "baz" })
                }), scope = core_1.View.modelsToScope(models);
                expect(scope["foo"]["bar"].name).toBe("bar");
                expect(scope["bar"]["baz"].name).toBe("baz");
            });
        });
        describe("#collectionsToScope", function () {
            it("converts collections into scope", function () {
                var collections = utils_1.mapFrom({
                    foo: new core_1.Collection([new core_1.Model({ name: "foo" })]),
                    bar: new core_1.Collection([new core_1.Model({ name: "bar" })])
                }), scope = core_1.View.collectionsToScope(collections);
                expect(scope["foo"][0].name).toBe("foo");
                expect(scope["bar"][0].name).toBe("bar");
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ViewInternalSpec;
