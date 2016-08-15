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
var model_1 = require("./model");
var exception_1 = require("./exception");
var formvalidators_1 = require("./formvalidators");
var utils_1 = require("./utils");
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
//# sourceMappingURL=formstate.js.map