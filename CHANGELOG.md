# CHANGELOG

# 1.0.3
* Dedup: shared `AbstractArgsDirective` base for ngattr/ngclass/ngdata/ngprop, shared `debounce`
  utility (replacing two separate implementations), removed dead `options` fields on Model/Collection,
  removed a duplicate `VALIDITY_STATE` entry, removed an unused import
* Performance: hoisted regex literals in the expression tokenizer/parser (previously recompiled
  on every call), single render per `bindGroups()` call instead of one per form group, avoided
  constructing a redundant `NgSwitch` sub-template when the switch value hasn't changed, faster
  `hasElement`/`cleanupOrphanSubViews` in the subview map
* Fixed: `FormView.reset()` now actually clears the `dirty` state (previously a no-op due to a
  copy-paste bug)
* Fixed: `EventEmitter.off()` now unsubscribes by function reference instead of comparing
  stringified function source (which could incorrectly match two different functions with
  identical source)
* Fixed: README code example's import path (`backbone-ng` -> `ng-backbone`)
* Added: unit tests for the expression tokenizer, `NgSwitch`, and the ngattr/ngclass/ngdata/ngprop
  directive family (previously untested)

# 1.0.0
* first stable release

## 0.3.1
* Auto-focus on mounting first element matching [autofocus]
* Upgrated up to ngTemplate 0.2.0

## 0.3.0
* View now binds subviews gracefully on "component-did-update" event. When parent DOM changes already bound subviews stay untouched while new one get created for newly appeared matching nodes.
* View gets boolean property `didComponentMount`
* Upgrated up to ngTemplate 0.1.8

## 0.2.2
* View triggers component-will-update/component-did-update/component-will-mount/component-did-mount events, so one can subscribe like this.listenToOnce( this, "..", ...);
* Now collections may have getters available in template
* Now template can be asynchronously loaded. See parameter `templateUrl` into view/component options

## 0.2.1
* Upgrated up to ngTemplate 0.1.7

## 0.2.0
* FormView now fully delegates control validation to Form API ValidityState
* Custom types in FormView get deprecated. FormView treats instead `data-ng-validate` attribute, which accepts multiple validators per control

## 0.1.3
* Introducing React lifecycle methods componentWillMount, componentDidMount, shouldComponentUpdate, componentWillUpdate, componentDidUpdate.
* Two-way view communication: parent view to child one and child to parent

