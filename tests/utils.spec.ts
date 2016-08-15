import { mapAssign, mapFrom } from "../src/core/utils";
const expect = chai.expect;

export default function UtilsSpec(){
  describe("Utils", function(){

    describe("#mapFrom", function(){

      it( "converts object literal for map ", function() {
        let map = mapFrom({
          foo: 1,
          bar: 2
        });
        expect( map ).to.be.instanceOf( Map );
        expect( map.get( "foo" ) ).to.eql( 1 );
      });
    });


    describe("#mapAssign", function(){

      it( "mixes in object literal into map ", function() {
        let map = new Map();
        map.set( "foo", 1 );
        mapAssign( map, {
          bar: 2
        });
        expect( map ).to.be.instanceOf( Map );
        expect( map.get( "foo" ) ).to.eql( 1 );
        expect( map.get( "bar" ) ).to.eql( 2 );
      });
    });

  });
}
