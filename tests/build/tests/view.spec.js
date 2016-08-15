"use strict";
var core_1 = require("../src/core");
var utils_1 = require("../src/core/utils");
var expect = chai.expect;
function ViewSpec() {
    describe("View", function () {
        describe("#modelsToScope", function () {
            it("converts flat into scope", function () {
                var models = utils_1.mapFrom({
                    foo: new core_1.Model({ name: "foo" }),
                    bar: new core_1.Model({ name: "bar" })
                }), scope = core_1.View.modelsToScope(models);
                expect(scope["foo"].name).to.eql("foo");
                expect(scope["bar"].name).to.eql("bar");
            });
            it("converts form states into scope", function () {
                var models = utils_1.mapFrom({
                    "foo.bar": new core_1.Model({ name: "bar" }),
                    "bar.baz": new core_1.Model({ name: "baz" })
                }), scope = core_1.View.modelsToScope(models);
                expect(scope["foo"]["bar"].name).to.eql("bar");
                expect(scope["bar"]["baz"].name).to.eql("baz");
            });
        });
        describe("#collectionsToScope", function () {
            it("converts collections into scope", function () {
                var collections = utils_1.mapFrom({
                    foo: new core_1.Collection([new core_1.Model({ name: "foo" })]),
                    bar: new core_1.Collection([new core_1.Model({ name: "bar" })])
                }), scope = core_1.View.collectionsToScope(collections);
                expect(scope["foo"][0].name).to.eql("foo");
                expect(scope["bar"][0].name).to.eql("bar");
            });
        });
    });
}
exports.ViewSpec = ViewSpec;
