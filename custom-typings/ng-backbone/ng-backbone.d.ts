declare namespace NgBackbone {

  interface DataMap { [key: string]: any; }
  interface Models { [key: string]: any; }
  interface Collections { [key: string]: Backbone.Collection<any>; }

  interface ComponentOptions {
    template: any;
    models?: Backbone.Model[];
    collections?: Backbone.Collection<any>[];
    el?: any;
    events?: Backbone.EventsHash;
    id?: string;
    className?: string;
    tagName?: string;
  }
}

