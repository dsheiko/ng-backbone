"use strict";
var exception_1 = require("./exception");
var mediator_1 = require("./mediator");
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
