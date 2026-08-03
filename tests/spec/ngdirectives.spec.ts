import { Component, View, Model } from "../../src/core";

describe("ngattr/ngclass/ngdata/ngprop", function(){

  describe("data-ng-attr", function(){
    it( "sets the attribute when the second arg is truthy", function() {
      @Component({
        tagName: "ng-component",
        models: { foo: new Model({ checked: true }) },
        template: `<input data-ng-attr="'checked', foo.checked">`
      })
      class TestView extends View {
      }
      let el = <HTMLInputElement>new TestView().render().el.querySelector( "input" );
      expect( el.getAttribute( "checked" ) ).toBe( "true" );
    });

    it( "removes the attribute when the second arg is falsy", function() {
      @Component({
        tagName: "ng-component",
        models: { foo: new Model({ checked: false }) },
        template: `<input data-ng-attr="'checked', foo.checked" checked>`
      })
      class TestView extends View {
      }
      let el = <HTMLInputElement>new TestView().render().el.querySelector( "input" );
      expect( el.hasAttribute( "checked" ) ).toBe( false );
    });
  });

  describe("data-ng-class", function(){
    it( "toggles a class on/off based on the second arg", function() {
      @Component({
        tagName: "ng-component",
        models: { foo: new Model({ isHidden: true }) },
        template: `<div data-ng-class="'is-hidden', foo.isHidden"></div>`
      })
      class TestView extends View {
      }
      let el = <HTMLElement>new TestView().render().el.querySelector( "div" );
      expect( el.classList.contains( "is-hidden" ) ).toBe( true );
    });
  });

  describe("data-ng-data", function(){
    it( "sets a dataset entry", function() {
      @Component({
        tagName: "ng-component",
        models: { foo: new Model({ value: "bar" }) },
        template: `<div data-ng-data="'foo', foo.value"></div>`
      })
      class TestView extends View {
      }
      let el = <HTMLElement>new TestView().render().el.querySelector( "div" );
      expect( el.dataset[ "foo" ] ).toBe( "bar" );
    });
  });

  describe("data-ng-prop", function(){
    it( "sets a DOM property", function() {
      @Component({
        tagName: "ng-component",
        models: { foo: new Model({ disabled: true }) },
        template: `<button data-ng-prop="'disabled', foo.disabled"></button>`
      })
      class TestView extends View {
      }
      let el = <HTMLButtonElement>new TestView().render().el.querySelector( "button" );
      expect( el.disabled ).toBe( true );
    });
  });

});
