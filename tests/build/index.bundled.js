(function(){
/* jshint unused: false */
/**
 * @typedef module
 * @type {object}
 * @property {string} id - the identifier for the module.
 * @property {string} filename - the fully resolved filename to the module.
 * @property {module} parent - the module that required this one.
 * @property {module[]} children - the module objects required by this one.
 * @property {boolean} loaded - whether or not the module is done loading, or is in the process of loading
 */
/**
	*
	* Define scope for `require`
	*/
var _require = (function(){
	var /**
			* Store modules (types assigned to module.exports)
			* @type {module[]}
			*/
			imports = [],
			/**
			 * Store the code that constructs a module (and assigns to exports)
			 * @type {*[]}
			 */
			factories = [],
			/**
			 * @type {module}
			 */
			module = {},
			/**
			 * Implement CommonJS `require`
			 * http://wiki.commonjs.org/wiki/Modules/1.1.1
			 * @param {string} filename
			 * @returns {*}
			 */
			__require = function( filename ) {

				if ( typeof imports[ filename ] !== "undefined" ) {
					return imports[ filename ].exports;
				}
				module = {
					id: filename,
					filename: filename,
					parent: module,
					children: [],
					exports: {},
					loaded: false
				};
				if ( typeof factories[ filename ] === "undefined" ) {
					throw new Error( "The factory of " + filename + " module not found" );
				}
				// Called first time, so let's run code constructing (exporting) the module
				imports[ filename ] = factories[ filename ]( _require, module.exports, module,
          typeof window !== "undefined" ? window : global );
				imports[ filename ].loaded = true;
				if ( imports[ filename ].parent.children ) {
					imports[ filename ].parent.children.push( imports[ filename ] );
				}
				return imports[ filename ].exports;
			};
	/**
	 * Register module
	 * @param {string} filename
	 * @param {function(module, *)} moduleFactory
	 */
	__require.def = function( filename, moduleFactory ) {
		factories[ filename ] = moduleFactory;
	};
	return __require;
}());
// Must run for UMD, but under CommonJS do not conflict with global require
if ( typeof require === "undefined" ) {
	require = _require;
}
_require.def( "tests/build/tests/index.spec.js", function( _require, exports, module, global ){
"use strict";
/// <reference path="../src/core.d.ts" />
var formstate_spec_1 = _require( "tests/build/tests/spec/formstate.spec.js" );
var view_spec_1 = _require( "tests/build/tests/spec/view.spec.js" );
var formview_spec_1 = _require( "tests/build/tests/spec/formview.spec.js" );
var utils_spec_1 = _require( "tests/build/tests/spec/utils.spec.js" );
var collection_spec_1 = _require( "tests/build/tests/spec/collection.spec.js" );
utils_spec_1.default();
formstate_spec_1.FormStateSpec();
view_spec_1.ViewSpec();
formview_spec_1.FormViewSpec();
collection_spec_1.default();


  return module;
});

_require.def( "tests/build/tests/spec/formstate.spec.js", function( _require, exports, module, global ){
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
var formstate_1 = _require( "tests/build/src/core/formstate.js" );
var formvalidators_1 = _require( "tests/build/src/core/formvalidators.js" );
var utils_1 = _require( "tests/build/src/core/utils.js" );
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

  module.exports = exports;


  return module;
});

_require.def( "tests/build/tests/spec/formview.spec.js", function( _require, exports, module, global ){
"use strict";
var core_1 = _require( "tests/build/src/core.js" );
var formstate_1 = _require( "tests/build/src/core/formstate.js" );
function FormViewSpec() {
    describe("FormView", function () {
        describe("#_findGroups", function () {
            it("finds forms within boundinx box", function () {
                var el = document.createElement("div"), view = new core_1.FormView({
                    el: el
                });
                el.innerHTML = "<div><form data-ng-group=\"foo\"></form><form data-ng-group=\"bar\"></form></div>";
                var forms = view._findGroups();
                expect(Array.isArray(forms)).toBe(true);
                expect(forms[0].dataset["ngGroup"]).toBe("foo");
                expect(forms[1].dataset["ngGroup"]).toBe("bar");
            });
            it("finds form on boundinx box", function () {
                var el = document.createElement("form"), view = new core_1.FormView({
                    el: el
                });
                el.innerHTML = "<div><form data-ng-group=\"foo\"></form><form data-ng-group=\"bar\"></form></div>";
                el.dataset["ngGroup"] = "baz";
                var forms = view._findGroups();
                // If boundinx box not inner forms allowed
                expect(forms.length).toBe(1);
                expect(forms[0].dataset["ngGroup"]).toBe("baz");
            });
        });
        describe("#_bindGroup", function () {
            it("sets a model to  this.models.FormName.form", function () {
                var el = document.createElement("form"), view = new core_1.FormView({
                    el: el
                });
                el.dataset["ngGroup"] = "baz";
                view._bindGroup(el, "baz");
                var model = view.models.get("baz.form");
                expect(model instanceof formstate_1.FormState).toBe(true);
            });
        });
        describe("#_findGroupElements", function () {
            it("finds all form inputs", function () {
                var el = document.createElement("form"), next, view = new core_1.FormView({
                    el: el
                });
                el.dataset["ngGroup"] = "baz";
                el.innerHTML = "<div>\n<input name=\"inputText\" />\n<input name=\"inputCheckbox\" type=\"checkbox\" />\n<input name=\"inputEmail\" type=\"email\" />\n<select name=\"select\"></select>\n<custom name=\"quiz\"></custom>\n</div>";
                var els = view._findGroupElements(el);
                expect(Array.isArray(els)).toBe(true);
                expect(els.length).toBe(4);
            });
        });
        describe("#_bindGroupElement", function () {
            it("finds all form elements", function () {
                var el = document.createElement("form"), next, view = new core_1.FormView({
                    el: el
                });
                el.dataset["ngGroup"] = "baz";
                view._bindGroup(el, "foo");
                view._bindGroupElement("foo", "bar");
                var model = view.models.get("foo.bar");
                expect(model instanceof formstate_1.FormState).toBe(true);
            });
        });
    });
}
exports.FormViewSpec = FormViewSpec;

  module.exports = exports;


  return module;
});

_require.def( "tests/build/tests/spec/utils.spec.js", function( _require, exports, module, global ){
"use strict";
var utils_1 = _require( "tests/build/src/core/utils.js" );
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

  module.exports = exports;


  return module;
});

_require.def( "tests/build/tests/spec/view.spec.js", function( _require, exports, module, global ){
"use strict";
var core_1 = _require( "tests/build/src/core.js" );
var utils_1 = _require( "tests/build/src/core/utils.js" );
function ViewSpec() {
    describe("View", function () {
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
exports.ViewSpec = ViewSpec;

  module.exports = exports;


  return module;
});

_require.def( "tests/build/tests/spec/collection.spec.js", function( _require, exports, module, global ){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var core_1 = _require( "tests/build/src/core.js" );
var utils_1 = _require( "tests/build/tests/utils.js" );
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

  module.exports = exports;


  return module;
});

_require.def( "tests/build/src/core/formstate.js", function( _require, exports, module, global ){
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
var model_1 = _require( "tests/build/src/core/model.js" );
var exception_1 = _require( "tests/build/src/core/exception.js" );
var formvalidators_1 = _require( "tests/build/src/core/formvalidators.js" );
var utils_1 = _require( "tests/build/src/core/utils.js" );
var ERR_TYPES = [
    "valueMissing", "rangeOverflow", "rangeUnderflow",
    "typeMismatch", "patternMismatch"], SILENT = { silent: true };
var FormState = (function (_super) {
    __extends(FormState, _super);
    function FormState() {
        _super.apply(this, arguments);
    }
    FormState.prototype.defaults = function () {
        return {
            "value": "",
            "valid": true,
            "touched": false,
            "dirty": false,
            "valueMissing": false,
            "rangeOverflow": false,
            "rangeUnderflow": false,
            "typeMismatch": false,
            "patternMismatch": false,
            "validationMessage": ""
        };
    };
    FormState.prototype.initialize = function (options) {
        this.formValidators = new formvalidators_1.FormValidators();
        // Inject custom formValidators
        if (options && "formValidators" in options) {
            this._assignFormValidators(options.formValidators);
        }
    };
    /**
     *
     */
    FormState.prototype._assignFormValidators = function (formValidators) {
        if (typeof formValidators !== "function") {
            Object.assign(this.formValidators, formValidators);
            return;
        }
        this.formValidators = new formValidators();
        if (!(this.formValidators instanceof formvalidators_1.FormValidators)) {
            throw new exception_1.Exception("Specified option formValidators has invalid type");
        }
    };
    /**
     * Check if a given input is a checkbox or radio
     */
    FormState.prototype.isCheckboxRadio = function (el) {
        return el instanceof HTMLInputElement && ["checkbox", "radio"].indexOf(el.type) !== -1;
    };
    /**
     * Update `valid` and `validationMessage` according to the current model state
     */
    FormState.prototype.checkValidity = function () {
        var _this = this;
        var invalid = ERR_TYPES.some(function (key) {
            return _this.attributes[key];
        });
        this.set("valid", !invalid);
        if (!invalid) {
            this.set("validationMessage", "", SILENT);
        }
    };
    /**
     * Validate <input required/> doesn't have an empty value
     */
    FormState.prototype.validateRequired = function (el) {
        if (!el.hasAttribute("required")) {
            return;
        }
        var value = String(el.value), valid = value.trim().length;
        this.set("valueMissing", !valid, SILENT);
        valid || this.set("validationMessage", "This field is mandatory", SILENT);
    };
    /**
     * Validate <input min max /> value in the given range
     */
    FormState.prototype.validateRange = function (el) {
        if (!(el instanceof HTMLInputElement)) {
            throw TypeError("el must be instance of HTMLInputElement");
        }
        if (el.hasAttribute("max")) {
            var valid = Number(el.value) < Number(el.getAttribute("max"));
            this.set("rangeOverflow", !valid, SILENT);
            valid || this.set("validationMessage", "The value is too high", SILENT);
        }
        if (el.hasAttribute("min")) {
            var valid = Number(el.value) > Number(el.getAttribute("min"));
            this.set("rangeUnderflow", !valid, SILENT);
            valid || this.set("validationMessage", "The value is too low", SILENT);
        }
    };
    /**
     * Validate by `pattern`
     */
    FormState.prototype.patternMismatch = function (el) {
        if (!el.hasAttribute("pattern")) {
            return;
        }
        try {
            var pattern = new RegExp(el.getAttribute("pattern"));
            this.set("patternMismatch", !pattern.test(el.value), SILENT);
            this.set("validationMessage", "The value does not match the pattern", SILENT);
        }
        catch (err) {
            throw new exception_1.Exception("Invalid pattern " + el.getAttribute("pattern"));
        }
    };
    FormState.prototype.validateTypeMismatch = function (el) {
        var _this = this;
        var value = el.value, itype = el.getAttribute("type");
        if (!(itype in this.formValidators)) {
            return Promise.resolve();
        }
        return this.formValidators[itype](value)
            .catch(function (err) {
            if (err instanceof Error) {
                throw new exception_1.Exception(err.message);
            }
            _this.set("typeMismatch", true, SILENT);
            _this.set("validationMessage", err, SILENT);
        });
    };
    FormState.prototype.
    /**
     * Handle change/input events on the input
     */
    onInputChange = function (el) {
        var _this = this;
        this.set("dirty", true, SILENT);
        if (!this.isCheckboxRadio(el)) {
            this.set("value", el.value, SILENT);
            this.validateRequired(el);
            if (el instanceof HTMLInputElement) {
                this.validateRange(el);
            }
            this.patternMismatch(el);
            this.validateTypeMismatch(el)
                .then(function () {
                _this.checkValidity();
            });
        }
        else {
            this.set("value", el.checked, SILENT);
            this.checkValidity();
        }
    };
    /**
     * Handle focus event on the input
     */
    FormState.prototype.onInputFocus = function () {
        this.set("touched", true);
    };
    __decorate([
        utils_1.Debounce(100), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], FormState.prototype, "onInputChange", null);
    return FormState;
}(model_1.Model));
exports.FormState = FormState;
var GroupState = (function (_super) {
    __extends(GroupState, _super);
    function GroupState() {
        _super.apply(this, arguments);
    }
    return GroupState;
}(FormState));
exports.GroupState = GroupState;
var ControlState = (function (_super) {
    __extends(ControlState, _super);
    function ControlState() {
        _super.apply(this, arguments);
    }
    return ControlState;
}(FormState));
exports.ControlState = ControlState;

  module.exports = exports;


  return module;
});

_require.def( "tests/build/src/core/formvalidators.js", function( _require, exports, module, global ){
"use strict";
var FormValidators = (function () {
    function FormValidators() {
    }
    FormValidators.prototype.email = function (value) {
        var pattern = /^[a-zA-Z0-9\!\#\$\%\&\'\*\+\-\/\=\?\^\_\`\{\|\}\~\.]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,4}$/g;
        if (pattern.test(value)) {
            return Promise.resolve();
        }
        return Promise.reject("Please enter a valid email address");
    };
    FormValidators.prototype.tel = function (value) {
        var pattern = /^\+(?:[0-9] ?){6,14}[0-9]$/;
        if (pattern.test(value)) {
            return Promise.resolve();
        }
        return Promise.reject("Please enter a valid tel. number +1 11 11 11");
    };
    FormValidators.prototype.url = function (value) {
        var pattern = new RegExp("^(https?:\\/\\/)?((([a-z\\d]([a-z\\d\\-]*[a-z\\d])*)\\.)" +
            "+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[\\-a-z\\d%_.~+]*)" +
            "*(\\?[;&a-z\\d%_.~+=\\-]*)?(\\#[\\-a-z\\d_]*)?$", "i");
        if (pattern.test(value)) {
            return Promise.resolve();
        }
        return Promise.reject("Please enter a valid URL");
    };
    return FormValidators;
}());
exports.FormValidators = FormValidators;
;

  module.exports = exports;


  return module;
});

_require.def( "tests/build/src/core/utils.js", function( _require, exports, module, global ){
"use strict";
/**
 * Decorator to debounce
 */
function Debounce(wait) {
    return function (target, propKey, descriptor) {
        var callback = descriptor.value;
        var timer = null;
        return Object.assign({}, descriptor, {
            value: function () {
                var _this = this;
                var args = Array.from(arguments);
                clearTimeout(timer);
                return new Promise(function (resolve) {
                    timer = setTimeout(function () {
                        timer = null;
                        resolve(callback.apply(_this, args));
                    }, wait);
                });
            }
        });
    };
}
exports.Debounce = Debounce;
/**
 * Decorator to mixin
 */
function Mixin(mixin) {
    return function (target) {
        Object.assign(target.prototype, mixin);
    };
}
exports.Mixin = Mixin;
function mapFrom(mixin) {
    var map = new Map();
    mapAssign(map, mixin);
    return map;
}
exports.mapFrom = mapFrom;
function mapAssign(map, mixin) {
    if (mixin === void 0) { mixin = {}; }
    Object.keys(mixin).forEach(function (key) {
        map.set(key, mixin[key]);
    });
}
exports.mapAssign = mapAssign;

  module.exports = exports;


  return module;
});

_require.def( "tests/build/src/core.js", function( _require, exports, module, global ){
/// <reference path="../node_modules/typescript/lib/lib.d.ts" />
/// <reference path="./core.d.ts" />
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
/**
 * Facade
 */
__export(_require( "tests/build/src/core/exception.js" ));
__export(_require( "tests/build/src/core/component.js" ));
__export(_require( "tests/build/src/core/utils.js" ));
__export(_require( "tests/build/src/core/view.js" ));
__export(_require( "tests/build/src/core/formview.js" ));
__export(_require( "tests/build/src/core/model.js" ));
__export(_require( "tests/build/src/core/collection.js" ));

  module.exports = exports;


  return module;
});

_require.def( "tests/build/tests/utils.js", function( _require, exports, module, global ){
"use strict";
var fetchOrigin = window.fetch;
var utils = (function () {
    function utils() {
    }
    utils.mockFetch = function (json) {
        window.fetch = function (url, init) {
            var blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' }), rsp = new Response(blob, { "status": 200 });
            return Promise.resolve(rsp);
        };
    };
    utils.restoreFetch = function () {
        window.fetch = fetchOrigin;
    };
    return utils;
}());
exports.utils = utils;

  module.exports = exports;


  return module;
});

_require.def( "tests/build/src/core/model.js", function( _require, exports, module, global ){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Model = (function (_super) {
    __extends(Model, _super);
    function Model(attributes, options) {
        _super.call(this, attributes, options);
        this.options = options || {};
    }
    return Model;
}(Backbone.Model));
exports.Model = Model;

  module.exports = exports;


  return module;
});

_require.def( "tests/build/src/core/component.js", function( _require, exports, module, global ){
"use strict";
var ngtemplate_1 = _require( "tests/build/src/ngtemplate.js" );
var utils_1 = _require( "tests/build/src/core/utils.js" );
function Component(options) {
    var el = typeof options.el === "string" ? document.querySelector(options.el) : options.el;
    if (!(el instanceof Element)) {
        throw new Error("options.el not found");
    }
    var mixin = {
        models: utils_1.mapFrom(options.models) || null,
        collections: utils_1.mapFrom(options.collections) || null,
        el: options.el || null,
        events: options.events || null,
        id: options.id || null,
        className: options.className || null,
        tagName: options.tagName || null,
        template: new ngtemplate_1.NgTemplate(el, options.template),
        formValidators: options.formValidators || null
    };
    return function (target) {
        Object.assign(target.prototype, mixin);
        // This way we trick invokation of this.initialize after constructor
        // Keeping in mind that @Component belongs to View that knows about this._initialize
        if ("initialize" in target.prototype) {
            _a = [target.prototype.initialize, function () { }], target.prototype._initialize = _a[0], target.prototype.initialize = _a[1];
        }
        var _a;
    };
}
exports.Component = Component;

  module.exports = exports;


  return module;
});

_require.def( "tests/build/src/core/exception.js", function( _require, exports, module, global ){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Custom exception extending Error
 * @param {string} message
 */
var Exception = (function (_super) {
    __extends(Exception, _super);
    function Exception(message) {
        _super.call(this, message);
        this.name = "NgBackboneError",
            this.message = message;
    }
    return Exception;
}(Error));
exports.Exception = Exception;

  module.exports = exports;


  return module;
});

_require.def( "tests/build/src/core/view.js", function( _require, exports, module, global ){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var utils_1 = _require( "tests/build/src/core/utils.js" );
var View = (function (_super) {
    __extends(View, _super);
    function View(options) {
        if (options === void 0) { options = {}; }
        _super.call(this, options);
        this.options = options;
        this.initializeOptions(options);
        this.models.size && this._bindModels();
        this.collections && this._bindCollections();
        // Call earlier cached this.initialize
        this._initialize && this._initialize(options);
    }
    View.prototype._bindModels = function () {
        var _this = this;
        this.models.forEach(function (model) {
            _this.stopListening(model);
            _this.listenTo(model, "change", _this.render);
        });
    };
    View.prototype._bindCollections = function () {
        var _this = this;
        this.collections.forEach(function (collection) {
            _this.stopListening(collection);
            //      this.listenTo( collection, "all", ( ...args: any[]) => {
            //        console.info( "collection all", args );
            //      });
            _this.listenTo(collection, "change destroy sync", _this._onCollectionChange);
        });
    };
    /**
     * When any of this.collections updates we re-subscribe all itts models and fire render
     */
    View.prototype._onCollectionChange = function () {
        // @TODO control change of collection models
        this.render();
    };
    /**
     * collections/models passed in options, take them
     */
    View.prototype.initializeOptions = function (options) {
        if (!("models" in this)) {
            this.models = new Map();
        }
        if (!("collections" in this)) {
            this.collections = new Map();
        }
        if ("collections" in options) {
            utils_1.mapAssign(this.collections, options.collections);
        }
        if ("models" in options) {
            utils_1.mapAssign(this.models, options.models);
        }
    };
    /**
     * Converts { foo: Collection, bar: Collection } into
     * { foo: [{},{}], bar: [{},{}] }
     */
    View.collectionsToScope = function (collections) {
        var scope = {};
        collections.forEach(function (collection, key) {
            scope[key] = [];
            collection.forEach(function (model) {
                var data = model.toJSON();
                if (model.id) {
                    data.id = model.id;
                }
                scope[key].push(data);
            });
        });
        return scope;
    };
    /**
     * Converts model map into JSON
     */
    View.modelsToScope = function (models) {
        var scope = {};
        models.forEach(function (model, key) {
            // "groupName.controlName" -> { groupName: { controlName: val } }
            if (key.indexOf(".") !== -1) {
                var ref = key.split(".");
                scope[ref[0]] = scope[ref[0]] || {};
                scope[ref[0]][ref[1]] = model.toJSON();
                return;
            }
            scope[key] = model.toJSON();
        });
        return scope;
    };
    View.prototype.render = function () {
        var ms = performance.now();
        var scope = {};
        this.models && Object.assign(scope, View.modelsToScope(this.models));
        this.collections && Object.assign(scope, View.collectionsToScope(this.collections));
        // console.log( "#RENDER: templating ", performance.now() - ms, " ms", scope, this );
        try {
            this.template.sync(scope);
        }
        catch (err) {
            console.error(err.message);
        }
        return this;
    };
    /**
    * Enhance listenTo to process maps
    * @example:
    * this.listenToMap( eventEmitter, {
    *     "cleanup-list": this.onCleanpList,
    *     "update-list": this.syncCollection
    *   });
    * @param {Backbone.Events} other
    * @param {NgBackbone.DataMap} event
    *
    * @returns {Backbone.NativeView}
    */
    View.prototype.listenToMap = function (eventEmitter, event) {
        Object.keys(event).forEach(function (key) {
            Backbone.NativeView.prototype.listenTo.call(this, eventEmitter, key, event[key]);
        }, this);
        return this;
    };
    return View;
}(Backbone.NativeView));
exports.View = View;

  module.exports = exports;


  return module;
});

_require.def( "tests/build/src/core/formview.js", function( _require, exports, module, global ){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var view_1 = _require( "tests/build/src/core/view.js" );
var formstate_1 = _require( "tests/build/src/core/formstate.js" );
var utils_1 = _require( "tests/build/src/core/utils.js" );
var ControlUpdateStates = (function () {
    function ControlUpdateStates() {
        this.valid = [];
        this.dirty = [];
    }
    return ControlUpdateStates;
}());
var FormView = (function (_super) {
    __extends(FormView, _super);
    function FormView() {
        _super.apply(this, arguments);
        this._groupBound = false;
    }
    FormView.prototype.render = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        view_1.View.prototype.render.apply(this, args);
        this._groupBound || this.bindGroups();
        return this;
    };
    /**
     * Bind form and inputs
     */
    FormView.prototype.bindGroups = function () {
        var _this = this;
        this._groupBound = true;
        this._findGroups().forEach(function (groupEl) {
            var groupName = groupEl.dataset["ngGroup"];
            _this._bindGroup(groupEl, groupName);
            // this form is already bound
            if (!groupName) {
                return;
            }
            _this._findGroupElements(groupEl)
                .forEach(function (inputEl) {
                _this._bindGroupElement(groupName, inputEl.name);
                _this._subscribeGroupElement(groupName, inputEl);
            });
            // set initial state (.eg. requried contols - are invalid already)
            _this._updateGroupValidatity(groupName);
            _this.render();
        });
    };
    /**
     * Return array of form elements (either with all the forms found in the view
     * or with only form which is this.el)
     */
    FormView.prototype._findGroups = function () {
        if (this.el.dataset["ngGroup"]) {
            return [this.el];
        }
        return Array.from(this.el.querySelectorAll("[data-ng-group]"));
    };
    /**
     * Bind a given form to State model ( myform.form = state model )
     */
    FormView.prototype._bindGroup = function (el, groupName) {
        if (this.models.has(groupName)) {
            return;
        }
        // make sure form is not self-validated
        el.setAttribute("novalidate", "true");
        var model = new formstate_1.GroupState({ formValidators: this.formValidators });
        this.models.set(FormView.getKey(groupName, "form"), model);
        this.stopListening(model);
        this.listenTo(model, "change", this.render);
    };
    FormView.getKey = function (groupName, controlName) {
        return groupName + "." + controlName;
    };
    /**
     * Bind a given input to State model ( myform.myInput = state model )
     */
    FormView.prototype._bindGroupElement = function (groupName, controlName) {
        var _this = this;
        var key = FormView.getKey(groupName, controlName);
        if (this.models.has(key)) {
            return;
        }
        var model = new formstate_1.ControlState({ formValidators: this.formValidators });
        this.models.set(key, model);
        this.stopListening(model);
        this.listenTo(model, "change", function () {
            _this._onFromControlModelChange(groupName);
        });
    };
    /**
     * Find all the inputs in the given form
     */
    FormView.prototype._findGroupElements = function (groupEl) {
        return Array.from(groupEl.querySelectorAll("[name]"))
            .filter(function (el) {
            return el instanceof HTMLInputElement
                || el instanceof HTMLSelectElement
                || el instanceof HTMLTextAreaElement;
        });
    };
    /**
     * Subscribe handlers for input events
     */
    FormView.prototype._subscribeGroupElement = function (groupName, inputEl) {
        var controlName = inputEl.name, inputModel, key = FormView.getKey(groupName, controlName), 
        // find input elements within this.el
        sel = "[name=\"" + controlName + "\"]";
        if (!this.el.dataset["ngGroup"]) {
            // find input elements per form
            sel = "[data-ng-group=\"" + groupName + "\"] " + sel;
        }
        inputModel = this.models.get(key);
        var onChange = function () {
            inputModel.onInputChange(inputEl);
        };
        this.delegate("change", sel, onChange);
        this.delegate("input", sel, onChange);
        this.delegate("focus", sel, function () {
            inputModel.onInputFocus();
        });
    };
    FormView.prototype._onFromControlModelChange = function (groupName) {
        this._updateGroupValidatity(groupName);
        this.render();
    };
    FormView.prototype._updateGroupValidatity = function (groupName) {
        var groupModel = this.models.get(FormView.getKey(groupName, "form")), states = new ControlUpdateStates(), curValid, curDirty;
        FormView.filterModels(this.models, groupName)
            .forEach(function (model) {
            states.valid.push(model.get("valid"));
            states.dirty.push(model.get("dirty"));
        });
        curValid = !states.valid.some(function (toogle) { return toogle === false; });
        curDirty = states.dirty.every(function (toogle) { return toogle; });
        groupModel.set("valid", curValid);
        groupModel.set("dirty", curDirty);
        // console.info( `group ${groupName}: valid: ${curValid}, dirty: ${curDirty}` );
    };
    FormView.filterModels = function (models, groupName) {
        var filtered = utils_1.mapFrom({});
        models.forEach(function (model, key) {
            if (key !== groupName + ".form" && key.startsWith(groupName + ".")) {
                filtered.set(key, model);
            }
        });
        return filtered;
    };
    /**
     * Get form data of a specified form
     */
    FormView.prototype.getData = function (groupName) {
        var data = {};
        FormView.filterModels(this.models, groupName)
            .forEach(function (model, key) {
            var tmp, controlName;
            _a = key.split("."), tmp = _a[0], controlName = _a[1];
            if (controlName === "form") {
                return;
            }
            data[controlName] = model.get("value");
            var _a;
        });
        return data;
    };
    return FormView;
}(view_1.View));
exports.FormView = FormView;

  module.exports = exports;


  return module;
});

_require.def( "tests/build/src/core/collection.js", function( _require, exports, module, global ){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Collection = (function (_super) {
    __extends(Collection, _super);
    function Collection(models, options) {
        _super.call(this, models, options);
        this.options = options || {};
    }
    /**
     * Shortcut for sorting
     */
    Collection.prototype.orderBy = function (key) {
        this.comparator = key;
        this.sort();
        this.trigger("change");
        return this;
    };
    Collection.prototype.fetch = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return new Promise(function (resolve, reject) {
            options.success = function () {
                return resolve.apply(this, arguments);
            };
            options.error = function () {
                return reject.apply(this, arguments);
            };
            Backbone.Collection.prototype.fetch.call(_this, options);
        });
    };
    return Collection;
}(Backbone.Collection));
exports.Collection = Collection;

  module.exports = exports;


  return module;
});

_require.def( "tests/build/src/ngtemplate.js", function( _require, exports, module, global ){
"use strict";
/// <reference path="./ngtemplate.d.ts" />
var ngif_1 = _require( "tests/build/src/ng-template/ngif.js" );
var ngel_1 = _require( "tests/build/src/ng-template/ngel.js" );
var ngtext_1 = _require( "tests/build/src/ng-template/ngtext.js" );
var ngfor_1 = _require( "tests/build/src/ng-template/ngfor.js" );
var ngswitch_1 = _require( "tests/build/src/ng-template/ngswitch.js" );
var ngswitchcase_1 = _require( "tests/build/src/ng-template/ngswitchcase.js" );
var ngswitchcasedefault_1 = _require( "tests/build/src/ng-template/ngswitchcasedefault.js" );
var ngclasslisttoggle_1 = _require( "tests/build/src/ng-template/ngclasslisttoggle.js" );
var ngprop_1 = _require( "tests/build/src/ng-template/ngprop.js" );
var ngdata_1 = _require( "tests/build/src/ng-template/ngdata.js" );
var exception_1 = _require( "tests/build/src/ng-template/exception.js" );
var mediator_1 = _require( "tests/build/src/ng-template/mediator.js" );
var DIRECTIVES = [ngfor_1.NgFor, ngswitch_1.NgSwitch, ngswitchcase_1.NgSwitchCase, ngswitchcasedefault_1.NgSwitchCaseDefault, ngif_1.NgIf,
    ngclasslisttoggle_1.NgClassListToggle, ngdata_1.NgData, ngprop_1.NgProp, ngel_1.NgEl, ngtext_1.NgText];
var NgTemplate = (function () {
    /**
     * Initialize template for a given Element
     * If template passed, load it into the Element
     */
    function NgTemplate(el, template) {
        this.el = el;
        this.template = template;
        this.directives = [];
        if (!this.el) {
            throw new exception_1.Exception("(NgTemplate) Invalid first parameter: must be an existing DOM node");
        }
        this.template || this.init(DIRECTIVES);
    }
    NgTemplate.factory = function (el, template) {
        return new NgTemplate(el, template || null);
    };
    /**
     * Subscribe for NgTemplate events
     */
    NgTemplate.prototype.on = function (ev, cb, context) {
        mediator_1.mediator.on(ev, cb, context);
        return this;
    };
    NgTemplate.prototype.init = function (directives) {
        var _this = this;
        directives.forEach(function (Directive) {
            _this.directives.push(new Directive(_this.el));
        });
    };
    NgTemplate.prototype.sync = function (data) {
        // Late initialization: renders from a given template on first sync
        if (this.template) {
            this.el.innerHTML = this.template;
            this.init(DIRECTIVES);
            this.template = null;
        }
        this.directives.forEach(function (d) {
            d.sync(data, NgTemplate);
        });
        return this;
    };
    NgTemplate.prototype.pipe = function (cb, context) {
        if (context === void 0) { context = this; }
        cb.call(context, this.el);
        return this;
    };
    return NgTemplate;
}());
exports.NgTemplate = NgTemplate;

  module.exports = exports;


  return module;
});

_require.def( "tests/build/src/ng-template/ngif.js", function( _require, exports, module, global ){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_directive_1 = _require( "tests/build/src/ng-template/abstract-directive.js" );
/**
 * <span data-ng-if="expression">Error</span>
 */
var NgIf = (function (_super) {
    __extends(NgIf, _super);
    function NgIf(el) {
        _super.call(this);
        this.nodes = this.initNodes(el, "ng-if", function (node, expr, evaluate, cache) {
            return {
                el: node,
                anchor: document.createElement("ng"),
                exp: evaluate(expr, "Boolean"),
                cache: cache
            };
        });
    }
    NgIf.prototype.sync = function (data) {
        var _this = this;
        this.nodes.forEach(function (node) {
            node.cache.evaluate(node.exp.call(node.el, data), function (val) {
                if (val) {
                    return _this.enable(node);
                }
                _this.disable(node);
            });
        });
    };
    NgIf.prototype.disable = function (node) {
        if (node.anchor.parentNode) {
            return;
        }
        node.anchor.style.display = "none";
        node.el.parentNode.insertBefore(node.anchor, node.el);
        node.el.parentNode.removeChild(node.el);
    };
    NgIf.prototype.enable = function (node) {
        if (!node.anchor.parentNode) {
            return;
        }
        node.anchor.parentNode.insertBefore(node.el, node.anchor);
        node.anchor.parentNode.removeChild(node.anchor);
    };
    return NgIf;
}(abstract_directive_1.AbstractDirective));
exports.NgIf = NgIf;

  module.exports = exports;


  return module;
});

_require.def( "tests/build/src/ng-template/ngel.js", function( _require, exports, module, global ){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_directive_1 = _require( "tests/build/src/ng-template/abstract-directive.js" );
/**
 * <span data-ng-el="this.setAttribute('ss', 11)">Error</span>
 */
var NgEl = (function (_super) {
    __extends(NgEl, _super);
    function NgEl(el) {
        _super.call(this);
        this.nodes = this.initNodes(el, "ng-el", function (node, expr, evaluate) {
            return {
                el: node,
                exp: evaluate(expr)
            };
        });
    }
    NgEl.prototype.sync = function (data) {
        this.nodes.forEach(function (node) {
            node.exp.call(node.el, data);
        });
    };
    return NgEl;
}(abstract_directive_1.AbstractDirective));
exports.NgEl = NgEl;

  module.exports = exports;


  return module;
});

_require.def( "tests/build/src/ng-template/ngfor.js", function( _require, exports, module, global ){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_directive_1 = _require( "tests/build/src/ng-template/abstract-directive.js" );
var exception_1 = _require( "tests/build/src/ng-template/exception.js" );
var counter = 0;
// <div data-ng:for="let hero of data.heroes" data-ng:text="hero" ></div>
var NgFor = (function (_super) {
    __extends(NgFor, _super);
    function NgFor(el) {
        var _this = this;
        _super.call(this);
        this.nodes = this.initNodes(el, "ng-for", function (node, expr, evaluate, cache) {
            var parsed = _this.parseExpr(expr), outerHTML, id = "id" + (++counter);
            node.dataset["ngNodeId"] = id;
            outerHTML = node.outerHTML;
            // Do not process directives on the first level as all of them about elements generated by ngFor
            ["ngSwitch", "ngSwitchCase", "ngSwitchCaseDefault", "ngIf",
                "ngClassListToggle", "ngData", "ngProp", "ngEl", "ngText"].forEach(function (key) {
                delete node.dataset[key];
            });
            return {
                el: node,
                parentNode: node.parentNode,
                outerHTML: outerHTML,
                id: id,
                exp: function (data, cb) {
                    var it = [];
                    try {
                        eval("it = data." + parsed.iterable);
                    }
                    catch (err) {
                        throw new exception_1.Exception("NgTemplate variable " + parsed.iterable + " undefined");
                    }
                    if (!Array.isArray(it)) {
                        throw new exception_1.Exception("NgTemplate variable " + parsed.iterable + " must be an array");
                    }
                    if (cache.match(JSON.stringify(it))) {
                        return false;
                    }
                    it.forEach(function (val) {
                        cb(val, parsed.variable || null);
                    });
                    return true;
                }
            };
        });
    }
    NgFor.prototype.parseExpr = function (strRaw) {
        var re = /(let|var)\s+([a-zA-Z0-9\_]+)\s+of\s+/, str = strRaw.trim(), varMatches = str.match(re);
        if (!varMatches || varMatches.length !== 3) {
            throw new exception_1.Exception("Cannot parse ng-for expression: " + strRaw);
        }
        return {
            variable: varMatches[2],
            iterable: str.replace(re, "")
        };
    };
    /**
     * Create for generated list elements a permitted parent elements
     */
    NgFor.createParentEl = function (el) {
        var map = {
            "TR": "tbody",
            "THEAD": "table",
            "TFOOT": "table",
            "TBODY": "table",
            "COLGROUP": "table",
            "CAPTION": "table",
            "TD": "tr",
            "TH": "tr",
            "COL": "colgroup",
            "FIGCAPTION": "figure",
            "LEGEND": "fieldset",
            "LI": "ul",
            "DT": "dl",
            "DD": "dl",
        };
        var child = el.tagName.toUpperCase(), parent = child in map ? map[child] : "div";
        return document.createElement(parent);
    };
    NgFor.prototype.sync = function (data, Ctor) {
        var _this = this;
        this.nodes.forEach(function (node) {
            var el = NgFor.createParentEl(node.el), container = NgFor.createParentEl(node.el), tpl = new Ctor(el, node.outerHTML);
            var isChanged = node.exp(data, function (val, variable) {
                data[variable] = val;
                tpl.sync(data);
                container.innerHTML += el.innerHTML;
            });
            isChanged && _this.buildDOM(node, _this.nodesToDocFragment(container));
        });
    };
    /**
     * Create headless DOM subtree
     */
    NgFor.prototype.nodesToDocFragment = function (div) {
        var doc = document.createDocumentFragment();
        Array.from(div.children).forEach(function (child) { return doc.appendChild(child); });
        return doc;
    };
    NgFor.prototype.buildDOM = function (node, doc) {
        var items = Array.from(node.parentNode.querySelectorAll("[data-ng-node-id=\"" + node.id + "\"]")), anchor = document.createElement("ng");
        node.parentNode.insertBefore(anchor, items[0]);
        anchor.dataset["ngNodeId"] = node.id;
        items.forEach(function (child) {
            node.parentNode.removeChild(child);
        });
        node.parentNode.replaceChild(doc, anchor);
    };
    return NgFor;
}(abstract_directive_1.AbstractDirective));
exports.NgFor = NgFor;

  module.exports = exports;


  return module;
});

_require.def( "tests/build/src/ng-template/ngtext.js", function( _require, exports, module, global ){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_directive_1 = _require( "tests/build/src/ng-template/abstract-directive.js" );
/**
 * <span data-ng-text="foo">...</span>
 */
var NgText = (function (_super) {
    __extends(NgText, _super);
    function NgText(el) {
        _super.call(this);
        this.nodes = this.initNodes(el, "ng-text", function (node, expr, evaluate, cache) {
            return {
                el: node,
                exp: evaluate(expr, "String"),
                cache: cache
            };
        });
    }
    NgText.prototype.sync = function (data) {
        var _this = this;
        this.nodes.forEach(function (node) {
            node.cache.evaluate(node.exp.call(node.el, data), function (val) {
                _this.setText(node.el, val);
            });
        });
    };
    return NgText;
}(abstract_directive_1.AbstractDirective));
exports.NgText = NgText;

  module.exports = exports;


  return module;
});

_require.def( "tests/build/src/ng-template/ngswitchcase.js", function( _require, exports, module, global ){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_directive_1 = _require( "tests/build/src/ng-template/abstract-directive.js" );
/**
 * <span data-ng-switch="exp"></span>
 */
var NgSwitchCase = (function (_super) {
    __extends(NgSwitchCase, _super);
    function NgSwitchCase(el) {
        _super.call(this);
        this.el = el;
        this.nodes = this.initNodes(el, "ng-switch-case", function (node, expr, evaluate) {
            return {
                el: node,
                outerHTML: node.outerHTML,
                exp: evaluate(expr)
            };
        });
    }
    NgSwitchCase.prototype.sync = function (data) {
        if (!this.nodes.length) {
            return;
        }
        var match = this.nodes.find(function (node) {
            return data["$"] === node.exp.call(node.el, data);
        });
        this.el.innerHTML = match ? match.outerHTML : "";
    };
    return NgSwitchCase;
}(abstract_directive_1.AbstractDirective));
exports.NgSwitchCase = NgSwitchCase;

  module.exports = exports;


  return module;
});

_require.def( "tests/build/src/ng-template/ngswitch.js", function( _require, exports, module, global ){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_directive_1 = _require( "tests/build/src/ng-template/abstract-directive.js" );
/**
 * <span data-ng-switch="exp"></span>
 */
var NgSwitch = (function (_super) {
    __extends(NgSwitch, _super);
    function NgSwitch(el) {
        _super.call(this);
        this.nodes = this.initNodes(el, "ng-switch", function (node, expr, evaluate, cache) {
            return {
                el: node,
                exp: evaluate(expr),
                cache: cache
            };
        });
    }
    NgSwitch.prototype.sync = function (data, Ctor) {
        this.nodes.forEach(function (node) {
            var tpl = new Ctor(node.el, node.outerHTML);
            node.cache.evaluate(node.exp.call(node.el, data), function (val) {
                data["$"] = val;
                tpl.sync(data);
            });
        });
    };
    return NgSwitch;
}(abstract_directive_1.AbstractDirective));
exports.NgSwitch = NgSwitch;

  module.exports = exports;


  return module;
});

_require.def( "tests/build/src/ng-template/ngswitchcasedefault.js", function( _require, exports, module, global ){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_directive_1 = _require( "tests/build/src/ng-template/abstract-directive.js" );
/**
 * <span data-ng-switch-default></span>
 */
var NgSwitchCaseDefault = (function (_super) {
    __extends(NgSwitchCaseDefault, _super);
    function NgSwitchCaseDefault(el) {
        _super.call(this);
        this.el = el;
        this.nodes = this.initNodes(el, "ng-switch-case-default", function (node, expr, evaluate) {
            return {
                el: node,
                outerHTML: node.outerHTML,
                exp: evaluate(expr)
            };
        });
    }
    NgSwitchCaseDefault.prototype.sync = function (data) {
        if (!this.nodes.length) {
            return;
        }
        if (!this.el.innerHTML) {
            var node = this.nodes.shift();
            this.el.innerHTML = node.outerHTML;
        }
    };
    return NgSwitchCaseDefault;
}(abstract_directive_1.AbstractDirective));
exports.NgSwitchCaseDefault = NgSwitchCaseDefault;

  module.exports = exports;


  return module;
});

_require.def( "tests/build/src/ng-template/ngclasslisttoggle.js", function( _require, exports, module, global ){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_directive_1 = _require( "tests/build/src/ng-template/abstract-directive.js" );
/**
 * <i data-ng-class-list-toggle="'is-hidden', isHidden"></i>
 */
var NgClassListToggle = (function (_super) {
    __extends(NgClassListToggle, _super);
    function NgClassListToggle(el) {
        _super.call(this);
        this.nodes = this.initNodes(el, "ng-class-list-toggle", function (node, expr, evaluate, cache) {
            return {
                el: node,
                exp: evaluate(expr, "__toArray"),
                cache: cache
            };
        });
    }
    NgClassListToggle.prototype.sync = function (data) {
        this.nodes.forEach(function (node) {
            node.cache.evaluate(node.exp.call(node.el, data), function (args) {
                node.el.classList.toggle(args[0], args[1]);
            });
        });
    };
    return NgClassListToggle;
}(abstract_directive_1.AbstractDirective));
exports.NgClassListToggle = NgClassListToggle;

  module.exports = exports;


  return module;
});

_require.def( "tests/build/src/ng-template/ngprop.js", function( _require, exports, module, global ){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_directive_1 = _require( "tests/build/src/ng-template/abstract-directive.js" );
/**
 * <i data-ng-prop="'disabled', isDisabled"></i>
 */
var NgProp = (function (_super) {
    __extends(NgProp, _super);
    function NgProp(el) {
        _super.call(this);
        this.nodes = this.initNodes(el, "ng-prop", function (node, expr, evaluate, cache) {
            return {
                el: node,
                exp: evaluate(expr, "__toArray"),
                cache: cache
            };
        });
    }
    NgProp.prototype.sync = function (data) {
        this.nodes.forEach(function (node) {
            node.cache.evaluate(node.exp.call(node.el, data), function (args) {
                var el = node.el;
                el[args[0]] = args[1];
            });
        });
    };
    return NgProp;
}(abstract_directive_1.AbstractDirective));
exports.NgProp = NgProp;

  module.exports = exports;


  return module;
});

_require.def( "tests/build/src/ng-template/ngdata.js", function( _require, exports, module, global ){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_directive_1 = _require( "tests/build/src/ng-template/abstract-directive.js" );
/**
 * <i data-ng-data="'someKey', value"></i>
 */
var NgData = (function (_super) {
    __extends(NgData, _super);
    function NgData(el) {
        _super.call(this);
        this.nodes = this.initNodes(el, "ng-data", function (node, expr, evaluate, cache) {
            return {
                el: node,
                exp: evaluate(expr, "__toArray"),
                cache: cache
            };
        });
    }
    NgData.prototype.sync = function (data) {
        this.nodes.forEach(function (node) {
            node.cache.evaluate(node.exp.call(node.el, data), function (args) {
                var el = node.el;
                el.dataset[args[0]] = args[1];
            });
        });
    };
    return NgData;
}(abstract_directive_1.AbstractDirective));
exports.NgData = NgData;

  module.exports = exports;


  return module;
});

_require.def( "tests/build/src/ng-template/exception.js", function( _require, exports, module, global ){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Custom exception extending Error
 * @param {string} message
 */
var Exception = (function (_super) {
    __extends(Exception, _super);
    function Exception(message) {
        _super.call(this, message);
        this.name = "NgTemplateError",
            this.message = message;
    }
    return Exception;
}(Error));
exports.Exception = Exception;

  module.exports = exports;


  return module;
});

_require.def( "tests/build/src/ng-template/mediator.js", function( _require, exports, module, global ){
"use strict";
var eventemitter_1 = _require( "tests/build/src/ng-template/eventemitter.js" );
exports.mediator = new eventemitter_1.EventEmitter();

  module.exports = exports;


  return module;
});

_require.def( "tests/build/src/ng-template/abstract-directive.js", function( _require, exports, module, global ){
"use strict";
var expression_1 = _require( "tests/build/src/ng-template/expression.js" );
var cache_1 = _require( "tests/build/src/ng-template/cache.js" );
var AbstractDirective = (function () {
    function AbstractDirective() {
    }
    AbstractDirective.prototype.initNodes = function (el, identifier, cb) {
        var datakey = this.getDataKey(identifier), selector = this.getSelector(identifier);
        return Array.from(el.querySelectorAll(selector)).map(function (el) {
            var expr = el.dataset[datakey];
            delete el.dataset[datakey];
            return cb(el, expr, expression_1.evaluate, new cache_1.Cache());
        });
    };
    /**
     * Converts foo-bar-baz to `[data-foo-bar-baz]`
     */
    AbstractDirective.prototype.getSelector = function (raw) {
        return "[data-" + raw + "]";
    };
    /**
     * Converts foo-bar-baz to fooBarBaz
     */
    AbstractDirective.prototype.getDataKey = function (raw) {
        return raw
            .split("-").map(function (part, inx) {
            if (!inx) {
                return part;
            }
            return part.substr(0, 1).toUpperCase() + part.substr(1);
        })
            .join("");
    };
    /**
     * researched strategies
     * el.innerText = str; - no standard
     * el.textContent = str; - fast
     * el.appendChild( document.createTextNode( str ) ) - slower
     */
    AbstractDirective.prototype.setText = function (el, str) {
        el.textContent = str;
    };
    AbstractDirective.prototype.escape = function (str) {
        var div = document.createElement("div");
        this.setText(div, str);
        return div.innerHTML;
    };
    return AbstractDirective;
}());
exports.AbstractDirective = AbstractDirective;

  module.exports = exports;


  return module;
});

_require.def( "tests/build/src/ng-template/eventemitter.js", function( _require, exports, module, global ){
"use strict";
var EventEmitter = (function () {
    function EventEmitter() {
        this.eventQueue = [];
    }
    /**
     * Trigger callbacks for the given event
     * @example
     * this.trigger( "myevent", 1, 2, 3 );
     */
    EventEmitter.prototype.trigger = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.eventQueue.forEach(function (dto) {
            if (dto.event !== event) {
                return;
            }
            dto.callback.apply(dto.context, args);
        }, this);
    };
    /**
     * Just like on, but causes the bound callback to fire only once before being removed.
     */
    EventEmitter.prototype.once = function (ev, cb, context) {
        this.off(ev, cb);
        this.on(ev, cb, context);
        return this;
    };
    /**
     * Subscribe a cb hundler for a given event in the object scope
     */
    EventEmitter.prototype.on = function (ev, cb, context) {
        this.eventQueue.push({
            event: ev,
            callback: cb,
            context: context || { event: ev }
        });
        return this;
    };
    /**
     * Unsubscribe a cb hundler
     *
     */
    EventEmitter.prototype.off = function (ev, target) {
        this.eventQueue = this.eventQueue.filter(function (task) {
            return task.event !== ev || task.callback.toString() !== target.toString();
        });
        return this;
    };
    return EventEmitter;
}());
exports.EventEmitter = EventEmitter;

  module.exports = exports;


  return module;
});

_require.def( "tests/build/src/ng-template/expression.js", function( _require, exports, module, global ){
"use strict";
var exception_1 = _require( "tests/build/src/ng-template/exception.js" );
var mediator_1 = _require( "tests/build/src/ng-template/mediator.js" );
function toArray() {
    return [].slice.call(arguments);
}
;
function isNumber(expr) {
    var re = /^\d+$/;
    return re.test(expr);
}
exports.isNumber = isNumber;
function isBool(expr) {
    var re = /^(true|false)$/i;
    return re.test(expr);
}
exports.isBool = isBool;
function isString(expr) {
    var single = /^\'[^\']+\'$/i, double = /^\"[^\"]+\"$/i;
    return single.test(expr) || double.test(expr);
}
exports.isString = isString;
/**
 * Removes leading negotiation
 */
function removeNegotiation(expr) {
    var re = /^\!\s*/;
    return expr.replace(re, "");
}
exports.removeNegotiation = removeNegotiation;
/**
 * Return true of expression can be used as a path e.g. foo.bar.baz.quiz
 */
function isParsableExpr(expr) {
    var re = /^[a-zA-Z_\$][a-zA-Z0-9\._\$]+$/;
    return expr.substr(0, 5) !== "this." && re.test(expr);
}
exports.isParsableExpr = isParsableExpr;
/**
 * Find value in nested object by a specified path e.g. foo.bar.baz.quiz
 */
function findValue(path, data) {
    var value = data;
    path.split("\.").forEach(function (key) {
        if (typeof value !== "object") {
            throw new exception_1.Exception("'" + path + "' is undefined");
        }
        if (!(key in value)) {
            throw new exception_1.Exception("'" + path + "' is undefined");
        }
        value = value[key];
    });
    return value;
}
exports.findValue = findValue;
function getWrapperFunction(fnName) {
    return window[fnName];
}
exports.getWrapperFunction = getWrapperFunction;
function strategyReference(expr, wrapper) {
    if (wrapper === void 0) { wrapper = ""; }
    var positiveExpr = removeNegotiation(expr);
    return function (data) {
        try {
            var exprVal = findValue(positiveExpr, data), val = positiveExpr === expr ? exprVal : !exprVal;
            if (!wrapper) {
                return val;
            }
            var wrapFn = getWrapperFunction(wrapper);
            return wrapFn(val);
        }
        catch (err) {
            if (err instanceof exception_1.Exception) {
                mediator_1.mediator.trigger("error", err.message);
                return "";
            }
            throw new SyntaxError("Invalid ng* expression " + expr);
        }
    };
}
function strategyString(expr) {
    return function () {
        // strip quotes
        return expr.substr(1, expr.length - 2);
    };
}
function strategyBool(expr) {
    return function () {
        return expr.toUpperCase() === "TRUE";
    };
}
function strategyNumber(expr) {
    return function () {
        return Number(expr);
    };
}
function strategyNull() {
    return function () {
        return "";
    };
}
function propValueReference(propRaw, expr) {
    var prop = propRaw.substr(1, propRaw.length - 2), positiveExpr = removeNegotiation(expr);
    return function (data) {
        try {
            var exprVal = findValue(positiveExpr, data), val = positiveExpr === expr ? exprVal : !exprVal;
            return [prop, val];
        }
        catch (err) {
            if (err instanceof exception_1.Exception) {
                mediator_1.mediator.trigger("error", err.message);
                return [prop, ""];
            }
            throw new SyntaxError("Invalid ng* expression " + expr);
        }
    };
}
exports.propValueReference = propValueReference;
function evaluate(exprRaw, wrapper) {
    if (wrapper === void 0) { wrapper = ""; }
    var func, expr = exprRaw.trim(), positiveExpr = removeNegotiation(expr), 
    // make available in the closure
    __toArray = toArray, 
    // when e.g. ('propName', value)
    exprArgs;
    try {
        if (wrapper === "__toArray") {
            exprArgs = expr.split(",");
            if (exprArgs.length !== 2) {
                throw new exception_1.Exception("Invalid group expression " + expr + " - must be \"expr, expr\"");
            }
            exprArgs = exprArgs.map(function (i) { return i.trim(); });
            // case: 'propName', some.value
            if (isString(exprArgs[0])
                && !isNumber(exprArgs[1])
                && !isBool(exprArgs[1])
                && !isString(exprArgs[1])
                && isParsableExpr(exprArgs[1])) {
                return propValueReference(exprArgs[0], exprArgs[1]);
            }
        }
        if (!expr.length) {
            return strategyNull();
        }
        if (isNumber(expr)) {
            return strategyNumber(expr);
        }
        if (isBool(expr)) {
            return strategyBool(expr);
        }
        if (isString(expr)) {
            return strategyString(expr);
        }
        if (isParsableExpr(positiveExpr)) {
            return strategyReference(expr, wrapper);
        }
        // Standard strategy
        func = function (data) {
            var cb, code, keys = Object.keys(data), vals = keys.map(function (key) {
                return data[key];
            });
            try {
                code = "cb = function(" + keys.join(",") + ("){ return " + wrapper + "(" + expr + "); };");
                eval(code);
                return cb.apply(this, vals);
            }
            catch (err) {
                mediator_1.mediator.trigger("Could not evaluate " + code);
            }
        };
    }
    catch (err) {
        if (err instanceof exception_1.Exception) {
            mediator_1.mediator.trigger("error", err.message);
            return strategyNull();
        }
        throw new SyntaxError("Invalid ng* expression " + expr);
    }
    return func;
}
exports.evaluate = evaluate;
;

  module.exports = exports;


  return module;
});

_require.def( "tests/build/src/ng-template/cache.js", function( _require, exports, module, global ){
"use strict";
var Cache = (function () {
    function Cache() {
    }
    Cache.prototype.match = function (exVal) {
        if (exVal === this.cache) {
            return true;
        }
        this.cache = exVal;
        return false;
    };
    Cache.prototype.evaluate = function (exVal, cb) {
        if (this.match(exVal)) {
            return;
        }
        cb(exVal);
    };
    return Cache;
}());
exports.Cache = Cache;
;

  module.exports = exports;


  return module;
});

(function(){
_require( "tests/build/tests/index.spec.js" );
}());
}());