# NgBackbone 1.0 BETA

[![NPM](https://nodei.co/npm/ng-backbone.png)](https://nodei.co/npm/ng-backbone/)

[![Build Status](https://travis-ci.org/dsheiko/ng-backbone.png)](https://travis-ci.org/dsheiko/ng-backbone)

`NgBackbone` is a small extension of [Backbone.js](http://backbonejs.org/) that unlocks Angular-like programming experience

Well, I love old good Backbone for its simplicity and flexibility. However after working with such frameworks as Angular and React, I see that Backbone app requires much more code. Yet I don't want to ditch Backbone and deal with some 20K LOC framework codebase. I just want a minimal modular extension that will improve my programming experience and maintainability of my code.
And that is how I came up with `NgBackbone`

[NgBackbone.Book](https://dsheiko.gitbooks.io/ng-backbone/content/)

## Motivation
* Angular inspired live templates via [NgTemplate](https://github.com/dsheiko/ng-template)
* Separation of declarative (@Component + template) and impreative programming
* 2-way binding
* Testable views
* Control over nested views*
* Asynchronous form validators (e.g. server-side validation)
* Debauncable form validators
* Fluent TypeScript programming experience


My base Backbone build consists of [Exoskeleton](https://github.com/paulmillr/exoskeleton) (Backbone decoupled from Underscore), [Backbone.NativeView](https://github.com/akre54/Backbone.NativeView) (Backbone View decoupled from jQuery) and
[Backbone.Fetch](https://github.com/akre54/Backbone.Fetch) (Backbone.sync leveraging Feth API instead of XHR)

`NgBackbone` extends the base with:
* View module + @Component decorator that provide 1-way binding and control over nested views
* FormView module that gives 2-way binding
* Model module that make methods `fetch`, `save` and `destroy` promisable
* Collection module make methods `fetch` and `create` promisable

## How does it look?

```javascript
import { Component, FormView } from "backbone-ng/core";
import { HeroPowers } from "./Collection/HeroPowers";

@Component({
  el: "ng-hero",
  events: {
    "submit form": "onSubmitForm"
  },
  collections: {
    powers: new HeroPowers()
  },
  template: `
    <form data-ng-group="hero" novalidate>
      <div class="form-group">
        <label for="name">Name</label>
        <input id="name" name="name" type="text" class="form-control" required >
        <div class="alert alert-danger" data-ng-if="hero.name.valueMissing">
          Name is required
        </div>
      </div>
      <div class="form-group">
        <label for="power">Hero Power</label>
        <select id="power" name="power" class="form-control" pattern=".{2}">
          <option data-ng-for="let p of powers" data-ng-text="p.name" >Nothing here</option>
        </select>
        <div class="alert alert-danger" data-ng-if="hero.power.dirty && !hero.power.valid">
          Power is required
        </div>
      </div>
       <button type="submit" class="btn btn-default" data-ng-prop="'disabled', !hero.form.valid">Submit</button>\n\
    </form>
`
})

export class HeroView extends FormView {
  el: HTMLElement;
  models: NgBackbone.ModelMap;

  initialize() {
    this.models.get( "powers" ).fetch();
    this.render();
  }

  onSubmitForm( e:Event ){
    e.preventDefault();
    alert( "Form submitted" )
  }

}

```

# Documentation

* [Template syntax](./doc/gettingstarted/template.md)
* [View](./doc/gettingstarted/view.md)
* [FormView](./doc/gettingstarted/formview.md)
* [Model](./doc/gettingstarted/model.md)
* [Collection](./doc/gettingstarted/collection.md)

## Contributing

`NgBackbone` welcomes maintainers. There is plenty of work to do. No big commitment required,
if all you do is review a single Pull Request, you are a maintainer.


### How to set up

```
npm install typescript -g
npm install
typings install
```

### How to build

```
tsc
```

### How to run tests

```
npm run test
```