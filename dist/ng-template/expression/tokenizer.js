"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var exception_1 = require("./exception");
var OPERATOR_RE = /^(\+|\-|\<|\>|===|==|\!==|\!=|\&\&|\|\|)$/, SINGLE_QUOTE_STRING_RE = /^\'[^\']+\'$/i, DOUBLE_QUOTE_STRING_RE = /^\"[^\"]+\"$/i, NUMBER_RE = /^\d+$/, BOOLEAN_RE = /^(true|false)$/i, REFERENCE_RE = /^[a-zA-Z_\$][a-zA-Z0-9\._\$]+$/, NEGOTIATION_RE = /^\!\s*/;
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
        return OPERATOR_RE.test(value);
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
        return SINGLE_QUOTE_STRING_RE.test(value) || DOUBLE_QUOTE_STRING_RE.test(value);
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
        return NUMBER_RE.test(value);
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
        return BOOLEAN_RE.test(value);
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
        return value.substr(0, 5) !== "this." && REFERENCE_RE.test(value);
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
    return value.replace(NEGOTIATION_RE, "");
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
