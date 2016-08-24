# State Model

## Interface
```javascript
interface State extends Backbone.Model {
}
```

## Control State Model
`ForView` creates and binds `ControlState` to every control found in the target group.

### Interface
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
`ForView` creates and binds `GroupState` to every target group.

### Interface
```javascript
interface GroupState extends State {
  valid:    boolean,  // Control's value is valid
  dirty:    boolean // Control's value has changed
}
```