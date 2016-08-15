"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var utils_1 = require("./utils");
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
