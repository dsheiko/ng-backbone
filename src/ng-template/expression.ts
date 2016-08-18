import { Exception } from "./exception";

import { Parser, ParserException } from "./expression/parser";
import { Token, OperatorToken } from "./expression/tokenizer";

/**
 * Calc value in a composite xpression such as `foo + bb`
 */
function reduceComposite( tokens: Token[], data: any ){
  if ( tokens.length === 1 ) {
    let token: Token = tokens[ 0 ];
    return token.resolveValue( data );
  }
  let left: Token = tokens[ 0 ],
      leftVal = left.resolveValue( data ),
      operator: Token = tokens[ 1 ],
      right: Token = tokens[ 2 ],
      rightVal = right.resolveValue( data );

      if ( !( operator instanceof OperatorToken ) ) {
        throw new SyntaxError( `Invalid operator ${operator.value} in ng* expression` );
      }

      switch ( operator.value ) {
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
function wrap( value: any, wrapper: string ): any {
  switch ( wrapper ) {
    case "String":
      return String( value );
    case "Boolean":
      return Boolean( value );
    default:
      return value;
  }
}

/**
 * Throw an error or silently report the exception
 */
function treatException( err: Error, expr: string, reporter: NgTemplate.Reporter ){
  if ( !( err instanceof Exception ) ) {
    console.log(err);
    throw new SyntaxError( `Invalid ng* expression ${expr}` );
  }
  reporter.addError( ( <Exception> err ).message );
}

/**
 * Create evaluation function for expressions like "prop, value"
 */
export function tryGroupStrategy( expr: string, reporter: NgTemplate.Reporter ): Function {
  let leftExpr: string, rightExpr: string;
  [ leftExpr, rightExpr ] = expr.split( "," );

  let leftTokens = Parser.parse( leftExpr ),
      rightTokens = Parser.parse( rightExpr );

  if ( !leftTokens.length ) {
    throw new ParserException( `Cannot parse expression ${leftExpr}` );
  }
  if ( !rightTokens.length ) {
    throw new ParserException( `Cannot parse expression ${rightExpr}` );
  }

  reporter.addTokens( leftTokens );
  reporter.addTokens( rightTokens );

  return function( data: any ) {
    try {
      return [ reduceComposite( leftTokens, data ), reduceComposite( rightTokens, data ) ];
    } catch ( err ) {
      treatException( err, expr, reporter );
      return [ "", "" ];
    }
  };
}

/**
 * Create evaluation function for expressions like "value" or "value + value"
 */
export function tryOptimalStrategy( expr: string, wrapper: string = "", reporter: NgTemplate.Reporter ): Function {
  let tokens = Parser.parse( expr );
  if ( !tokens.length ) {
    throw new ParserException( `Cannot parse expression ${expr}` );
  }
  reporter.addTokens( tokens );
  return function( data: any ) {
    // Here we do not need to keep the el context - whenver this. encountered it jumps to fallback strategy
    try {
      return wrap( reduceComposite( tokens, data ), wrapper );
    } catch ( err ) {
      treatException( err, expr, reporter );
      return "";
    }
  };
}
/**
 * Create evaluation function for any expression by using eval
 */
export function fallbackStrategy( expr: string, wrapper: string = "", reporter: NgTemplate.Reporter ): Function {
  // make available in the closure
  let  __toArray = function(){
        return [].slice.call( arguments );
      },
  // Standard strategy
      func = function( data: any ){
        var cb: Function,
            code: string,
            keys = Object.keys( data ),
            vals = keys.map(function( key ){
              return data[ key ];
            });

        try {
          code = "cb = function(" + keys.join(",") + `){ return ${wrapper}(${expr}); };`;
          eval( code );
          return cb.apply( this, vals );
        } catch ( err ) {
          reporter.addError( `Could not evaluate ${code}` );
        }
      };
    return func;
}

export function compile( expr: string, wrapper: string = "", reporter: NgTemplate.Reporter ): Function {

  try {
    if ( wrapper === "__toArray" ) {
      return tryGroupStrategy( expr, reporter );
    }
    return tryOptimalStrategy( expr, wrapper, reporter );

  } catch ( err ) {
    if ( !( err instanceof ParserException ) ) {
      throw SyntaxError( (<Error>err).message );
    }
  }
  return fallbackStrategy.call( this, expr, wrapper, reporter );
}




