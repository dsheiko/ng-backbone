import { FormView, Model } from "../../src/core";
import { FormState } from "../../src/core/formstate";

export function FormViewSpec(){
  describe("FormView", function(){


    describe("#_findGroups", function(){
      it( "finds forms within boundinx box", function() {
        let el = document.createElement( "div" ),
            view = new FormView({
              el: el
            });
        el.innerHTML = `<div><form data-ng-group="foo"></form><form data-ng-group="bar"></form></div>`;
        let forms = (<any>view)._findGroups();

        expect( Array.isArray( forms ) ).toBe( true );
        expect( forms[ 0 ].dataset[ "ngGroup" ] ).toBe( "foo" );
        expect( forms[ 1 ].dataset[ "ngGroup" ] ).toBe( "bar" );
      });

      it( "finds form on boundinx box", function() {
        let el = document.createElement( "form" ),
            view = new FormView({
              el: el
            });
        el.innerHTML = `<div><form data-ng-group="foo"></form><form data-ng-group="bar"></form></div>`;
        el.dataset[ "ngGroup" ] = "baz"
        let forms = (<any>view)._findGroups();
        // If boundinx box not inner forms allowed
        expect( forms.length ).toBe( 1 );
        expect( forms[ 0 ].dataset[ "ngGroup" ] ).toBe( "baz" );
      });

    });

    describe("#_bindGroup", function(){
      it( "sets a model to  this.models.FormName.group", function() {
        let el = document.createElement( "form" ),
            view = new FormView({
              el: el
            });
        el.dataset[ "ngGroup" ] = "baz";
        (<any>view)._bindGroup( el, "baz" );
        let model = view.models.get( "baz.group" );
        expect( model instanceof FormState ).toBe( true );
      });
    });

    describe("#_findGroupElements", function(){
      it( "finds all form inputs", function() {
        let el = document.createElement( "form" ),
            next: HTMLInputElement,
            view = new FormView({
              el: el
            });
        el.dataset[ "ngGroup" ] = "baz";
        el.innerHTML = `<div>
<input name="inputText" />
<input name="inputCheckbox" type="checkbox" />
<input name="inputEmail" type="email" />
<select name="select"></select>
<custom name="quiz"></custom>
</div>`;

        let els = (<any>view)._findGroupElements( el );
        expect( Array.isArray( els ) ).toBe( true );
        expect( els.length  ).toBe( 4 );

      });
    });

    describe("#_bindGroupElement", function(){
      it( "finds all form elements", function() {
        let el = document.createElement( "form" ),
            next: HTMLInputElement,
            view = new FormView({
              el: el
            });

        el.dataset[ "ngGroup" ] = "baz";

        (<any>view)._bindGroup( el, "foo" );
        (<any>view)._bindGroupElement( "foo", "bar" );
        let model = view.models.get( "foo.bar" );
        expect( model instanceof FormState ).toBe( true );
      });
    });


  });

}
