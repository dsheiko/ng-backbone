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
_require.def( "demo/tests/build/demo/tests/index.spec.js", function( _require, exports, module, global ){
"use strict";
var hero_spec_1 = _require( "demo/tests/build/demo/tests/spec/hero.spec.js" );
var herolist_spec_1 = _require( "demo/tests/build/demo/tests/spec/herolist.spec.js" );
hero_spec_1.default();
herolist_spec_1.default();


  return module;
});

_require.def( "demo/tests/build/demo/tests/spec/hero.spec.js", function( _require, exports, module, global ){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var core_1 = _require( "demo/tests/build/src/core.js" );
var Hero_1 = _require( "demo/tests/build/demo/src/View/Hero.js" );
var MockCollection = (function (_super) {
    __extends(MockCollection, _super);
    function MockCollection() {
        _super.apply(this, arguments);
    }
    MockCollection.prototype.fetch = function (options) {
        return null;
    };
    return MockCollection;
}(core_1.Collection));
function HeroSpec() {
    describe("Hero", function () {
        beforeEach(function () {
            this.view = new Hero_1.HeroView({
                el: null,
                tagName: "ng-hero",
                collections: {
                    heroes: new MockCollection(),
                    powers: new MockCollection(),
                    names: new MockCollection()
                }
            });
        });
        it("shows error msg when power not selected", function () {
            expect(this.view.el.textContent).not.toMatch("Power is required");
            this.view.models
                .get("hero.power")
                .set({ "dirty": true, "valid": false });
            expect(this.view.el.textContent).toMatch("Power is required");
        });
        it("disable submit when power not selected", function () {
            this.view.models
                .get("hero.power")
                .set({ "dirty": true, "valid": false });
            var btn = this.view.el.querySelector("button[type=submit]");
            expect(btn.disabled).toBeTruthy();
        });
        it("shows error msg when name not provided", function () {
            expect(this.view.el.textContent).not.toMatch("Name is required");
            this.view.models
                .get("hero.name")
                .set({ "dirty": true, "valid": false });
            expect(this.view.el.textContent).toMatch("Name is required");
        });
        it("disable submit when name not provided", function () {
            this.view.models
                .get("hero.name")
                .set({ "dirty": true, "valid": false });
            var btn = this.view.el.querySelector("button[type=submit]");
            expect(btn.disabled).toBeTruthy();
        });
        it("shows no error and enable submit when form is valid", function () {
            var power = this.view.el.querySelector("select[name=power]"), name = this.view.el.querySelector("input[name=name]"), btn = this.view.el.querySelector("button[type=submit]");
            power.value = "foo";
            name.value = "bar";
            this.view.models
                .get("hero.form")
                .checkValidity();
            expect(this.view.el.textContent).not.toMatch("Power is required");
            expect(this.view.el.textContent).not.toMatch("Name is required");
            expect(btn.disabled).toBeFalsy();
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HeroSpec;

  module.exports = exports;


  return module;
});

_require.def( "demo/tests/build/demo/tests/spec/herolist.spec.js", function( _require, exports, module, global ){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var core_1 = _require( "demo/tests/build/src/core.js" );
var HeroList_1 = _require( "demo/tests/build/demo/src/View/HeroList.js" );
var MockCollection = (function (_super) {
    __extends(MockCollection, _super);
    function MockCollection() {
        _super.apply(this, arguments);
    }
    MockCollection.prototype.fetch = function (options) {
        return null;
    };
    MockCollection.prototype.orderBy = function (key) {
        this.comparator = key;
        this.sort();
        return this;
    };
    return MockCollection;
}(core_1.Collection));
function HeroListSpec() {
    describe("Hero View", function () {
        beforeEach(function () {
            this.view = new HeroList_1.HeroListView({
                el: null,
                tagName: "ng-herolist",
                collections: {
                    heroes: new MockCollection([
                        new core_1.Model({ name: "name1", power: "power3" }),
                        new core_1.Model({ name: "name2", power: "power2" }),
                        new core_1.Model({ name: "name3", power: "power1" })
                    ])
                }
            });
        });
        it("renders into view all the models of the specified collection ", function () {
            this.view.render();
            var items = this.view.el.querySelectorAll("tr.list__tool-row");
            expect(items.length).toBe(this.view.collections.get("heroes").length);
        });
        it("sorts the table by a given key", function () {
            this.view
                .render()
                .orderBy("power");
            var first = this.view.el.querySelector("tr.list__tool-row");
            expect(first.textContent).toMatch("power3");
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HeroListSpec;

  module.exports = exports;


  return module;
});

_require.def( "demo/tests/build/src/core.js", function( _require, exports, module, global ){
/// <reference path="../node_modules/typescript/lib/lib.d.ts" />
/// <reference path="./core.d.ts" />
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
/**
 * Facade
 */
__export(_require( "demo/tests/build/src/core/exception.js" ));
__export(_require( "demo/tests/build/src/core/component.js" ));
__export(_require( "demo/tests/build/src/core/utils.js" ));
__export(_require( "demo/tests/build/src/core/view.js" ));
__export(_require( "demo/tests/build/src/core/formview.js" ));
__export(_require( "demo/tests/build/src/core/model.js" ));
__export(_require( "demo/tests/build/src/core/collection.js" ));

  module.exports = exports;


  return module;
});

_require.def( "demo/tests/build/demo/src/View/Hero.js", function( _require, exports, module, global ){
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
var core_1 = _require( "demo/tests/build/src/core.js" );
var HeroName_1 = _require( "demo/tests/build/demo/src/Collection/HeroName.js" );
var HeroPower_1 = _require( "demo/tests/build/demo/src/Collection/HeroPower.js" );
var HeroView = (function (_super) {
    __extends(HeroView, _super);
    function HeroView() {
        _super.apply(this, arguments);
    }
    HeroView.prototype.initialize = function () {
        this.collections.get("powers").fetch();
        this.collections.get("names").fetch();
        this.render();
    };
    HeroView.prototype.onSubmitForm = function (e) {
        var el = e.target;
        e.preventDefault();
        var collection = this.collections.get("heroes"), data = this.getData("hero");
        el.reset();
        if (data["name"]) {
            collection.create(data, {
                error: console.error
            });
        }
    };
    HeroView = __decorate([
        core_1.Component({
            el: "ng-hero",
            events: {
                "submit form": "onSubmitForm"
            },
            collections: {
                names: new HeroName_1.HeroNameCollection(),
                powers: new HeroPower_1.HeroPowerCollection()
            },
            template: "\n    <form data-ng-group=\"hero\" novalidate>\n      <div class=\"form-group\">\n        <i class=\"glyphicon glyphicon-user\"></i>\n        <label for=\"name\">Name</label>\n        <input id=\"name\" list=\"names\" name=\"name\" type=\"text\" class=\"form-control\" required >\n        <datalist id=\"names\">\n          <option data-ng-for=\"let n of names\" data-ng-prop=\"'value', n.item\">\n        </datalist>\n        <div class=\"alert alert-danger\" data-ng-if=\"!hero.name.valid\">\n          Name is required\n        </div>\n      </div>\n      <div class=\"form-group\">\n        <i class=\"glyphicon glyphicon-star-empty\"></i>\n        <label for=\"power\">Hero Power</label>\n        <select id=\"power\" name=\"power\" class=\"form-control\" required>\n          <option data-ng-for=\"let p of powers\" data-ng-text=\"p.item\" >Nothing here</option>\n        </select>\n        <div class=\"alert alert-danger\" data-ng-if=\"hero.power.dirty && !hero.power.valid\">\n          Power is required\n        </div>\n      </div>\n       <button type=\"submit\" class=\"btn btn-default\" data-ng-prop=\"'disabled', !hero.form.valid\">Submit</button>\n\n    </form>\n\n"
        }), 
        __metadata('design:paramtypes', [])
    ], HeroView);
    return HeroView;
}(core_1.FormView));
exports.HeroView = HeroView;

  module.exports = exports;


  return module;
});

_require.def( "demo/tests/build/demo/src/View/HeroList.js", function( _require, exports, module, global ){
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
var core_1 = _require( "demo/tests/build/src/core.js" );
var HeroListView = (function (_super) {
    __extends(HeroListView, _super);
    function HeroListView() {
        _super.apply(this, arguments);
    }
    HeroListView.prototype.initialize = function () {
        this.collections.get("heroes").fetch();
        this.render();
    };
    HeroListView.prototype.syncCheckboxCounter = function () {
        var selected = this.el.querySelectorAll("[data-bind=checkbox]:checked").length, model = this.models.get("state");
        model.set("selected", selected);
    };
    HeroListView.prototype.onClickMarkAll = function () {
        var checkboxes = Array.from(this.el.querySelectorAll("[data-bind=checkbox]"));
        checkboxes.forEach(function (el) {
            el.checked = true;
        });
        this.syncCheckboxCounter();
    };
    HeroListView.prototype.onClickRemoveGroup = function (e) {
        var selected = Array.from(this.el.querySelectorAll("[data-bind=checkbox]:checked")), collection = this.collections.get("heroes");
        e.preventDefault();
        selected.forEach(function (el) {
            var model = collection.get(el.dataset["id"]);
            model.destroy();
        });
        this.syncCheckboxCounter();
    };
    HeroListView.prototype.onClickSort = function (e) {
        var el = e.target, order = el.dataset["sort"];
        e.preventDefault();
        this.orderBy(order);
    };
    HeroListView.prototype.orderBy = function (order) {
        var state = this.models.get("state"), collection = this.collections.get("heroes");
        state.set("order", order);
        collection.orderBy(order);
    };
    HeroListView = __decorate([
        core_1.Component({
            el: "ng-herolist",
            events: {
                "change [data-bind=checkbox]": "syncCheckboxCounter",
                "click [data-sort]": "onClickSort",
                "click [data-bind=remove]": "onClickRemoveGroup",
                "click [data-bind=markall]": "onClickMarkAll"
            },
            models: {
                state: new core_1.Model({
                    selected: 0,
                    order: ""
                })
            },
            template: "\n<table class=\"table\">\n<tr>\n  <th data-bind=\"markall\"><i class=\"glyphicon glyphicon-ok\"></i>&nbsp;</th>\n  <th data-sort=\"name\">Name <i data-ng-class=\"'is-inactive', state.order !== 'name'\" class=\"glyphicon glyphicon-chevron-down pull-right is-inactive\"></i></th>\n  <th data-sort=\"power\">Power <i data-ng-class=\"'is-inactive', state.order !== 'power'\" class=\"glyphicon glyphicon-chevron-down pull-right is-inactive\"></i></th>\n</tr>\n<tr data-ng-for=\"let p of heroes\" class=\"list__tool-row\">\n\n  <td>\n    <label>\n    <input data-bind=\"checkbox\" type=\"checkbox\" data-ng-data=\"'id', p.id\" />\n    </label>\n  </td>\n\n  <td data-ng-text=\"p.name\" ></td>\n  <td data-ng-text=\"p.power\" ></td>\n\n</tr>\n\n</table>\n\n<div class=\"row\">\n  <span><span data-ng-text=\"state.selected\">0</span> selected items</span>\n  <button data-bind=\"remove\" class=\"btn btn-danger\" data-ng-if=\"state.selected\">Remove selected</button>\n</div>\n\n"
        }), 
        __metadata('design:paramtypes', [])
    ], HeroListView);
    return HeroListView;
}(core_1.View));
exports.HeroListView = HeroListView;

  module.exports = exports;


  return module;
});

_require.def( "demo/tests/build/src/core/exception.js", function( _require, exports, module, global ){
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

_require.def( "demo/tests/build/src/core/utils.js", function( _require, exports, module, global ){
"use strict";
/**
 * Decorator to debounce
 */
function Debounce(wait) {
    return function (target, propKey, descriptor) {
        var callback = descriptor.value;
        return Object.assign({}, descriptor, {
            value: function () {
                var _this = this;
                var args = Array.from(arguments);
                clearTimeout(this["_debounceTimer"]);
                return new Promise(function (resolve) {
                    _this["_debounceTimer"] = setTimeout(function () {
                        _this["_debounceTimer"] = null;
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

_require.def( "demo/tests/build/src/core/view.js", function( _require, exports, module, global ){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var helper_1 = _require( "demo/tests/build/src/core/view/helper.js" );
var View = (function (_super) {
    __extends(View, _super);
    function View(options) {
        if (options === void 0) { options = {}; }
        _super.call(this, options);
        // constructor options getting available across the prototype
        this.options = {};
        // template errors/warnings
        this.errors = [];
        // is this view ever rendered
        this.isRendered = false;
        Object.assign(this.options, options);
        // If we want to listen to log events
        options.logger && helper_1.ViewHelper.subscribeLogger(this, options.logger);
        helper_1.ViewHelper.initializeOptions(this, options);
        this.models.size && helper_1.ViewHelper.bindModels(this);
        this.collections && helper_1.ViewHelper.bindCollections(this);
        // Call earlier cached this.initialize
        this._initialize && this._initialize(options);
    }
    /**
     * Render first and then sync the template
     */
    View.prototype.render = function (source) {
        var _this = this;
        var ms = performance.now();
        var scope = {};
        this.models && Object.assign(scope, helper_1.ViewHelper.modelsToScope(this.models));
        this.collections && Object.assign(scope, helper_1.ViewHelper.collectionsToScope(this.collections));
        try {
            this.errors = this.template.sync(scope).report()["errors"];
            this.options.logger && this.errors.forEach(function (msg) {
                _this.trigger("log:template", msg);
            });
            this.options.logger &&
                this.trigger("log:sync", "synced template on in " + (performance.now() - ms) + " ms", scope, source);
        }
        catch (err) {
            console.error(err.message);
        }
        if (!this.isRendered) {
            this.onceOnRender();
        }
        this.isRendered = true;
        return this;
    };
    /**
     * Handler that called once after view first rendered
     */
    View.prototype.onceOnRender = function () {
        helper_1.ViewHelper.initSubViews(this, this._component.views);
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
    /**
     * Remove all the nested view on parent removal
     */
    View.prototype.remove = function () {
        this.views.forEach(function (view) {
            view.remove();
        });
        return Backbone.NativeView.prototype.remove.call(this);
    };
    return View;
}(Backbone.NativeView));
exports.View = View;

  module.exports = exports;


  return module;
});

_require.def( "demo/tests/build/src/core/formview.js", function( _require, exports, module, global ){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var view_1 = _require( "demo/tests/build/src/core/view.js" );
var formstate_1 = _require( "demo/tests/build/src/core/formstate.js" );
var utils_1 = _require( "demo/tests/build/src/core/utils.js" );
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
        this.options.logger && this.trigger("log:listen", "subscribes for `change`", model);
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
        this.options.logger && this.trigger("log:listen", "subscribes for `change`", model);
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

_require.def( "demo/tests/build/src/core/component.js", function( _require, exports, module, global ){
"use strict";
var utils_1 = _require( "demo/tests/build/src/core/utils.js" );
function Component(options) {
    var mixin = {
        _component: {
            models: options.models,
            collections: options.collections,
            views: utils_1.mapFrom(options.views),
            template: options.template,
        },
        el: options.el || null,
        events: options.events || null,
        id: options.id || null,
        className: options.className || null,
        tagName: options.tagName || null,
        formValidators: options.formValidators || null
    };
    return function (target) {
        Object.assign(target.prototype, mixin);
        // This way we trick invokation of this.initialize after constructor
        // Keeping in mind that @Component belongs to View that knows about this._initialize
        if ("initialize" in target.prototype) {
            _a = [target.prototype["initialize"], function () { }], target.prototype["_initialize"] = _a[0], target.prototype["initialize"] = _a[1];
        }
        var _a;
    };
}
exports.Component = Component;

  module.exports = exports;


  return module;
});

_require.def( "demo/tests/build/src/core/model.js", function( _require, exports, module, global ){
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

_require.def( "demo/tests/build/src/core/collection.js", function( _require, exports, module, global ){
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
    return Collection;
}(Backbone.Collection));
exports.Collection = Collection;

  module.exports = exports;


  return module;
});

_require.def( "demo/tests/build/demo/src/Collection/HeroName.js", function( _require, exports, module, global ){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var core_1 = _require( "demo/tests/build/src/core.js" );
var HeroNameModel = (function (_super) {
    __extends(HeroNameModel, _super);
    function HeroNameModel() {
        _super.apply(this, arguments);
    }
    HeroNameModel.prototype.parse = function (data) {
        return {
            item: data
        };
    };
    return HeroNameModel;
}(core_1.Model));
exports.HeroNameModel = HeroNameModel;
var HeroNameCollection = (function (_super) {
    __extends(HeroNameCollection, _super);
    function HeroNameCollection() {
        _super.apply(this, arguments);
        this.url = "./names.json";
        this.model = HeroNameModel;
    }
    return HeroNameCollection;
}(core_1.Collection));
exports.HeroNameCollection = HeroNameCollection;

  module.exports = exports;


  return module;
});

_require.def( "demo/tests/build/demo/src/Collection/HeroPower.js", function( _require, exports, module, global ){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var core_1 = _require( "demo/tests/build/src/core.js" );
var HeroPowerModel = (function (_super) {
    __extends(HeroPowerModel, _super);
    function HeroPowerModel() {
        _super.apply(this, arguments);
    }
    HeroPowerModel.prototype.parse = function (data) {
        return {
            item: data
        };
    };
    return HeroPowerModel;
}(core_1.Model));
exports.HeroPowerModel = HeroPowerModel;
var HeroPowerCollection = (function (_super) {
    __extends(HeroPowerCollection, _super);
    function HeroPowerCollection() {
        _super.apply(this, arguments);
        this.url = "./powers.json";
        this.model = HeroPowerModel;
    }
    return HeroPowerCollection;
}(core_1.Collection));
exports.HeroPowerCollection = HeroPowerCollection;

  module.exports = exports;


  return module;
});

_require.def( "demo/tests/build/src/core/view/helper.js", function( _require, exports, module, global ){
"use strict";
var ngtemplate_1 = _require( "demo/tests/build/src/ngtemplate.js" );
var utils_1 = _require( "demo/tests/build/src/core/utils.js" );
var ViewHelper = (function () {
    function ViewHelper() {
    }
    /**
     * Converts { foo: Collection, bar: Collection } into
     * { foo: [{},{}], bar: [{},{}] }
     */
    ViewHelper.collectionsToScope = function (collections) {
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
    ViewHelper.modelsToScope = function (models) {
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
    /**
     * Bind specified models to the template
     */
    ViewHelper.bindModels = function (view) {
        view.models.forEach(function (model) {
            view.stopListening(model);
            view.options.logger && view.trigger("log:listen", "subscribes for `change`", model);
            view.listenTo(model, "change", view.render);
        });
    };
    /**
     * Bind specified collections to the template
     */
    ViewHelper.bindCollections = function (view) {
        view.collections.forEach(function (collection) {
            view.stopListening(collection);
            view.options.logger && view.trigger("log:listen", "subscribes for `change destroy sync sort`", collection);
            view.listenTo(collection, "change destroy sync sort", function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                // Slightly debounced for repeating calls like collection.sync/sort
                clearTimeout(view._debounceTimer);
                view._debounceTimer = setTimeout(function () {
                    view._debounceTimer = null;
                    view.render.apply(view, args);
                }, 50);
            });
        });
    };
    /**
     * Subscribe logger handlers from options
     */
    ViewHelper.subscribeLogger = function (view, logger) {
        Object.keys(logger).forEach(function (events) {
            view.listenTo(view, events, logger[events]);
        });
    };
    ViewHelper.resetComponentDto = function (view) {
        view._component = {
            models: {},
            collections: {},
            views: utils_1.mapFrom({}),
            template: null
        };
    };
    /**
     * collections/models passed in options, take them
     */
    ViewHelper.initializeOptions = function (view, options) {
        // When @Component isn't defined
        if (!("_component" in view)) {
            ViewHelper.resetComponentDto(view);
        }
        var template = view._component.template;
        // shared template
        if ("template" in options && view.options.template) {
            template = view.options.template;
        }
        // process Component's payload
        view.template = new ngtemplate_1.NgTemplate(view.el, template),
            view.models = utils_1.mapFrom(view._component.models);
        view.collections = utils_1.mapFrom(view._component.collections);
        view.views = utils_1.mapFrom({});
        if ("collections" in options) {
            utils_1.mapAssign(view.collections, options.collections);
        }
        if ("models" in options) {
            utils_1.mapAssign(view.models, options.models);
        }
        if ("views" in options) {
            utils_1.mapAssign(view._component.views, options.views);
        }
    };
    /**
    * Initialize subview
    */
    ViewHelper.initSubViews = function (view, viewCtorMap) {
        viewCtorMap.forEach(function (Ctor, key) {
            var dto, instance;
            if (typeof Ctor === "function") {
                instance = ViewHelper.createSubView(view, Ctor);
            }
            else {
                dto = Ctor;
                instance = ViewHelper.createSubView(view, dto[0], dto[1]);
            }
            view.views.set(key, instance);
        });
    };
    /**
     * Factory: create a subview
     */
    ViewHelper.createSubView = function (view, ViewCtor, options) {
        if (options === void 0) { options = {}; }
        var el = ViewHelper.findSubViewEl(view, ViewCtor.prototype["el"]);
        return new ViewCtor(Object.assign(options, { el: el }));
    };
    /**
     * Find inner el
     */
    ViewHelper.findSubViewEl = function (view, selector) {
        if (typeof selector !== "string") {
            throw new SyntaxError("Invalid options.el type, must be a string");
        }
        return view.el.querySelector(selector);
    };
    return ViewHelper;
}());
exports.ViewHelper = ViewHelper;

  module.exports = exports;


  return module;
});

_require.def( "demo/tests/build/src/core/formstate.js", function( _require, exports, module, global ){
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
var model_1 = _require( "demo/tests/build/src/core/model.js" );
var exception_1 = _require( "demo/tests/build/src/core/exception.js" );
var formvalidators_1 = _require( "demo/tests/build/src/core/formvalidators.js" );
var utils_1 = _require( "demo/tests/build/src/core/utils.js" );
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

_require.def( "demo/tests/build/src/ngtemplate.js", function( _require, exports, module, global ){
"use strict";
/// <reference path="./ngtemplate.d.ts" />
var ngif_1 = _require( "demo/tests/build/src/ng-template/ngif.js" );
var ngel_1 = _require( "demo/tests/build/src/ng-template/ngel.js" );
var ngtext_1 = _require( "demo/tests/build/src/ng-template/ngtext.js" );
var ngfor_1 = _require( "demo/tests/build/src/ng-template/ngfor.js" );
var ngswitch_1 = _require( "demo/tests/build/src/ng-template/ngswitch.js" );
var ngswitchcase_1 = _require( "demo/tests/build/src/ng-template/ngswitchcase.js" );
var ngswitchcasedefault_1 = _require( "demo/tests/build/src/ng-template/ngswitchcasedefault.js" );
var ngclass_1 = _require( "demo/tests/build/src/ng-template/ngclass.js" );
var ngprop_1 = _require( "demo/tests/build/src/ng-template/ngprop.js" );
var ngdata_1 = _require( "demo/tests/build/src/ng-template/ngdata.js" );
var exception_1 = _require( "demo/tests/build/src/ng-template/exception.js" );
var reporter_1 = _require( "demo/tests/build/src/ng-template/reporter.js" );
var DIRECTIVES = [ngfor_1.NgFor, ngswitch_1.NgSwitch, ngswitchcase_1.NgSwitchCase, ngswitchcasedefault_1.NgSwitchCaseDefault, ngif_1.NgIf,
    ngclass_1.NgClass, ngdata_1.NgData, ngprop_1.NgProp, ngel_1.NgEl, ngtext_1.NgText];
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
        this.reporter = new reporter_1.Reporter();
        this.template || this.init(DIRECTIVES);
    }
    NgTemplate.factory = function (el, template) {
        return new NgTemplate(el, template || null);
    };
    NgTemplate.prototype.init = function (directives) {
        var _this = this;
        directives.forEach(function (Directive) {
            _this.directives.push(new Directive(_this.el, _this.reporter));
        });
    };
    NgTemplate.prototype.report = function () {
        return this.reporter.get();
    };
    NgTemplate.prototype.sync = function (data) {
        // Late initialization: renders from a given template on first sync
        if (this.template) {
            this.el.innerHTML = this.template + "";
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
        cb.call(context, this.el, this.reporter);
        return this;
    };
    return NgTemplate;
}());
exports.NgTemplate = NgTemplate;

  module.exports = exports;


  return module;
});

_require.def( "demo/tests/build/src/core/formvalidators.js", function( _require, exports, module, global ){
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

_require.def( "demo/tests/build/src/ng-template/ngif.js", function( _require, exports, module, global ){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_directive_1 = _require( "demo/tests/build/src/ng-template/abstract-directive.js" );
/**
 * <span data-ng-if="expression">Error</span>
 */
var NgIf = (function (_super) {
    __extends(NgIf, _super);
    function NgIf(el, reporter) {
        _super.call(this, el, reporter);
        this.nodes = this.initNodes(el, "ng-if", function (node, expr, compile, cache) {
            return {
                el: node,
                anchor: document.createElement("ng"),
                exp: compile(expr, "Boolean", reporter),
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

_require.def( "demo/tests/build/src/ng-template/ngel.js", function( _require, exports, module, global ){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_directive_1 = _require( "demo/tests/build/src/ng-template/abstract-directive.js" );
/**
 * <span data-ng-el="this.setAttribute('ss', 11)">Error</span>
 */
var NgEl = (function (_super) {
    __extends(NgEl, _super);
    function NgEl(el, reporter) {
        _super.call(this, el, reporter);
        this.nodes = this.initNodes(el, "ng-el", function (node, expr, compile) {
            return {
                el: node,
                exp: compile(expr, "", reporter)
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

_require.def( "demo/tests/build/src/ng-template/ngtext.js", function( _require, exports, module, global ){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_directive_1 = _require( "demo/tests/build/src/ng-template/abstract-directive.js" );
/**
 * <span data-ng-text="foo">...</span>
 */
var NgText = (function (_super) {
    __extends(NgText, _super);
    function NgText(el, reporter) {
        _super.call(this, el, reporter);
        this.nodes = this.initNodes(el, "ng-text", function (node, expr, compile, cache) {
            return {
                el: node,
                exp: compile(expr, "String", reporter),
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

_require.def( "demo/tests/build/src/ng-template/ngfor.js", function( _require, exports, module, global ){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_directive_1 = _require( "demo/tests/build/src/ng-template/abstract-directive.js" );
var exception_1 = _require( "demo/tests/build/src/ng-template/exception.js" );
var counter = 0;
// <div data-ng:for="let hero of data.heroes" data-ng:text="hero" ></div>
var NgFor = (function (_super) {
    __extends(NgFor, _super);
    function NgFor(el, reporter) {
        var _this = this;
        _super.call(this, el, reporter);
        this.nodes = this.initNodes(el, "ng-for", function (node, expr, compile, cache) {
            var parsed = _this.parseExpr(expr), outerHTML, id = "id" + (++counter);
            node.dataset["ngNodeId"] = id;
            outerHTML = node.outerHTML;
            // Do not process directives on the first level as all of them about elements generated by ngFor
            ["ngSwitch", "ngSwitchCase", "ngSwitchCaseDefault", "ngIf",
                "ngClassListToggle", "ngData", "ngProp", "ngEl", "ngText"].forEach(function (key) {
                if (node.dataset[key]) {
                    delete node.dataset[key];
                }
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

_require.def( "demo/tests/build/src/ng-template/ngswitch.js", function( _require, exports, module, global ){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_directive_1 = _require( "demo/tests/build/src/ng-template/abstract-directive.js" );
/**
 * <span data-ng-switch="exp"></span>
 */
var NgSwitch = (function (_super) {
    __extends(NgSwitch, _super);
    function NgSwitch(el, reporter) {
        _super.call(this, el, reporter);
        this.nodes = this.initNodes(el, "ng-switch", function (node, expr, compile, cache) {
            return {
                el: node,
                exp: compile(expr, "", reporter),
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

_require.def( "demo/tests/build/src/ng-template/ngswitchcase.js", function( _require, exports, module, global ){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_directive_1 = _require( "demo/tests/build/src/ng-template/abstract-directive.js" );
/**
 * <span data-ng-switch="exp"></span>
 */
var NgSwitchCase = (function (_super) {
    __extends(NgSwitchCase, _super);
    function NgSwitchCase(el, reporter) {
        _super.call(this, el, reporter);
        this.el = el;
        this.nodes = this.initNodes(el, "ng-switch-case", function (node, expr, compile) {
            return {
                el: node,
                outerHTML: node.outerHTML,
                exp: compile(expr, "", reporter)
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

_require.def( "demo/tests/build/src/ng-template/ngswitchcasedefault.js", function( _require, exports, module, global ){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_directive_1 = _require( "demo/tests/build/src/ng-template/abstract-directive.js" );
/**
 * <span data-ng-switch-default></span>
 */
var NgSwitchCaseDefault = (function (_super) {
    __extends(NgSwitchCaseDefault, _super);
    function NgSwitchCaseDefault(el, reporter) {
        _super.call(this, el, reporter);
        this.el = el;
        this.nodes = this.initNodes(el, "ng-switch-case-default", function (node, expr, compile) {
            return {
                el: node,
                outerHTML: node.outerHTML,
                exp: compile(expr, "", reporter)
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

_require.def( "demo/tests/build/src/ng-template/ngclass.js", function( _require, exports, module, global ){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_directive_1 = _require( "demo/tests/build/src/ng-template/abstract-directive.js" );
/**
 * <i data-ng-class="'is-hidden', isHidden"></i>
 */
var NgClass = (function (_super) {
    __extends(NgClass, _super);
    function NgClass(el, reporter) {
        _super.call(this, el, reporter);
        this.nodes = this.initNodes(el, "ng-class", function (node, expr, compile, cache) {
            return {
                el: node,
                exp: compile(expr, "__toArray", reporter),
                cache: cache
            };
        });
    }
    NgClass.prototype.sync = function (data) {
        this.nodes.forEach(function (node) {
            node.cache.evaluate(node.exp.call(node.el, data), function (args) {
                node.el.classList.toggle(args[0], args[1]);
            });
        });
    };
    return NgClass;
}(abstract_directive_1.AbstractDirective));
exports.NgClass = NgClass;

  module.exports = exports;


  return module;
});

_require.def( "demo/tests/build/src/ng-template/ngprop.js", function( _require, exports, module, global ){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_directive_1 = _require( "demo/tests/build/src/ng-template/abstract-directive.js" );
/**
 * <i data-ng-prop="'disabled', isDisabled"></i>
 */
var NgProp = (function (_super) {
    __extends(NgProp, _super);
    function NgProp(el, reporter) {
        _super.call(this, el, reporter);
        this.nodes = this.initNodes(el, "ng-prop", function (node, expr, compile, cache) {
            return {
                el: node,
                exp: compile(expr, "__toArray", reporter),
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

_require.def( "demo/tests/build/src/ng-template/ngdata.js", function( _require, exports, module, global ){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_directive_1 = _require( "demo/tests/build/src/ng-template/abstract-directive.js" );
/**
 * <i data-ng-data="'someKey', value"></i>
 */
var NgData = (function (_super) {
    __extends(NgData, _super);
    function NgData(el, reporter) {
        _super.call(this, el, reporter);
        this.nodes = this.initNodes(el, "ng-data", function (node, expr, compile, cache) {
            return {
                el: node,
                exp: compile(expr, "__toArray", reporter),
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

_require.def( "demo/tests/build/src/ng-template/exception.js", function( _require, exports, module, global ){
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

_require.def( "demo/tests/build/src/ng-template/reporter.js", function( _require, exports, module, global ){
"use strict";
var Reporter = (function () {
    function Reporter() {
        this.data = {
            errors: [],
            tokens: []
        };
    }
    Reporter.prototype.addError = function (msg) {
        this.data.errors.push(msg);
    };
    Reporter.prototype.addTokens = function (tokens) {
        var merge = tokens.map(function (token) { return token.toJSON(); });
        this.data.tokens = this.data.tokens.concat(merge);
    };
    Reporter.prototype.get = function (key) {
        return key ? this.data[key] : this.data;
    };
    Reporter.prototype.isParsed = function () {
        return this.data.tokens.length > 0;
    };
    return Reporter;
}());
exports.Reporter = Reporter;

  module.exports = exports;


  return module;
});

_require.def( "demo/tests/build/src/ng-template/abstract-directive.js", function( _require, exports, module, global ){
"use strict";
var expression_1 = _require( "demo/tests/build/src/ng-template/expression.js" );
var cache_1 = _require( "demo/tests/build/src/ng-template/cache.js" );
var AbstractDirective = (function () {
    function AbstractDirective(el, reporter) {
    }
    AbstractDirective.prototype.initNodes = function (el, identifier, cb) {
        var datakey = this.getDataKey(identifier), selector = this.getSelector(identifier);
        return Array.from(el.querySelectorAll(selector)).map(function (el) {
            var expr = el.dataset[datakey];
            delete el.dataset[datakey];
            return cb(el, expr, expression_1.compile, new cache_1.Cache());
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

_require.def( "demo/tests/build/src/ng-template/expression.js", function( _require, exports, module, global ){
"use strict";
var constants_1 = _require( "demo/tests/build/src/ng-template/constants.js" );
var exception_1 = _require( "demo/tests/build/src/ng-template/exception.js" );
var exception_2 = _require( "demo/tests/build/src/ng-template/expression/exception.js" );
var parser_1 = _require( "demo/tests/build/src/ng-template/expression/parser.js" );
var tokenizer_1 = _require( "demo/tests/build/src/ng-template/expression/tokenizer.js" );
/**
 * Calc value in a composite xpression such as `foo + bb`
 */
function reduceComposite(tokens, data) {
    if (tokens.length === 1) {
        var token = tokens[0];
        return token.resolveValue(data);
    }
    var left = tokens[0], leftVal = left.resolveValue(data), operator = tokens[1], right = tokens[2], rightVal = right.resolveValue(data);
    if (!(operator instanceof tokenizer_1.OperatorToken)) {
        throw new exception_1.Exception("Invalid operator " + operator.value + " in ng* expression");
    }
    switch (operator.value) {
        case "+":
            return leftVal + rightVal;
        case "-":
            return leftVal - rightVal;
        case "<":
            return leftVal < rightVal;
        case ">":
            return leftVal > rightVal;
        case "===":
            return leftVal === rightVal;
        case "==":
            return leftVal === rightVal;
        case "!==":
            return leftVal !== rightVal;
        case "!=":
            return leftVal !== rightVal;
        case "&&":
            return leftVal && rightVal;
        case "||":
            return leftVal || rightVal;
    }
}
/**
 * Wrap as requested by the consumer object
 */
function wrap(value, wrapper) {
    switch (wrapper) {
        case "String":
            return String(value);
        case "Boolean":
            return Boolean(value);
        default:
            return value;
    }
}
/**
 * Throw an error or silently report the exception
 */
function treatException(err, expr, reporter) {
    if (!(err instanceof exception_2.ExpressionException)) {
        throw new exception_1.Exception("Invalid ng* expression " + expr);
    }
    reporter.addError((constants_1.ERROR_CODES.NGT0003 + ": ") + err.message);
}
/**
 * Create evaluation function for expressions like "prop, value"
 */
function tryGroupStrategy(expr, reporter) {
    var leftExpr, rightExpr;
    if (expr.indexOf(",") === -1) {
        throw new exception_1.Exception("Group expression must have syntax: 'foo, bar'");
    }
    _a = expr.split(","), leftExpr = _a[0], rightExpr = _a[1];
    var leftTokens = parser_1.Parser.parse(leftExpr), rightTokens = parser_1.Parser.parse(rightExpr);
    if (!leftTokens.length) {
        throw new exception_2.ExpressionException("Cannot parse expression " + leftExpr);
    }
    if (!rightTokens.length) {
        throw new exception_2.ExpressionException("Cannot parse expression " + rightExpr);
    }
    reporter.addTokens(leftTokens);
    reporter.addTokens(rightTokens);
    return function (data) {
        try {
            return [reduceComposite(leftTokens, data), reduceComposite(rightTokens, data)];
        }
        catch (err) {
            treatException(err, expr, reporter);
            return ["", ""];
        }
    };
    var _a;
}
exports.tryGroupStrategy = tryGroupStrategy;
/**
 * Create evaluation function for expressions like "value" or "value + value"
 */
function tryOptimalStrategy(expr, wrapper, reporter) {
    if (wrapper === void 0) { wrapper = ""; }
    var tokens = parser_1.Parser.parse(expr);
    if (!tokens.length) {
        throw new exception_2.ExpressionException("Cannot parse expression " + expr);
    }
    reporter.addTokens(tokens);
    return function (data) {
        // Here we do not need to keep the el context - whenver this. encountered it jumps to fallback strategy
        try {
            return wrap(reduceComposite(tokens, data), wrapper);
        }
        catch (err) {
            treatException(err, expr, reporter);
            return "";
        }
    };
}
exports.tryOptimalStrategy = tryOptimalStrategy;
/**
 * Create evaluation function for any expression by using eval
 */
function fallbackStrategy(expr, wrapper, reporter) {
    if (wrapper === void 0) { wrapper = ""; }
    // make available in the closure
    var __toArray = function () {
        return [].slice.call(arguments);
    }, 
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
            reporter.addError(constants_1.ERROR_CODES.NGT0002 + ": Could not evaluate " + code);
        }
    };
    return func;
}
exports.fallbackStrategy = fallbackStrategy;
function compile(expr, wrapper, reporter) {
    if (wrapper === void 0) { wrapper = ""; }
    try {
        if (wrapper === "__toArray") {
            return tryGroupStrategy(expr, reporter);
        }
        return tryOptimalStrategy(expr, wrapper, reporter);
    }
    catch (err) {
        if (!(err instanceof exception_2.ExpressionException)) {
            throw new exception_1.Exception(err.message);
        }
    }
    reporter.addError(constants_1.ERROR_CODES.NGT0001 + ": Could not parse the expression, going eval()");
    return fallbackStrategy.call(this, expr, wrapper, reporter);
}
exports.compile = compile;

  module.exports = exports;


  return module;
});

_require.def( "demo/tests/build/src/ng-template/cache.js", function( _require, exports, module, global ){
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

_require.def( "demo/tests/build/src/ng-template/constants.js", function( _require, exports, module, global ){
"use strict";
// Do not dare yet to go with Symbol - TS doesn't transpile them and support isn't good yet
exports.ERROR_CODES = {
    NGT0001: "NGT0001",
    NGT0002: "NGT0002",
    NGT0003: "NGT0003"
};

  module.exports = exports;


  return module;
});

_require.def( "demo/tests/build/src/ng-template/expression/exception.js", function( _require, exports, module, global ){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var exception_1 = _require( "demo/tests/build/src/ng-template/exception.js" );
var ExpressionException = (function (_super) {
    __extends(ExpressionException, _super);
    function ExpressionException(message) {
        _super.call(this, message);
        this.name = "NgTemplateExpressionException",
            this.message = message;
    }
    return ExpressionException;
}(exception_1.Exception));
exports.ExpressionException = ExpressionException;

  module.exports = exports;


  return module;
});

_require.def( "demo/tests/build/src/ng-template/expression/parser.js", function( _require, exports, module, global ){
"use strict";
var tokenizer_1 = _require( "demo/tests/build/src/ng-template/expression/tokenizer.js" );
var Parser = (function () {
    function Parser() {
    }
    Parser.split = function (expr) {
        var re = /(\+|\-|\<|\>|===|==|\!==|\!=|\&\&|\|\|)/;
        return expr
            .split(re)
            .map(function (i) { return i.trim(); })
            .filter(function (i) { return Boolean(i); });
    };
    Parser.parse = function (expr) {
        // if the whole expr is a string
        if (tokenizer_1.StringToken.valid(expr)) {
            var token = tokenizer_1.tokenizer(expr.trim());
            return [token];
        }
        var com = Parser.split(expr);
        // case 3: foo + bar
        // case 1: foo (no operators found)
        if (com.length !== 3 && com.length !== 1) {
            return [];
        }
        var tokens = com.map(function (i) { return tokenizer_1.tokenizer(i); });
        // any of tokens is invalid
        if (tokens.find(function (i) { return i instanceof tokenizer_1.InvalidToken; })) {
            return [];
        }
        return tokens;
    };
    return Parser;
}());
exports.Parser = Parser;

  module.exports = exports;


  return module;
});

_require.def( "demo/tests/build/src/ng-template/expression/tokenizer.js", function( _require, exports, module, global ){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var exception_1 = _require( "demo/tests/build/src/ng-template/expression/exception.js" );
var Token = (function () {
    function Token(value, negation) {
        if (negation === void 0) { negation = false; }
        this.value = value;
        this.negation = negation;
        this.name = "Token";
    }
    Token.prototype.resolveValue = function (data) {
    };
    Token.prototype.toJSON = function () {
        return {
            "type": this.name,
            "value": this.value,
            "negation": this.negation
        };
    };
    return Token;
}());
exports.Token = Token;
var InvalidToken = (function (_super) {
    __extends(InvalidToken, _super);
    function InvalidToken() {
        _super.apply(this, arguments);
        this.name = "InvalidToken";
    }
    return InvalidToken;
}(Token));
exports.InvalidToken = InvalidToken;
var OperatorToken = (function (_super) {
    __extends(OperatorToken, _super);
    function OperatorToken() {
        _super.apply(this, arguments);
        this.name = "OperatorToken";
    }
    OperatorToken.valid = function (value) {
        var re = /^(\+|\-|\<|\>|===|==|\!==|\!=|\&\&|\|\|)$/;
        return re.test(value);
    };
    return OperatorToken;
}(Token));
exports.OperatorToken = OperatorToken;
var StringToken = (function (_super) {
    __extends(StringToken, _super);
    function StringToken() {
        _super.apply(this, arguments);
        this.name = "StringToken";
    }
    StringToken.valid = function (value) {
        var single = /^\'[^\']+\'$/i, double = /^\"[^\"]+\"$/i;
        return single.test(value) || double.test(value);
    };
    StringToken.prototype.resolveValue = function (data) {
        var val = this.value;
        return val.substr(1, val.length - 2);
    };
    return StringToken;
}(Token));
exports.StringToken = StringToken;
var NumberToken = (function (_super) {
    __extends(NumberToken, _super);
    function NumberToken() {
        _super.apply(this, arguments);
        this.name = "NumberToken";
    }
    NumberToken.valid = function (value) {
        var re = /^\d+$/;
        return re.test(value);
    };
    NumberToken.prototype.resolveValue = function (data) {
        var val = Number(this.value);
        return this.negation ? !val : val;
    };
    return NumberToken;
}(Token));
exports.NumberToken = NumberToken;
var BooleanToken = (function (_super) {
    __extends(BooleanToken, _super);
    function BooleanToken() {
        _super.apply(this, arguments);
        this.name = "BooleanToken";
    }
    BooleanToken.valid = function (value) {
        var re = /^(true|false)$/i;
        return re.test(value);
    };
    BooleanToken.prototype.resolveValue = function (data) {
        var val = this.value.toUpperCase() === "TRUE";
        return this.negation ? !val : val;
    };
    return BooleanToken;
}(Token));
exports.BooleanToken = BooleanToken;
var ReferenceToken = (function (_super) {
    __extends(ReferenceToken, _super);
    function ReferenceToken() {
        _super.apply(this, arguments);
        this.name = "ReferenceToken";
    }
    ReferenceToken.valid = function (value) {
        var re = /^[a-zA-Z_\$][a-zA-Z0-9\._\$]+$/;
        return value.substr(0, 5) !== "this." && re.test(value);
    };
    ReferenceToken.findValue = function (path, data) {
        var value = data;
        path.split("\.").forEach(function (key) {
            if (typeof value !== "object") {
                throw new exception_1.ExpressionException("'" + path + "' is undefined");
            }
            if (!(key in value)) {
                throw new exception_1.ExpressionException("'" + path + "' is undefined");
            }
            value = value[key];
        });
        return value;
    };
    ReferenceToken.prototype.resolveValue = function (data) {
        var val = ReferenceToken.findValue(this.value, data);
        return this.negation ? !val : val;
    };
    return ReferenceToken;
}(Token));
exports.ReferenceToken = ReferenceToken;
/**
 * Removes leading negotiation
 */
function removeNegotiation(value) {
    var re = /^\!\s*/;
    return value.replace(re, "");
}
function tokenizer(rawValue) {
    var value = removeNegotiation(rawValue), negation = rawValue !== value;
    switch (true) {
        case OperatorToken.valid(rawValue):
            return new OperatorToken(rawValue, false);
        case StringToken.valid(value):
            return new StringToken(value, negation);
        case NumberToken.valid(value):
            return new NumberToken(value, negation);
        case BooleanToken.valid(value):
            return new BooleanToken(value, negation);
        case ReferenceToken.valid(value):
            return new ReferenceToken(value, negation);
        default:
            return new InvalidToken(value, negation);
    }
}
exports.tokenizer = tokenizer;

  module.exports = exports;


  return module;
});

(function(){
_require( "demo/tests/build/demo/tests/index.spec.js" );
}());
}());