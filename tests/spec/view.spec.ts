import { Component, View, Model, Collection } from "../../src/core";
import { mapFrom } from "../../src/core/utils";


export default function ViewSpec(){
  describe("View", function(){

    describe("@Component + View + no state", function(){
      it( "applies tagName and template", function() {
        @Component({
          tagName: "ng-component",
          template: "<ng-el></ng-el>"
        })
        class TestView extends View {
        }
        let view = new TestView();
        view.render();
        expect( view.el.querySelector( "ng-el" ) ).toBeTruthy();
      });
      it( "applies tagName and className and template", function() {
        @Component({
          tagName: "ng-component",
          className: "ng-class",
          template: "<ng-el></ng-el>"
        })
        class TestView extends View {
        }
        let view = new TestView();
        view.render();
        expect( view.el.querySelector( "ng-el" ) ).toBeTruthy();
        expect( view.el.classList.contains( "ng-class" ) ).toBeTruthy();
      });
    });

    describe("@Component + View + Models", function(){
      it( "binds specified models", function() {
        @Component({
          tagName: "ng-component",
          models: {
            foo: new Model({ bar: "bar" })
          },
          template: `<ng-el data-ng-text="foo.bar">none</ng-el>`
        })
        class TestView extends View {
        }
        let view = new TestView(),
            errors = view.render().errors,
            el = view.el.querySelector( "ng-el" );
        expect( el ).toBeTruthy();
        expect( el.textContent ).toBe( "bar" );
        expect( errors.length ).toBe( 0 );
      });
    });

    describe("@Component + View + Collections", function(){
      it( "binds specified collections", function() {
        @Component({
          tagName: "ng-component",
          collections: {
            foo: new Collection([
              new Model({ bar: 1 }),
              new Model({ bar: 2 })
            ])
          },
          template: `<ng-el data-ng-for="let i of foo" data-ng-text="i.bar">none</ng-el>`
        })
        class TestView extends View {
        }
        let view = new TestView(),
            errors = view.render().errors,
            els = Array.from( view.el.querySelectorAll( "ng-el" ) );
          expect( els.length ).toBe( 2 );
          expect( els[ 0 ].textContent ).toBe( "1" );
          expect( els[ 1 ].textContent ).toBe( "2" );
      });
    });


    describe("View with child View", function(){
      it( "applies tagName and template", function() {
        @Component({
          tagName: "ng-component",
          template: "<ng-child></ng-child>"
        })
        class TestView extends View {
        }
        @Component({
          template: "<ng-el></ng-el>"
        })
        class TestChildView extends View {
        }

        let view = new TestView();
        view.render();
        let child = new TestChildView({
          el: view.el.querySelector( "ng-child" )
        });
        child.render();
        expect( view.el.querySelector( "ng-el" ) ).toBeTruthy();
      });
    });



  });
}
