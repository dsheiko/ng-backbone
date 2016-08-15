"use strict";
function evaluate(expr, wrapper) {
    if (wrapper === void 0) { wrapper = ""; }
    var func, code = generateCode(expr, wrapper);
    try {
        eval(code);
    }
    catch (e) {
        throw new EvalError("Invalid ng* expression " + expr);
    }
    return func;
}
exports.evaluate = evaluate;
;
function generateCode(expr, wrapper) {
    if (wrapper === void 0) { wrapper = ""; }
    return "\nfunc = function( data ){\n  var cb,\n      code,\n      keys = Object.keys( data ),\n      vals = keys.map(function( key ){\n        return data[ key ];\n      }),\n      __toArray = function(){\n        return [].slice.call( arguments );\n      };\n  try {\n    code = \"cb = function(\" + keys.join(\",\") + \"){ return " + wrapper + "(" + expr + "); };\";\n    eval( code );\n    return cb.apply( this, vals );\n  } catch( err ) {\n    console.info( \"Could not evaluate \" + code );\n    return false;\n  }\n};";
}
exports.generateCode = generateCode;
