import { Component, View, Model, Collection } from "../../src/core";
import { mapFrom } from "../../src/core/utils";


export default function SubviewSpec(){
  describe("Subview", function(){


    describe("View with nested views straigtforward", function(){
      it( "renders both parent and child views", function() {
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

    describe("View with nested views as @Component.views = [Ctor, Ctor]", function(){
      it( "renders both parent and child views", function() {

        @Component({
          el: "ng-child",
          template: "<ng-el></ng-el>"
        })
        class TestChildView extends View {
          initialize(){
            this.render();
          }
        }

        @Component({
          tagName: "ng-component",
          template: "<ng-child></ng-child>",
          views: {
            foo: TestChildView
          }
        })
        class TestView extends View {
        }


        let view = new TestView();
        view.render();
        expect( view.views.get( "foo" ) instanceof TestChildView ).toBeTruthy();
        expect( view.views.get( "foo" ).parent instanceof TestView ).toBeTruthy();
        expect( view.el.querySelector( "ng-el" ) ).toBeTruthy();
      });
    });

    describe("View with nested views as @Component.views = [[Ctor, options]]", function(){
      it( "renders both parent and child views", function() {

        @Component({
          el: "ng-child",
          template: "<ng-el></ng-el>"
        })
        class TestChildView extends View {
          initialize( options: any ){
            expect( options.id ).toBe( "ngId" );
            this.render();
          }
        }

        @Component({
          tagName: "ng-component",
          template: "<ng-child></ng-child>",
          views: {
            foo: [ TestChildView, { id: "ngId" } ]
          }
        })
        class TestView extends View {
        }


        let view = new TestView();
        view.render();
        expect( view.views.get( "foo" ) instanceof TestChildView ).toBeTruthy();
        expect( view.views.get( "foo" ).parent instanceof TestView ).toBeTruthy();
        expect( view.el.querySelector( "ng-el" ) ).toBeTruthy();
      });
    });

  });
}
