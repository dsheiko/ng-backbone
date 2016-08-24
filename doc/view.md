# View Module

## Interface

```javascript
interface View extends Backbone.NativeView {
  constructor(options?: ngBackbone.ViewOptions);
  render(): View;
  listenToMap( eventEmitter: Backbone.Events, event: ngBackbone.DataMap ): View;
  remove(): View;
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

