"use strict";
var ngtemplate_1 = require("../../ngtemplate");
var utils_1 = require("../utils");
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
            view.options.logger && view.trigger("log:listen", "subscribes for `change destroy sync`", collection);
            view.listenTo(collection, "change destroy sync", view.render);
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
    /**
     * collections/models passed in options, take them
     */
    ViewHelper.initializeOptions = function (view, options) {
        var template = "_component" in view ? view._component.template : null;
        // shared template
        if ("template" in options && view.options.template) {
            template = view.options.template;
        }
        // process Component's payload
        view.template = new ngtemplate_1.NgTemplate(view.el, template),
            view.models = utils_1.mapFrom({});
        view.collections = utils_1.mapFrom({});
        if ("_component" in view) {
            view.models = view._component.models;
            view.collections = view._component.collections;
        }
        if ("collections" in options) {
            utils_1.mapAssign(view.collections, options.collections);
        }
        if ("models" in options) {
            utils_1.mapAssign(view.models, options.models);
        }
        // init views
        if (!view.options.views.length) {
            view.options.views = "_component" in view ? view._component.views : [];
        }
        if (view.options.views.find(function (mix) { return typeof mix === "undefined"; })) {
            throw new SyntaxError("Invalid content of options.views");
        }
    };
    /**
     * Hendler that called once after view first rendered
     */
    ViewHelper.onceOnRender = function (view) {
        ViewHelper.initSubViews(view, view.options.views);
    };
    /**
     * Initialize subview
     */
    ViewHelper.initSubViews = function (view, constructors) {
        view.views = constructors.map(function (item) {
            var dto;
            if (typeof item === "function") {
                return ViewHelper.createSubView(view, item);
            }
            dto = item;
            return ViewHelper.createSubView(view, dto[0], dto[1]);
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
//# sourceMappingURL=helper.js.map