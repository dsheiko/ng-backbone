import { View, Model, Collection } from "../../src/core";
import { mapFrom } from "../../src/core/utils";


export function ViewSpec(){
  describe("View", function(){

    describe("#modelsToScope", function(){

      it( "converts flat into scope", function() {
        let models = mapFrom({
          foo: new Model({ name: "foo" }),
          bar: new Model({ name: "bar" })
        }),
        scope = (<any>View).modelsToScope( models );
        expect( scope["foo"].name ).toBe( "foo" );
        expect( scope["bar"].name ).toBe( "bar" );
      });

      it( "converts form states into scope", function() {
        let models = mapFrom({
          "foo.bar": new Model({ name: "bar" }),
          "bar.baz": new Model({ name: "baz" })
        }),
        scope = (<any>View).modelsToScope( models );
        expect( scope["foo"]["bar"].name ).toBe( "bar" );
        expect( scope["bar"]["baz"].name ).toBe( "baz" );
      });

    });

    describe("#collectionsToScope", function(){

      it( "converts collections into scope", function() {
        let collections = mapFrom({
          foo: new Collection([ new Model({ name: "foo" }) ]),
          bar: new Collection([ new Model({ name: "bar" }) ])
        }),
        scope = (<any>View).collectionsToScope( collections );

        expect( scope["foo"][ 0 ].name ).toBe( "foo" );
        expect( scope["bar"][ 0 ].name ).toBe( "bar" );
      });
    });


  });
}