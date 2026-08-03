import { Component, View, Model } from "../../src/core";

describe("NgSwitch", function(){

  describe("@Component + View + data-ng-switch", function(){

    it( "renders the matching case", function() {
      @Component({
        tagName: "ng-component",
        models: {
          foo: new Model({ status: "active" })
        },
        template: `<div data-ng-switch="foo.status">` +
          `<span data-ng-switch-case="'active'">Active</span>` +
          `<span data-ng-switch-case="'inactive'">Inactive</span>` +
          `</div>`
      })
      class TestView extends View {
      }
      let view = new TestView();
      expect( view.render().el.textContent ).toBe( "Active" );
    });

    it( "renders the default case when nothing matches", function() {
      @Component({
        tagName: "ng-component",
        models: {
          foo: new Model({ status: "unknown" })
        },
        template: `<div data-ng-switch="foo.status">` +
          `<span data-ng-switch-case="'active'">Active</span>` +
          `<span data-ng-switch-case-default>Default</span>` +
          `</div>`
      })
      class TestView extends View {
      }
      let view = new TestView();
      expect( view.render().el.textContent ).toBe( "Default" );
    });

  });

});
