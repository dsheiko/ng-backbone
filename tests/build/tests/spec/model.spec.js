"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var core_1 = require("../../src/core");
var utils_1 = require("../utils");
var TestModel = (function (_super) {
    __extends(TestModel, _super);
    function TestModel() {
        _super.apply(this, arguments);
        this.url = "./mock";
    }
    return TestModel;
}(core_1.Model));
function UtilsSpec() {
    describe("Model", function () {
        describe("#fetch", function () {
            it("returns a resolvable Promise", function (done) {
                var mock = new utils_1.MockFetch({ foo: "foo" });
                var test = new TestModel();
                test.fetch().then(function (model) {
                    expect(model.get("foo")).toBe("foo");
                    mock.restore();
                    done();
                });
            });
            it("does not fall on rejection", function (done) {
                var mock = new utils_1.MockFetch({ foo: "foo" }, new Error("Read error"));
                var test = new TestModel();
                test.fetch()
                    .catch(function (err) {
                    expect(err.message.length > 0).toBe(true);
                    mock.restore();
                    done();
                });
            });
        });
        describe("#save", function () {
            it("returns a resolvable Promise", function (done) {
                var mock = new utils_1.MockFetch();
                var test = new TestModel();
                test.save({ foo: "bar" }).then(function (model) {
                    expect(model.get("foo")).toBe("bar");
                    mock.restore();
                    done();
                });
            });
        });
        describe("#destroy", function () {
            it("returns a resolvable Promise", function (done) {
                var mock = new utils_1.MockFetch();
                var test = new TestModel({ foo: "bar" });
                test.destroy().then(function (model) {
                    expect(model.get("foo")).toBe("bar");
                    mock.restore();
                    done();
                });
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UtilsSpec;
