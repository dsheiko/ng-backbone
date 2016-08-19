# View Component

`View` gets nicely along with `@Component` decorator (like in Angular 2). `@Component` overtakes the declarative part of the view.

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
  views?: Views; // constructors for nested views
  formValidators?: { [key: string]: Function; } | FormValidators; //
});
```

`@Component` injects the specified properties into the `View.prototype`.

## View

```javascript
interface View extends Backbone.NativeView {
  constructor(options?: NgBackbone.ViewOptions);
  render(): View;
  listenToMap( eventEmitter: Backbone.Events, event: NgBackbone.DataMap ): View;
  remove(): View;
}

```
`View` creates an instance of NgTemplate based on specified bounding element and template code. It binds models/collections of the given maps to the template. E.g. models: `{ foo: new Model() }` becomes available in the template scope as `foo`. As soon the model changes (`this.models.get("foo").set("bar", "value")`) the template responds (`foo.bar === "value"`);

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

## ViewOptions

```javascript
interface NgBackbone.ViewOptions extends Backbone.ViewOptions<Backbone.Model> {
  models?: Models | {}; // injected shared model map
  collections?: Collections | {}; // injected shared collection map
  formValidators?: { [key: string]: Function; }; // form validator map
  logger?: LoggerOption; // subscribe for logging events
  views?: Views; // constructors for nested views
}
```

As you can see from the `ViewOptions` interface, we can create once option/model map and pass it into view. It makes possible to have shared models and collections across the views. When any of shared model/collection changes, all the related views synchronize:

```
let heroes = new HeroCollection();

new HeroView({ collections: { heroes: heroes } });
new HeroListView({ collections: { heroes: heroes } });
```

## Working with nested views

We can make our view to create automatically nested views by specifying a list of view constructors:

```javascript
 @Component({
    views: [ FooView, BarView ]
  })
```
In this case nested view expects `el` view option filled with a selector relative to the parent view.  `View` object calls subview constructors after the first rendering. So it has inner DOM subtree already available and can bind subviews in there.  After subviews instantiated we can find them within `this.view` array of the parent view. If destroy a view with `this.remove()`, it automatically destroys every subview.

When we need passing options to subview constructor, we can use the following syntax:

```javascript
 @Component({
    views: [
      [ FooView, { id: "foo" }],
      [ BarView, { id: "bar" }]
    ]
  })
```


## Logging Events

* `log.sync` - fires every time the template synchronizes
* `log.listen` - fires when View subscribes a model or a collection
* `log.template` - fires on template warnings

You can subscribe for view events like that:
```
let logger = {
  "log:sync log:template": function( msg: string, ...args: any[] ): void {
      console.log( `LOG(${this.cid}):`, msg, args );
   }
};

new FooView({ logger: logger });
```