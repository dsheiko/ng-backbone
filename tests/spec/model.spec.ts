import { Model } from "../../src/core";
import { MockFetch } from "../utils";


class TestModel extends Model {
  url= "./mock";
}

export default function UtilsSpec(){
  describe("Model", function(){

    describe("#fetch", function(){

      it( "returns a resolvable Promise", function( done ) {
        let mock = new MockFetch({ foo: "foo" });
        let test = new TestModel();
        test.fetch().then(( model: Model ) => {
          expect( model.get( "foo" ) ).toBe( "foo" );
          mock.restore();
          done();
        });
      });

      it( "does not fall on rejection", function( done ) {
        let mock = new MockFetch({ foo: "foo" }, new Error( "Read error" ) );
        let test = new TestModel();
        test.fetch()
          .catch(( err: Error ) => {
            expect( err.message.length > 0 ).toBe( true );
            mock.restore();
            done();
          });
      });

    });

    describe("#save", function(){
      it( "returns a resolvable Promise", function( done ) {
        let mock = new MockFetch();
        let test = new TestModel();
        test.save({ foo: "bar" }).then(( model: Model ) => {
          expect( model.get( "foo" ) ).toBe( "bar" );
          mock.restore();
          done();
        });
      });
    });

    describe("#destroy", function(){
      it( "returns a resolvable Promise", function( done ) {
        let mock = new MockFetch();
        let test = new TestModel({ foo: "bar" });
        test.destroy().then(( model: Model ) => {
          expect( model.get( "foo" ) ).toBe( "bar" );
          mock.restore();
          done();
        });
      });
    });

  });
}
