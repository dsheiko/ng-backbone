import { tokenizer, OperatorToken, StringToken, NumberToken, BooleanToken, ReferenceToken,
  InvalidToken } from "../../src/ng-template/expression/tokenizer";

describe("tokenizer", function(){

  it( "recognizes an operator", function() {
    let token = tokenizer( "+" );
    expect( token instanceof OperatorToken ).toBe( true );
  });

  it( "recognizes a single-quoted string", function() {
    let token = tokenizer( "'foo'" );
    expect( token instanceof StringToken ).toBe( true );
    expect( token.resolveValue({}) ).toBe( "foo" );
  });

  it( "recognizes a double-quoted string", function() {
    let token = tokenizer( "\"foo\"" );
    expect( token instanceof StringToken ).toBe( true );
    expect( token.resolveValue({}) ).toBe( "foo" );
  });

  it( "recognizes a number", function() {
    let token = tokenizer( "42" );
    expect( token instanceof NumberToken ).toBe( true );
    expect( token.resolveValue({}) ).toBe( 42 );
  });

  it( "recognizes a negated number", function() {
    let token = tokenizer( "!42" );
    expect( token instanceof NumberToken ).toBe( true );
    expect( token.resolveValue({}) ).toBe( false );
  });

  it( "recognizes a boolean", function() {
    let token = tokenizer( "true" );
    expect( token instanceof BooleanToken ).toBe( true );
    expect( token.resolveValue({}) ).toBe( true );
  });

  it( "recognizes a negated boolean", function() {
    let token = tokenizer( "!false" );
    expect( token instanceof BooleanToken ).toBe( true );
    expect( token.resolveValue({}) ).toBe( true );
  });

  it( "recognizes a reference", function() {
    let token = tokenizer( "foo.bar" );
    expect( token instanceof ReferenceToken ).toBe( true );
    expect( token.resolveValue({ foo: { bar: "baz" } }) ).toBe( "baz" );
  });

  it( "recognizes a negated reference", function() {
    let token = tokenizer( "!foo" );
    expect( token instanceof ReferenceToken ).toBe( true );
    expect( token.resolveValue({ foo: false }) ).toBe( true );
  });

  it( "rejects a `this.` reference", function() {
    let token = tokenizer( "this.foo" );
    expect( token instanceof InvalidToken ).toBe( true );
  });

  it( "falls back to InvalidToken for unparsable input", function() {
    let token = tokenizer( "-- not valid --" );
    expect( token instanceof InvalidToken ).toBe( true );
  });

});
