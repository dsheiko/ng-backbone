import { Collection, Component, View, Model } from "../../../src/core";


@Component({
  el: "ng-herolist",
  events: {
    "change [data-bind=checkbox]": "syncCheckboxCounter",
    "click [data-sort]": "onClickSort",
    "click [data-bind=remove]": "onClickRemoveGroup",
    "click [data-bind=markall]": "onClickMarkAll"
  },
  models: {
    state: new Model({
      selected: 0,
      order: ""
    })
  },
  template: `

<table class="table">
<tr>
  <th data-bind="markall"><i class="glyphicon glyphicon-ok"></i>&nbsp;</th>
  <th data-sort="name">Name <i data-ng-class-list-toggle="'is-inactive', state.order === 'name'" class="glyphicon glyphicon-chevron-down pull-right is-inactive"></i></th>
  <th data-sort="power">Power <i data-ng-class-list-toggle="'is-inactive', state.order === 'power'" class="glyphicon glyphicon-chevron-down pull-right is-inactive"></i></th>
</tr>
<tr data-ng-for="let p of heroes" class="list__tool-row">

  <td>
    <label>
    <input data-bind="checkbox" type="checkbox" data-ng-data="'id', p.id" />
    </label>
  </td>

  <td data-ng-text="p.name" ></td>
  <td data-ng-text="p.power" ></td>\n\

</tr>

</table>

<div class="row">
  <span><span data-ng-text="state.selected">0</span> selected items</span>
  <button data-bind="remove" class="btn btn-danger" data-ng-if="state.selected">Remove selected</button>
</div>

`
})

export class HeroListView extends View {
  el: HTMLElement;
  models: NgBackbone.ModelMap;
  collections: NgBackbone.CollectionMap;

  initialize() {
    this.collections.get( "heroes" ).fetch();
    this.render();
  }

  syncCheckboxCounter(){
    let selected: number = this.el.querySelectorAll( "[data-bind=checkbox]:checked" ).length,
        model = this.models.get( "state" );
    model.set( "selected", selected );
  }

  onClickMarkAll() {
    let checkboxes = Array.from( this.el.querySelectorAll( "[data-bind=checkbox]" ) );
    checkboxes.forEach(( el: HTMLInputElement ) => {
      el.checked = true;
    });
    this.syncCheckboxCounter();
  }

  onClickRemoveGroup( e: Event ){
    let selected = Array.from( this.el.querySelectorAll( "[data-bind=checkbox]:checked" ) ),
        collection = this.collections.get( "heroes" );
    e.preventDefault();

    selected.forEach(( el:HTMLInputElement ) => {
      let model = collection.get( el.dataset[ "id" ] );
      model.destroy();
    });
    this.syncCheckboxCounter();
  }



  onClickSort( e:Event ) {
    let el = <HTMLElement>e.target,
        state = this.models.get( "state" ),
        collection = this.collections.get( "heroes" ),
        order: string = el.dataset[ "sort" ];

    e.preventDefault();

    state.set( "order", order );

    collection.orderBy( order );
  }
}
