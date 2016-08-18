import { promisify } from "./utils";

export class Model extends Backbone.Model {
  private options: NgBackbone.DataMap<any>;
  constructor( attributes?: NgBackbone.DataMap<any>, options?: NgBackbone.DataMap<any>) {
    super( attributes, options );
    this.options = options || {};
  }
  /**
   * Promisable destroy
   */
  destroy( options: Backbone.ModelDestroyOptions = {} ): Promise<any> {
    return promisify(() => {
      Backbone.Model.prototype.destroy.call( this, options );
    }, options );
  }
  /**
   * Promisable save
   */
  save( attributes?: any, options: Backbone.ModelSaveOptions = {} ): Promise<any> {
    return promisify(() => {
      Backbone.Model.prototype.save.call( this, attributes, options );
    }, options );
  }
  /**
   * Promisable fetch
   */
  fetch( options: Backbone.ModelFetchOptions = {} ): Promise<any> {
    return promisify(() => {
      Backbone.Model.prototype.fetch.call( this, options );
    }, options );
  }
}

