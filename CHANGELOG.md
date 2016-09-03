# CHANGELOG

## 0.2.2
* View triggers "will-update" an "did-update" events, so one can subscribe like this.listenToOnce( this, "..", ...);
* Now collections may have getters available in template

## 0.2.1
* upgrated up to ngTemplate 0.1.7 

## 0.2.0
* FormView now fully delegates control validation to Form API ValidityState
* Custom types in FormView get deprecated. FormView treats instead `data-ng-validate` attribute, which accepts multiple validators per control

## 0.1.3
* Introducing React lifecycle methods componentWillMount, componentDidMount, shouldComponentUpdate, componentWillUpdate, componentDidUpdate.
* Two-way view communication: parent view to child one and child to parent

