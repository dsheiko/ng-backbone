declare namespace NgBackbone {

  interface ModelData {
    id?: string | number;
    [key: string]: any;
  }

  interface DataMap<V> {
    [key: string]: V;
  }

  interface Collection extends Backbone.Collection<Backbone.Model> {
    orderBy( key: string ): Collection;
  }

  interface ModelMap extends  Map<string, Backbone.Model> {
  }

  interface CollectionMap extends Map<string, Collection> {
  }

  interface Models {
    [key: string]: any;
  }
  interface Collections {
    [key: string]: Backbone.Collection<Backbone.Model>;
  }

  interface ViewOptions extends Backbone.ViewOptions<Backbone.Model>{
    [key: string]: any;
    models?: Models | {};
    collections?: Collections | {};
    formValidators?: { [key: string]: Function; };
  }


  interface ComponentOptions {
    template: string;
    models?: Models | {};
    collections?: Collections | {};
    el?: any;
    events?: Backbone.EventsHash;
    id?: string;
    className?: string;
    tagName?: string;
    formValidators?: { [key: string]: Function; };
  }
}

