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
var formstate_1 = require("../../src/core/formstate");
var formvalidators_1 = require("../../src/core/formvalidators");
var utils_1 = require("../../src/core/utils");
function FormStateSpec() {
    describe("FormState", function () {
        beforeEach(function () {
            this.boundingBox = document.createElement("div");
        });
        describe("#isCheckboxRadio", function () {
            beforeEach(function () {
                this.input = document.createElement("input");
            });
            it("returns true for checkbox", function () {
                this.input.type = "checkbox";
                expect(formstate_1.FormState.prototype.isCheckboxRadio(this.input)).toBe(true);
            });
            it("returns true for radio", function () {
                this.input.type = "radio";
                expect(formstate_1.FormState.prototype.isCheckboxRadio(this.input)).toBe(true);
            });
            it("returns true for text", function () {
                this.input.type = "text";
                expect(formstate_1.FormState.prototype.isCheckboxRadio(this.input)).toBe(false);
            });
        });
        describe("#validateRequired", function () {
            beforeEach(function () {
                this.input = document.createElement("input");
                this.state = new formstate_1.FormState();
            });
            it("sets valueMissing true for empty required", function () {
                this.input.value = "";
                this.input.setAttribute("required", true);
                this.state.validateRequired(this.input);
                expect(this.state.get("valueMissing")).toBe(true);
            });
            it("sets valueMissing false for empty not-required", function () {
                this.input.value = "";
                this.state.validateRequired(this.input);
                expect(this.state.get("valueMissing")).toBe(false);
            });
            it("sets valueMissing false for not-empty required", function () {
                this.input.value = "not-empty";
                this.input.setAttribute("required", true);
                this.state.validateRequired(this.input);
                expect(this.state.get("valueMissing")).toBe(false);
            });
            it("fires change event", function (done) {
                this.input.value = "";
                this.input.setAttribute("required", true);
                this.state.on("change", function (state) {
                    expect(state.get("valueMissing")).toBe(true);
                    done();
                });
                this.state.validateRequired(this.input);
                this.state.checkValidity();
            });
        });
        describe("#validateRange", function () {
            beforeEach(function () {
                this.input = document.createElement("input");
                this.state = new formstate_1.FormState();
            });
            it("sets rangeUnderflow true for underflow value", function () {
                this.input.value = 1;
                this.input.setAttribute("min", "10");
                this.state.validateRange(this.input);
                expect(this.state.get("rangeUnderflow")).toBe(true);
                expect(this.state.get("validationMessage").length).toBeTruthy();
            });
            it("sets rangeOverflow true for overflow value", function () {
                this.input.value = 100;
                this.input.setAttribute("max", "10");
                this.state.validateRange(this.input);
                expect(this.state.get("rangeOverflow")).toBe(true);
                expect(this.state.get("validationMessage").length).toBeTruthy();
            });
            it("resets rangeUnderflow/rangeOverflow for value in the range", function () {
                this.input.value = 10;
                this.input.setAttribute("min", "1");
                this.input.setAttribute("max", "100");
                this.state.validateRange(this.input);
                expect(this.state.get("rangeUnderflow")).toBe(false);
                expect(this.state.get("rangeOverflow")).toBe(false);
                expect(this.state.get("validationMessage").length).toBeFalsy();
            });
            it("fires change event", function (done) {
                this.input.value = 1;
                this.input.setAttribute("min", "10");
                this.state.on("change", function (state) {
                    expect(state.get("rangeUnderflow")).toBe(true);
                    done();
                });
                this.state.validateRange(this.input);
                this.state.checkValidity();
            });
        });
        describe("#patternMismatch", function () {
            beforeEach(function () {
                this.input = document.createElement("input");
                this.state = new formstate_1.FormState();
            });
            it("sets patternMismatch true for a value that does not match pattern", function () {
                this.input.value = "invalid";
                this.input.setAttribute("pattern", "[A-Z]{3}[0-9]{4}");
                this.state.patternMismatch(this.input);
                expect(this.state.get("patternMismatch")).toBe(true);
                expect(this.state.get("validationMessage").length).toBeTruthy();
            });
        });
        describe("#validateTypeMismatch", function () {
            beforeEach(function () {
                this.input = document.createElement("input");
                this.input.value = "invalid";
                this.state = new formstate_1.FormState();
            });
            describe("email", function () {
                it("validates", function () {
                    var _this = this;
                    this.input.setAttribute("type", "email");
                    this.state.validateTypeMismatch(this.input)
                        .then(function () {
                        expect(_this.state.get("typeMismatch")).toBe(true);
                        expect(_this.state.get("validationMessage").length).toBeTruthy();
                    });
                });
            });
            describe("url", function () {
                it("validates", function () {
                    var _this = this;
                    this.input.setAttribute("type", "url");
                    this.state.validateTypeMismatch(this.input)
                        .then(function () {
                        expect(_this.state.get("typeMismatch")).toBe(true);
                        expect(_this.state.get("validationMessage").length).toBeTruthy();
                    });
                });
            });
            describe("tel", function () {
                it("validates", function () {
                    var _this = this;
                    this.input.setAttribute("type", "tel");
                    this.state.validateTypeMismatch(this.input)
                        .then(function () {
                        expect(_this.state.get("typeMismatch")).toBe(true);
                        expect(_this.state.get("validationMessage").length).toBeTruthy();
                    });
                });
            });
            describe("custom type (injected as object literal)", function () {
                it("validates", function () {
                    var _this = this;
                    this.state = new formstate_1.FormState({
                        formValidators: {
                            foo: function (value) {
                                var pattern = /^(foo|bar)$/;
                                if (pattern.test(value)) {
                                    return Promise.resolve();
                                }
                                return Promise.reject("Invalid value");
                            }
                        }
                    });
                    this.input.setAttribute("type", "foo");
                    this.state.validateTypeMismatch(this.input)
                        .then(function () {
                        expect(_this.state.get("typeMismatch")).toBe(true);
                        expect(_this.state.get("validationMessage").length).toBeTruthy();
                    });
                });
            });
            describe("custom type (injected as class)", function () {
                it("validates", function () {
                    var _this = this;
                    var CustomValidators = (function (_super) {
                        __extends(CustomValidators, _super);
                        function CustomValidators() {
                            _super.apply(this, arguments);
                        }
                        CustomValidators.prototype.foo = function (value) {
                            var pattern = /^(foo|bar)$/;
                            if (pattern.test(value)) {
                                return Promise.resolve();
                            }
                            return Promise.reject("Invalid value");
                        };
                        return CustomValidators;
                    }(formvalidators_1.FormValidators));
                    this.state = new formstate_1.FormState({
                        formValidators: CustomValidators
                    });
                    this.input.setAttribute("type", "foo");
                    this.state.validateTypeMismatch(this.input)
                        .then(function () {
                        expect(_this.state.get("typeMismatch")).toBe(true);
                        expect(_this.state.get("validationMessage").length).toBeTruthy();
                    });
                });
            });
            describe("custom type debounced", function () {
                it("validates", function () {
                    var _this = this;
                    var CustomValidators = (function (_super) {
                        __extends(CustomValidators, _super);
                        function CustomValidators() {
                            _super.apply(this, arguments);
                        }
                        CustomValidators.prototype.foo = function (value) {
                            var pattern = /^(foo|bar)$/;
                            if (pattern.test(value)) {
                                return Promise.resolve();
                            }
                            return Promise.reject("Invalid value");
                        };
                        __decorate([
                            utils_1.Debounce(200), 
                            __metadata('design:type', Function), 
                            __metadata('design:paramtypes', [String]), 
                            __metadata('design:returntype', Promise)
                        ], CustomValidators.prototype, "foo", null);
                        return CustomValidators;
                    }(formvalidators_1.FormValidators));
                    this.state = new formstate_1.FormState({
                        formValidators: CustomValidators
                    });
                    this.input.setAttribute("type", "foo");
                    this.state.validateTypeMismatch(this.input)
                        .then(function () {
                        expect(_this.state.get("typeMismatch")).toBe(true);
                        expect(_this.state.get("validationMessage").length).toBeTruthy();
                    });
                });
            });
        });
        describe("#onInputChange", function () {
            beforeEach(function () {
                this.input = document.createElement("input");
                this.state = new formstate_1.FormState();
            });
            it("populates state", function (done) {
                var _this = this;
                this.input.value = "";
                this.input.setAttribute("required", true);
                this.state.on("change", function () {
                    expect(_this.state.get("value")).toBe(_this.input.value);
                    expect(_this.state.get("valueMissing")).toBe(true);
                    expect(_this.state.get("dirty")).toBe(true);
                    expect(_this.state.get("valid")).toBe(false);
                    expect(_this.state.get("validationMessage").length).toBeTruthy();
                    done();
                });
                this.state.onInputChange(this.input);
            });
        });
    });
}
exports.FormStateSpec = FormStateSpec;
;
