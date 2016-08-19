"use strict";
/// <reference path="../src/core.d.ts" />
var formstate_spec_1 = require("./spec/formstate.spec");
var view_internal_spec_1 = require("./spec/view-internal.spec");
var view_spec_1 = require("./spec/view.spec");
var formview_spec_1 = require("./spec/formview.spec");
var utils_spec_1 = require("./spec/utils.spec");
var collection_spec_1 = require("./spec/collection.spec");
var model_spec_1 = require("./spec/model.spec");
utils_spec_1.default();
formstate_spec_1.FormStateSpec();
view_internal_spec_1.default();
view_spec_1.default();
formview_spec_1.FormViewSpec();
collection_spec_1.default();
model_spec_1.default();
