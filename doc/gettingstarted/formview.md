# FormView

`FormView` looks for the groups marked in the template as `data-ng-group="groupName"`.
within every found group it collects all the available controls (`input[name], textarea[name], select[name]`) and
binds it to state models respectively. For example for this template:
```html
<form data-ng-group="foo">
  <input name="bar" />
</form>
```
we can access the state of the input as `foo.bar` and the state of the group as `foo.form`.

## FormView 

```javascript
interface FormView extends View {
  getData( groupName: string ): NgBackbone.DataMap<string | boolean>;
}
```


## State Model
```javascript
interface State extends Backbone.Model {
}
```

## Control State Model
```javascript
interface ControlState extends State {
  value:    string,
  valid:    boolean,  // Control's value is valid
  touched:  boolean, // Control has been visited
  dirty:    boolean, // Control's value has changed
  valueMissing: boolean, // indicating the element has a required attribute, but no value.
  rangeOverflow: boolean, // indicating the value is greater than the maximum specified by the max attribute.
  rangeUnderflow: boolean, // indicating the value is less than the minimum specified by the min attribute.
  typeMismatch: boolean, // indicating the value is not in the required syntax
  patternMismatch: boolean, // indicating the value does not match the specified pattern
  validationMessage: string
}
```

## Group State Model
```javascript
interface GroupState extends State {
  valid:    boolean,  // Control's value is valid
  dirty:    boolean // Control's value has changed
}
```

## Form Validation

`FormView` subscribes for "input", "change" and "focus" events on the found controls. Whenever an event is fired
it updates the `ControlState`. If the state model reports that `valid` or `touched` property was changed, `FormView`
updates the `GroupState`.

`FormView` has following built-in validators:

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

    <button type="submit" data-ng-prop="'disabled', !hero.form.valid">Submit</button>

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



## Custom Type Validators

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

Every validator is callback that returns a Promise. If validation passes the Promised resolves, otherwise it
rejects with error message passed as an argument


## Remote Type Validators

You can also implement validation that happens on the server.

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

The validator is called with every input event that is by default debounced 100ms. For validation via XHR request
you may need greater debounce. We use `@Debounce()` validator to set it