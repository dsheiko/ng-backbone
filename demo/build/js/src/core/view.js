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
var helper_1 = require("./view/helper");
var utils_1 = require("./utils");
var View = (function (_super) {
    __extends(View, _super);
    function View(options) {
        if (options === void 0) { options = {}; }
        _super.call(this, options);
        // array of subviews
        this.views = [];
        // constructor options getting available across the prototype
        this.options = {
            views: []
        };
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
            helper_1.ViewHelper.onceOnRender(this);
        }
        this.isRendered = true;
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
    /**
     * Remove all the nested view on parent removal
     */
    View.prototype.remove = function () {
        this.views.forEach(function (view) {
            view.remove();
        });
        return Backbone.NativeView.prototype.remove.call(this);
    };
    __decorate([
        utils_1.Debounce(50), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], View.prototype, "render", null);
    return View;
}(Backbone.NativeView));
exports.View = View;
//# sourceMappingURL=view.js.map