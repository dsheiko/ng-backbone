
export class Collection extends Backbone.Collection<Backbone.Model> {
  private options: NgBackbone.DataMap<any>;
  constructor( models?: Backbone.Model[], options?: NgBackbone.DataMap<any>) {
    super( models, options );
    this.options = options || {};
  }

  /**
   * Shortcut for sorting
   */
  orderBy( key: string ): Collection {
    this.comparator = key;
    this.sort();
    this.trigger( "change" );
    return this;
  }
}


