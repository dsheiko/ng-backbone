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

  fetch( options: Backbone.ModelFetchOptions = {} ): Promise<any> {
    return new Promise(( resolve: Function, reject: Function ) => {
      options.success = function(){
        return resolve.apply( this, arguments );
      };
      options.error = function(){
        return reject.apply( this, arguments );
      };
      Backbone.Collection.prototype.fetch.call( this, options );
    });
  }
}


