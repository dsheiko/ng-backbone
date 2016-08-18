import { promisify } from "./utils";

export class Collection extends Backbone.Collection<Backbone.Model> {
  private options: NgBackbone.DataMap<any>;
  constructor( models?: Backbone.Model[], options?: NgBackbone.DataMap<any>) {
    super( models, options );
    this.options = options || {};
  }

  static validateOptions( options: Backbone.ModelFetchOptions = {} ) {

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
  /**
   * Promisable fetch
   */
  fetch( options: Backbone.ModelFetchOptions = {} ): Promise<any> {
    return promisify(() => {
      Backbone.Collection.prototype.fetch.call( this, options );
    }, options );
  }
  /**
   * Promisable create
   */
  create( attributes: any, options: Backbone.ModelSaveOptions = {} ): Promise<any> {
    return promisify(() => {
      Backbone.Collection.prototype.create.call( this, attributes, options );
    }, options );
  }
}


