
# NgTemplate

[NgTemplate](https://github.com/dsheiko/ng-template) is a light-weight DOM-based template engine, inspired by AngularJS.


## Template expressions

Template expressions are being evaluated in the given `scope`. So we can reference scope variables:
```
data-ng-if="foo"
```
it can bind to the following scope
```
{ foo: true }
```

That includes structures:
```
data-ng-if="foo.bar"
```
it can bind to the following scope
```
{
  foo: {
    bar: true
  }
}
```

We can refer multiple scope variables:
```
data-ng-if="(foo && bar)"
```
it can bind to the following scope
```
{ foo: true, bar: true }
```

Expressions are also evaluated in the context of the target element, so we can access the element with `this`:
```
data-ng-if="(foo && this.checked)"
```
it can bind to the following scope
```
{ foo: true }
```

We can pass rendering helpers (e.g. transformers) with the scope:
```
data-ng-if="decorator(foo)"
```
it can bind to the following scope
```
{
  foo: "foo",
  decorator: function( val ){
    return "decorated " + val;
  }
}
```

> :exclamation: NOTE: In order to gain better performance keep to primitive expressions especially in cyclic directives e.g. `data-ng-text="foo.bar.baz"`,
> `data-ng-text="!foo.bar.baz"`, `data-ng-text="'string here'"`, `data-ng-text="foo.bar.baz"`, `data-ng-text="1000"`
> `data-ng-if="true"`, `data-ng-prop="'disabled', false"`, `data-ng-data="'someCustomKey', bar.baz"`
> Such expressions are being evaluated without use of `eval()` and therefore the process takes much less time and resources



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


### NgClassListToggle

We use `NgClassListToggle` to modify element's `classList`

#### Syntax

```
<el data-ng-class-list-toggle="expression => className:string, expression => toggle:boolean" />
```

#### Examples

```html
<i data-ng-class-list-toggle="'is-hidden', isHidden"></i>
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

