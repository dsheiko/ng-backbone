
# NgTemplate

[NgTemplate](https://github.com/dsheiko/ng-template) is a light-weight DOM-based template engine, inspired by AngularJS.


## Template expressions

Template expressions are being evaluated in the given `scope`. So we can reference scope variables within template e.g.
`data-ng-if="foo"` refers to `foo` variable of the scope and therefore:

```javascript
template.sync({ foo: true }); // show element
template.sync({ foo: false }); // hide element
```

We access scope objects the same way we do it in JavaScript e.g. `data-ng-if="foo.bar"` refers to `foo.bar` and can be toggled like this:
```javascript
template.sync({ foo: { bar: true } }); // show element
```

Expressions may have mixed scope variables and primitives:
```
data-ng-if="foo && bar.baz || false"
data-ng-if="foo + 10  > 20"
```

We can pass rendering helpers (e.g. transformers) with the scope. For example we pass `decorator` to the directive `data-ng-if="decorator(foo)"` this way:
```
{
  foo: "foo",
  decorator: function( val ){
    return "decorated " + val;
  }
}
```

Expressions are evaluated in the context of the target element, so we can access the element with `this`:
```
data-ng-if="foo && this.checked"
```

> :exclamation: NOTE: In order to gain better performance keep to primitive expressions especially in cyclic directives e.g. `data-ng-text="foo.bar.baz"`,
> `data-ng-text="!foo.bar.baz"`, `data-ng-text="'string here'"`, `data-ng-if="foo.bar > baz.quiz"`, `data-ng-text="foo + 10`,
> `data-ng-if="true"`, `data-ng-prop="'disabled', true || false"`, `data-ng-data="foo || bar, baz"`.
> Such expressions are being evaluated without use of `eval()` and therefore the process takes much less time and resources.
> You can check how the parser treats your expressions by studying content of `template.report().tokens` array


## Directives

### NgText

We use `NgText` to modify element's `textNode`

#### Syntax

```
<el data-ng-text="expression => text:string|number" />
```

#### Examples

```html
<i data-ng-text="foo"></i>
```


### NgProp

We use `NgProp` to modify element's properties

#### Syntax

```
<el data-ng-prop="expression => propertyName:string, expression => value:boolean|string" />
```

#### Examples

```html
<button data-ng-prop="'disabled', isDisabled"></button>
```


### NgData

We use `NgData` to modify element's dataset

#### Syntax

```
<el data-ng-data="expression => datasetKey:string, expression => datasetValue:string" />
```

#### Examples

```html
<div data-ng-data="'dateOfBirth', value"></div>
```


### NgClass

We use `NgClass` to modify element's `classList`

#### Syntax

```
<el data-ng-class="expression => className:string, expression => toggle:boolean" />
```

#### Examples

```html
<i data-ng-class="'is-hidden', isHidden"></i>
```


### NgIf

We use `NgFor` to toggle visibility of an element (subtree) within the DOM

#### Syntax

```
<el data-ng-if="expression => condition:boolean" />
```

#### Examples

```html
<i data-ng-if="toggle">Hello!</i>
```


### NgFor

We use `NgFor` when we need to generate a list of elements (subtrees)

#### Syntax

```
<el data-ng-for="let variable of expression => list:any[]" />
```

#### Examples

```html
<i data-ng-for="let row of rows" data-ng-text="row"></i>
```


### NgSwitch

We use `NgSwitch` when we need to display on element (subtree) of a set of available options.

#### Syntax

```
<el data-ng-switch="expression => variable:string|number">
  <el data-ng-switch-case="expression => value:string|number" />
  <el data-ng-switch-default />
</el>
```

#### Examples

```html
<div data-ng-switch="theCase">
    <i data-ng-switch-case="1">FOO</i>
    <i data-ng-switch-case="2">BAR</i>
    <i data-ng-switch-case-default>BAZ</i>
  </div>
```


### NgEl

We use `NgEl` to modify element properties

> NOTE: Using `NgEl` is rather discouraging as it cannot be cached and every model sync will
cause the DOM modification even if the expression of `NgEl` wasn't changed

#### Syntax

```
<el data-ng-el="expression => eval:void" />
```

#### Examples

```html
<i data-ng-el="this.textNode = mymodel.foo"></i>
<i data-ng-el="this.setAttribute( 'name', mymodel.foo )"></i>
<i data-ng-el="this.disabled = state.isVisible"></i>
<i data-ng-el="this.classList.toggle('name', model.foo)"></i>
```

