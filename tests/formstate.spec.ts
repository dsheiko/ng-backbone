import { FormState } from "../src/core/formstate";
import { FormValidators } from "../src/core/formvalidators";
import { Debounce } from "../src/core/utils";
const expect = chai.expect;

export function FormStateSpec(){
  describe("FormState", function(){

    beforeEach(function(){
      this.boundingBox = document.createElement( "div" );
    });



    describe("#isCheckboxRadio", function(){
      beforeEach(function(){
        this.input = document.createElement( "input" );
      });
      it( "returns true for checkbox", function() {
        this.input.type = "checkbox";
        expect( FormState.prototype.isCheckboxRadio( this.input ) ).to.be.ok;
      });
      it( "returns true for radio", function() {
        this.input.type = "radio";
        expect( FormState.prototype.isCheckboxRadio( this.input ) ).to.be.ok;
      });
      it( "returns true for text", function() {
        this.input.type = "text";
        expect( FormState.prototype.isCheckboxRadio( this.input ) ).to.be.not.ok;
      });
    });




    describe("#validateRequired", function(){
      beforeEach(function(){
        this.input = document.createElement( "input" );
        this.state = new FormState();
      });

      it( "sets valueMissing true for empty required", function() {
        this.input.value = "";
        this.input.setAttribute( "required", true );
        this.state.validateRequired( this.input );
        expect( this.state.get( "valueMissing" ) ).to.be.ok;
      });

      it( "sets valueMissing false for empty not-required", function() {
        this.input.value = "";
        this.state.validateRequired( this.input );
        expect( this.state.get( "valueMissing" ) ).to.be.not.ok;
      });

      it( "sets valueMissing false for not-empty required", function() {
        this.input.value = "not-empty";
        this.input.setAttribute( "required", true );
        this.state.validateRequired( this.input );
        expect( this.state.get( "valueMissing" ) ).to.be.not.ok;
      });

      it( "fires change event", function( done ) {
        this.input.value = "";
        this.input.setAttribute( "required", true );
        this.state.on( "change", function( state:any ){
          expect( state.get( "valueMissing" ) ).to.be.ok;
          done();
        });
        this.state.validateRequired( this.input );
        this.state.checkValidity();
      });

    });


    describe("#validateRange", function(){
      beforeEach(function(){
        this.input = document.createElement( "input" );
        this.state = new FormState();
      });

      it( "sets rangeUnderflow true for underflow value", function() {
        this.input.value = 1;
        this.input.setAttribute( "min", "10" );

        this.state.validateRange( this.input );
        expect( this.state.get( "rangeUnderflow" ) ).to.be.ok;
        expect( this.state.get( "validationMessage" ).length ).to.be.ok;
      });

      it( "sets rangeOverflow true for overflow value", function() {
        this.input.value = 100;
        this.input.setAttribute( "max", "10" );
        this.state.validateRange( this.input );
        expect( this.state.get( "rangeOverflow" ) ).to.be.ok;
        expect( this.state.get( "validationMessage" ).length ).to.be.ok;
      });

      it( "resets rangeUnderflow/rangeOverflow for value in the range", function() {
        this.input.value = 10;
        this.input.setAttribute( "min", "1" );
        this.input.setAttribute( "max", "100" );
        this.state.validateRange( this.input );
        expect( this.state.get( "rangeUnderflow" ) ).to.be.not.ok;
        expect( this.state.get( "rangeOverflow" ) ).to.be.not.ok;
        expect( this.state.get( "validationMessage" ).length ).to.be.not.ok;
      });


      it( "fires change event", function( done ) {
        this.input.value = 1;
        this.input.setAttribute( "min", "10" );
        this.state.on( "change", function( state:any ){
          expect( state.get( "rangeUnderflow" ) ).to.be.ok;
          done();
        });
        this.state.validateRange( this.input );
        this.state.checkValidity();
      });

    });


    describe("#patternMismatch", function(){
      beforeEach(function(){
        this.input = document.createElement( "input" );
        this.state = new FormState();
      });

      it( "sets patternMismatch true for a value that does not match pattern", function() {
        this.input.value = "invalid";
        this.input.setAttribute( "pattern", "[A-Z]{3}[0-9]{4}" );

        this.state.patternMismatch( this.input );
        expect( this.state.get( "patternMismatch" ) ).to.be.ok;
        expect( this.state.get( "validationMessage" ).length ).to.be.ok;
      });
    });

    describe("#validateTypeMismatch", function(){
      beforeEach(function(){
        this.input = document.createElement( "input" );
        this.input.value = "invalid";
        this.state = new FormState();
      });

      describe("email", function(){
        it( "validates", function() {
          this.input.setAttribute( "type", "email" );
          this.state.validateTypeMismatch( this.input )
            .then(() => {
              expect( this.state.get( "typeMismatch" ) ).to.be.ok;
              expect( this.state.get( "validationMessage" ).length ).to.be.ok;
            });
        });
      });

      describe("url", function(){
        it( "validates", function() {
          this.input.setAttribute( "type", "url" );
          this.state.validateTypeMismatch( this.input )
            .then(() => {
              expect( this.state.get( "typeMismatch" ) ).to.be.ok;
              expect( this.state.get( "validationMessage" ).length ).to.be.ok;
            });
        });
      });

      describe("tel", function(){
        it( "validates", function() {
          this.input.setAttribute( "type", "tel" );
          this.state.validateTypeMismatch( this.input )
            .then(() => {
              expect( this.state.get( "typeMismatch" ) ).to.be.ok;
              expect( this.state.get( "validationMessage" ).length ).to.be.ok;
            });
        });
      });

      describe("custom type (injected as object literal)", function(){
        it( "validates", function() {
          this.state = new FormState({
            formValidators: {
              foo( value: string ): Promise<void> {
                let pattern = /^(foo|bar)$/;
                if ( pattern.test( value  ) ) {
                  return Promise.resolve();
                }
                return Promise.reject( "Invalid value" );
              }
            }
          });
          this.input.setAttribute( "type", "foo" );
          this.state.validateTypeMismatch( this.input )
            .then(() => {
              expect( this.state.get( "typeMismatch" ) ).to.be.ok;
              expect( this.state.get( "validationMessage" ).length ).to.be.ok;
            });
        });
      });


      describe("custom type (injected as class)", function(){
        it( "validates", function() {

          class CustomValidators extends FormValidators {
            foo( value: string ): Promise<void> {
              let pattern = /^(foo|bar)$/;
              if ( pattern.test( value  ) ) {
                return Promise.resolve();
              }
              return Promise.reject( "Invalid value" );
            }
          }

          this.state = new FormState({
            formValidators: CustomValidators
          });
          this.input.setAttribute( "type", "foo" );
          this.state.validateTypeMismatch( this.input )
            .then(() => {
              expect( this.state.get( "typeMismatch" ) ).to.be.ok;
              expect( this.state.get( "validationMessage" ).length ).to.be.ok;
            });
        });
      });

      describe("custom type debounced", function(){
        it( "validates", function() {

          class CustomValidators extends FormValidators {
            @Debounce( 200 )
            foo( value: string ): Promise<void> {
              let pattern = /^(foo|bar)$/;
              if ( pattern.test( value  ) ) {
                return Promise.resolve();
              }
              return Promise.reject( "Invalid value" );
            }
          }

          this.state = new FormState({
            formValidators: CustomValidators
          });
          this.input.setAttribute( "type", "foo" );
          this.state.validateTypeMismatch( this.input )
            .then(() => {
              expect( this.state.get( "typeMismatch" ) ).to.be.ok;
              expect( this.state.get( "validationMessage" ).length ).to.be.ok;
            });
        });
      });




    });


    describe("#onInputChange", function(){

      beforeEach(function(){
        this.input = document.createElement( "input" );
        this.state = new FormState();
      });

      it( "populates state", function( done ) {
        this.input.value = "";
        this.input.setAttribute( "required", true );

        this.state.on( "change", () => {
          expect( this.state.get( "value" ) ).to.eql( this.input.value );
          expect( this.state.get( "valueMissing" ) ).to.be.ok;
          expect( this.state.get( "dirty" ) ).to.be.ok;
          expect( this.state.get( "valid" ) ).to.be.not.ok;
          expect( this.state.get( "validationMessage" ).length ).to.be.ok;
          done();
        });
        this.state.onInputChange( this.input );
      });

    });


  });

};