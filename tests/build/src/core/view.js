"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ngtemplate_1 = require("../ngtemplate");
var utils_1 = require("./utils");
var View = (function (_super) {
    __extends(View, _super);
    function View(options) {
        if (options === void 0) { options = {}; }
        _super.call(this, options);
        this.options = {};
        this.errors = [];
        Object.assign(this.options, options);
        // If we want to listen to log events
        options.logger && this._subscribeLogger(options.logger);
        this.initializeOptions(options);
        this.models.size && this._bindModels();
        this.collections && this._bindCollections();
        // Call earlier cached this.initialize
        this._initialize && this._initialize(options);
    }
    /**
     * collections/models passed in options, take them
     */
    View.prototype.initializeOptions = function (options) {
        var template = "_component" in this ? this._component.template : null;
        // process Component's payload
        this.template = new ngtemplate_1.NgTemplate(this.el, template),
            this.models = utils_1.mapFrom({});
        this.collections = utils_1.mapFrom({});
        if ("_component" in this) {
            this.models = this._component.models;
            this.collections = this._component.collections;
        }
        if ("collections" in options) {
            utils_1.mapAssign(this.collections, options.collections);
        }
        if ("models" in options) {
            utils_1.mapAssign(this.models, options.models);
        }
    };
    View.prototype._subscribeLogger = function (logger) {
        var _this = this;
        Object.keys(logger).forEach(function (events) {
            _this.listenTo(_this, events, logger[events]);
        });
    };
    View.prototype._bindModels = function () {
        var _this = this;
        this.models.forEach(function (model) {
            _this.stopListening(model);
            _this.options.logger && _this.trigger("log:listen", "subscribes for `change`", model);
            _this.listenTo(model, "change", _this.render);
        });
    };
    View.prototype._bindCollections = function () {
        var _this = this;
        this.collections.forEach(function (collection) {
            _this.stopListening(collection);
            _this.options.logger && _this.trigger("log:listen", "subscribes for `change destroy sync`", collection);
            _this.listenTo(collection, "change destroy sync", _this._onCollectionChange);
        });
    };
    /**
     * When any of this.collections updates we re-subscribe all itts models and fire render
     */
    View.prototype._onCollectionChange = function (collection) {
        // @TODO control change of collection models
        this.render(collection);
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
    /**
     * Render first and then sync the template
     */
    View.prototype.render = function (source) {
        var _this = this;
        var ms = performance.now();
        var scope = {};
        this.models && Object.assign(scope, View.modelsToScope(this.models));
        this.collections && Object.assign(scope, View.collectionsToScope(this.collections));
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
