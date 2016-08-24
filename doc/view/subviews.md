# Subviews

We can make our view to create automatically nested views by specifying a list of view constructors:

```javascript
 @Component({
    views: {
      foo: FooView,
      bar: BarView
    }
  })
```
In this case nested view expects `el` view option filled with a selector relative to the parent view.  `View` object calls subview constructors after the first rendering. So it has inner DOM subtree already available and can bind subviews in there.  After subviews instantiated we can find them within `this.view` map of the parent view. If destroy a view with `this.remove()`, it automatically destroys every subview.

When we need passing options to subview constructor, we can use the following syntax:

```javascript
 @Component({
    views: {
      foo: [ FooView, { id: "foo" }],
      bar: [ BarView, { id: "bar" }]
    }
  })
```

Within parent component child ones are available in views map. You can access the instance of a sub-component as this.views.get( "name" ). Thus we obtain the control over child component from the parent:

```javascript
@Component({
  el: "ng-hello",
  events: {
    "click [data-bind=toggleFoo]" : "toggleFoo",
    "click [data-bind=toggleBar]" : "toggleBar"
  },
  views: {
    foo: FooView,
    bar: BarView
  },
  template: `
  <button data-bind="toggleFoo">Show Foo</button>
  <button data-bind="toggleBar">Show Bar</button>
  <ng-foo></ng-foo> <ng-bar></ng-bar>`
})

class AppView extends View {
  toggleFoo(){
    this.views.get( "foo" ).toogle();
  }
  toggleBar(){
    this.views.get( "bar" ).toogle();
  }
}
```