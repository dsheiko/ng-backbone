import { Collection } from "../../src/core";
import { utils } from "../utils";


class TestCollection extends Collection {
  url= "./mock";
}

export default function UtilsSpec(){
  describe("Collection", function(){

    describe("#fetch", function(){

      it( "returns a resolvable Promise", function( done ) {
        utils.mockFetch({ foo: "foo" });
        let col = new TestCollection();
        col.fetch().then(( collection: Collection ) => {
          let model = collection.shift();
          expect( model.get( "foo" ) ).toBe( "foo" );
          utils.restoreFetch();
          done();
        });
      });

    });

  });
}
