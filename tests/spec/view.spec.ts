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
        expect( view.el.querySelector( "ng-el" ) ).toBeTruthy();
      });
    });


    describe("View Lifecycle Methods", function(){
      it( "invokes lifecycle methods", function() {
        let called: string[] = [];
        @Component({
          tagName: "ng-component",
          template: "<ng-el></ng-el>"
        })
        class TestView extends View {
          componentWillMount(): void {
            called.push( "componentWillMount" );
          }
          componentDidMount(): void {
            called.push( "componentDidMount" );
          }
          shouldComponentUpdate( nextScope: NgBackbone.DataMap<any> ): boolean {
            called.push( "shouldComponentUpdate" );
            return true;
          }
          componentWillUpdate( nextScope: NgBackbone.DataMap<any> ): void {
            called.push( "componentWillUpdate" );
          }
          componentDidUpdate( prevScope: NgBackbone.DataMap<any> ): void {
            called.push( "componentDidUpdate" );
          }
        }
        let view = new TestView();
        view.render();
        expect( view.el.querySelector( "ng-el" ) ).toBeTruthy();
        expect( called ).toContain( "componentWillMount" );
        expect( called ).toContain( "componentDidMount" );
        expect( called ).toContain( "shouldComponentUpdate" );
        expect( called ).toContain( "componentWillUpdate" );
        expect( called ).toContain( "componentDidUpdate" );
      });

      it( "prevents rendering if shouldComponentUpdate returns false", function() {
        let called: string[] = [];
        @Component({
          tagName: "ng-component",
          template: "<ng-el></ng-el>"
        })
        class TestView extends View {
          componentWillMount(): void {
            called.push( "componentWillMount" );
          }
          componentDidMount(): void {
            called.push( "componentDidMount" );
          }
          shouldComponentUpdate( nextScope: NgBackbone.DataMap<any> ): boolean {
            called.push( "shouldComponentUpdate" );
            return false;
          }
          componentWillUpdate( nextScope: NgBackbone.DataMap<any> ): void {
            called.push( "componentWillUpdate" );
          }
          componentDidUpdate( prevScope: NgBackbone.DataMap<any> ): void {
            called.push( "componentDidUpdate" );
          }
        }
        let view = new TestView();
        view.render();
        expect( view.el.querySelector( "ng-el" ) ).not.toBeTruthy();
        expect( called ).not.toContain( "componentWillMount" );
        expect( called ).not.toContain( "componentDidMount" );
        expect( called ).not.toContain( "componentWillUpdate" );
        expect( called ).not.toContain( "componentDidUpdate" );
      });

    });


  });
}
