declare namespace NgBackbone {

  interface ModelData {
    id?: string | number;
    [key: string]: any;
  }

  interface DataMap<V> {
    [key: string]: V;
  }

  interface Model extends Backbone.Model {

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

  interface ViewConstructors {
    [index: number]: Function | ViewOptions;
  }

  interface Views {
    [index: number]: Function | ViewConstructors;
    forEach( callback?: Function, thisArg?: Object ): void;
    find( callback?: Function, thisArg?: Object ): void;
    map( callback?: Function, thisArg?: Object ): any[];
    push( ...args: any[] ): number;
    length: number;
  }

  interface LoggerHandler {
     ( msg: string, ...args: any[] ): void
  }

  interface LoggerOption extends DataMap<any> {
  }

  interface ViewOptions extends Backbone.ViewOptions<Backbone.Model>{
    [key: string]: any;
    models?: Models;
    collections?: Collections;
    views?: Views;
    formValidators?: { [key: string]: Function; };
    logger?: LoggerOption;
    template?: string;
  }

  interface ComponentDto {
    models: NgBackbone.ModelMap;
    collections: NgBackbone.CollectionMap;
    template: string;
    views?: Views;
  }

  interface ComponentOptions {
    template: string;
    models?: Models;
    collections?: Collections;
    views?: Views;
    el?: any;
    events?: Backbone.EventsHash;
    id?: string;
    className?: string;
    tagName?: string;
    formValidators?: { [key: string]: Function; };
  }
}

