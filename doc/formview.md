# FormView Module

This module is developed to simplify working forms. What do we usually do with Backbone? We subscribe for control change events and write view methods that update view as its state changes. `FormView` does it for us. It extracts the groups marked in the template with `data-ng-group="groupName"`.
Within every found group it collects all the available controls `input[name], textarea[name], select[name]` and binds it to state models respectively. So when state of a control/group changes (e.g. validation fails) that gets available within the template immediately.

For example we have a template:
```html
<form data-ng-group="foo">
  <input name="bar" type="email" required />
  <div data-ng-if="!foo.bar.valid">
    Invalid value
  </div>
</form>
```
Until anything typed in to the input, it's invalid according to `required` restrictor. Thus template variable `foo.bar.valid` is `false` and the template shows container with error message. If we typed in a wrong value for email address `foo.bar.valid` again has 'false' and we can see the message. We can also access the sate of the group as `foo.group`. See below Control/Group State Model Interface for available properties.

## Interface

```javascript
interface FormView extends View {
  getData( groupName: string ): ngBackbone.DataMap<string | boolean>;
  reset( groupName: string ): void;
}
```

* [State Model](./form/state.md)

## Form Validation

`FormView` subscribes for "input", "change" and "focus" events on the found controls. Whenever an event fires it updates the `ControlState`. If the state model reports that `valid` or `touched` property changed, `FormView` updates the `GroupState`.

`FormView` contains following built-in validators:

* `valueMissing` - if the control has `required` attribute and an empty value, `ControlState.valueMissing` is set `false`
* `patternMismatch` - if the control has `pattern` attribute and a value that does not match the specified pattern, `ControlState.patternMismatch` is set `false`
* `rangeOverflow` - if the control has `max` attribute and a value greater than specified in the attribute, `ControlState.rangeOverflow` is set `false`
* `rangeUnderflow` - if the control has `min` attribute and a value less than specified in the attribute, `ControlState.rangeUnderflow` is set `false`
* `typeMismatch` - if the control has type `email`, `tel` or `url` and a value that does not match the corresponding type, `ControlState.typeMismatch` is set `false`

If any of validations fails `ControlState.validationMessage` receives the corresponding error message.

Examples:

```html
<input name="name"  required />
<div data-ng-if="hero.name.valueMissing">
  Name is required
</div>
..
<input name="age"  min="18" max="100" />
<div data-ng-if="hero.age.valueMissing.rangeOverflow || hero.age.valueMissing.rangeUnderflow">
  <span data-ng-text="hero.age.validationMessage"></span>
</div>

```

## ViewForm Example

```javascript
import { Component, FormView } from "ng-backbone/core";


@Component({
  el: "ng-hero",
  events: {
    "submit form": "onSubmitForm"
  },
  template: `
    <form data-ng-group="hero" novalidate>

    <label for="name">Name
      <input name="name" type="text" required >
    </label>
    <div data-ng-if="!hero.name.valid">
      Name is invalid <i ng-data-text="hero.name.validationMessage"></i>
    </div>

    <label for="power">Hero Power
      <select id="power" name="power" class="form-control" required>
        <option>Superhuman strength</option>
        <option>Flight</option>
        <option>Freezing breath</option>
      </select>
    </label>

    <div data-ng-if="!hero.power.valid">
      Power is invalid <i ng-data-text="hero.name.validationMessage"></i>
    </div>

    <button type="submit" data-ng-prop="'disabled', !hero.group.valid">Submit</button>

    </form>

`
})

export class HeroView extends FormView {

  initialize() {
    this.render();
  }

  onSubmitForm( e:Event ){
    e.preventDefault();
    alert( "Form submitted" );
  }

}

```

## Custom Type Validation

You can set up your own custom type validators like that:

```javascript
@Component({
  el: "ng-hero",
  formValidators: {
    hexcolor( value: string ): Promise<void> {
        let pattern = /^#(?:[0-9a-f]{3}){1,2}$/i;
        if ( pattern.test( value  ) ) {
          return Promise.resolve();
        }
        return Promise.reject( "Please enter a valid hexcolor e.g. #EEEAAA" );
      }
  },
  template: `
    <form data-ng-group="hero" novalidate>
      <input name="color" type="hexcolor" />
    </form>

`
})

```

Every validator is a callback that returns a Promise. If validation passes the Promised resolves. Otherwise it rejects with error message passed as an argument


## Remote Type Validation

You can also have a validation that happens on the server.

```javascript

import { Component, FormView, FormValidators, Debounce } from "ng-backbone/core";

class CustomValidators extends FormValidators {
   @Debounce( 350 )
   name( value: string ): Promise<void> {
      return NamerModel.fetch();
   }
}

@Component({
  el: "ng-hero",
  formValidators: CustomValidators,
  template: `
    <form data-ng-group="hero" novalidate>
      <input name="color" type="hexcolor" />
    </form>

`
})

```

`FormView` class the validator with every input event that is by default debounced 100ms. For validation via XHR request you may need greater debounce. We use `@Debounce()` validator to set it.