# View

`View` is meant to be used in conjuction with `@Component` decorator (very like in Angular 2). `@Component` overtakes the
declarative part of the view.

## @Component

```javascript
@Component({

  // Backbone view options
  el?: any,
  events?: Backbone.EventsHash,
  id?: string,
  className?: string,
  tagName?: string,

  // NgBackbone @Component options
  template: string; // string that compiles to the template
  models?: Models | {}; // a map of all models that we bind to template scope
  collections?: Collections | {}; // a map of all collections that we bind to template scope
  formValidators?: { [key: string]: Function; } | FormValidators; //
});
```

`@Component` injects the specified properties into the `View.prototype`. It initializes the template by the specified string and
initializes the maps of models and collections that we want to bind to the template.

## @View

```javascript
interface View extends Backbone.NativeView {
  constructor(options?: NgBackbone.ViewOptions);
  render(): View;
  listenToMap( eventEmitter: Backbone.Events, event: NgBackbone.DataMap ): View;
}

```

`View`  binds models/collections of the specified maps to the template. E.g. models: `{ foo: new Model() }` gets
available in the template cope as `foo`. As soon the the mode changes (`this.models.get("foo").set("bar", "value")`) the template
responds (`foo.bar === "value"`);

```javascript
import { Component, View, Model, Collection } from "ng-backbone/core";

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

## @ViewOptions

```javascript
interface NgBackbone.ViewOptions extends Backbone.ViewOptions<Backbone.Model> {
  models?: Models | {}; // injected shared model map
  collections?: Collections | {}; // injected shared collection map
  formValidators?: { [key: string]: Function; }; // form validator map
  logger?: LoggerOption; // subscribe for logging events
}
```

As you see it is possible to have shared models and collections across the views meaning when such model or collection changes
all the related views synchronize the templates. So you can first create model/collection and then pass the reference to multiple views:

```
let heroes = new HeroCollection();

new HeroView({ collections: { heroes: heroes } });
new HeroListView({ collections: { heroes: heroes } });
```

## Logging Events

* log.sync - fires every time the template synchronizes
* log.listen - fires when View subscribes a model or a collection
* log.template - fires on template warnings

Example:
```
let logger = {
  "log:sync log:template": function( msg: string, ...args: any[] ): void {
      console.log( `LOG(${this.cid}):`, msg, args );
   }
};

new FooView({ logger: logger });
```