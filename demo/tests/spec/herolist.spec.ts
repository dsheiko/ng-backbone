import { Collection, Model } from "../../../src/core";
import { HeroListView } from "../../src/View/HeroList";

class MockCollection extends Collection {
  fetch( options?: Backbone.ModelFetchOptions ): JQueryXHR {
    return <JQueryXHR>null;
  }

  orderBy( key: string ): Collection {
    this.comparator = key;
    this.sort();
    return this;
  }
}

export default function HeroListSpec(){

   describe("Hero View", function(){

    beforeEach(function(){
      this.view = new HeroListView({
         el: null,
         tagName: "ng-herolist",
         collections: {
           heroes: new MockCollection([
             new Model({ name: "name1", power: "power3" }),
             new Model({ name: "name2", power: "power2" }),
             new Model({ name: "name3", power: "power1" })
           ])
         }
       });
    });

    it( "renders into view all the models of the specified collection ", function() {
      this.view.render();
      let items = this.view.el.querySelectorAll( "tr.list__tool-row" );
      expect( items.length ).toBe( this.view.collections.get( "heroes" ).length );
    });

    it( "sorts the table by a given key", function() {
      this.view
        .render()
        .orderBy( "power" );

      let first = this.view.el.querySelector( "tr.list__tool-row" );
      expect( first.textContent ).toMatch( "power3" );
    });

  });

}
