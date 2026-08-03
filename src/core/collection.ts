
export class Collection extends Backbone.Collection<Backbone.Model>  {
  constructor( models?: Backbone.Model[], options?: NgBackbone.DataMap<any>) {
    super( models, options );
  }
}


