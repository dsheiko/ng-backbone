# View Module

## Interface

```javascript
interface View extends Backbone.NativeView {

  // constructor accepts extended map of options - see 'View Options' section
  constructor(options?: ngBackbone.ViewOptions);

  // Update the component (normally doesn't require manual invocation)
  render(): View;

  // Helper to subscribing `listenTo` way by a map
  listenToMap( eventEmitter: Backbone.Events, event: ngBackbone.DataMap ): View;

  // Before removing the view calls this method on every subview
  remove(): View;

  // LIFECYCLE METHODS

  // Override this method when you want to plug in straight before bounding el populated from the template
  componentWillMount(): void;

  // Override this method when you want to plug in straight after bounding el populated from the template
  componentDidMount(): void;

  // Override this method when you want to control manually if the template requires an update
  shouldComponentUpdate( nextScope: NgBackbone.DataMap<any> ): boolean;

  // Override this method when you need preparation before an template update occurs
  componentWillUpdate( nextScope: NgBackbone.DataMap<any> ): void;

  // Override this method when you need to operate on the DOM after template update
  componentDidUpdate( prevScope: NgBackbone.DataMap<any> ): void;
}

```
`View` creates an instance of ngTemplate based on specified bounding element and template code. It binds models/collections of the given maps to the template. E.g. models: `{ foo: new Model() }` becomes available in the template scope as `foo`. As soon the model changes (`this.models.get("foo").set("bar", "value")`) the template responds (`foo.bar === "value"`);

```javascript
import { Component, View, Model, Collection } from "../ng-backbone/core";

@Component({
  el: "ng-hero",
  models: {
    hero: new Model({
      "name": "Superman"
    })
  },
  collections: {
    powers: new Collection([
      { name: "Superhuman strength" },
      { name: "Flight" }
      { name: "Freezing breath" }
    ])
  },

  template: `
    <p><strong data-ng-text="hero.title"></strong> has powers:</p>
    <dl data-ng-for="let p of powers">
      <dt data-ng-text="p.name"></dt>
    </dl>
`
})

export class HeroView extends FormView {

  initialize() {
    this.render();
  }

}

```

* [View Options](./view/options.md)
* [Subviews](./view/subviews.md)
* [Logging Events](./view/logger.md)

