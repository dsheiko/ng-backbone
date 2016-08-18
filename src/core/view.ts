import { NgTemplate } from "../ngtemplate";
import { Pointcut } from "../aspect";
import { mapAssign, Debounce } from "./utils";

export class View extends Backbone.NativeView<Backbone.Model> {
  el: HTMLElement;
  models: NgBackbone.ModelMap;
  collections: NgBackbone.CollectionMap;
  template: NgTemplate;
  options: NgBackbone.ViewOptions;

  _initialize: Function;

  constructor( options: NgBackbone.ViewOptions = {} ) {
    super( options );
    this.options = options;
    // If want to listen to log events
    options.logger &&
      this.listenTo( this, "log", options.logger );
    this.initializeOptions( options );
    this.models.size && this._bindModels();
    this.collections && this._bindCollections();
    // Call earlier cached this.initialize
    this._initialize && this._initialize( options );
  }


  private _bindModels(){
      this.models.forEach(( model: Backbone.Model ): void => {
        this.stopListening( model );
        this.trigger( "log", "subscribes for `change`", model );
        this.listenTo( model, "change", this.render );
      });
  }

  private _bindCollections(){
    this.collections.forEach(( collection: Backbone.Collection<Backbone.Model> ) => {
      this.stopListening( collection );
      this.trigger( "log", "subscribes for `change destroy sync`", collection );
      this.listenTo( collection, "change destroy sync", this._onCollectionChange );
    });
  }

  /**
   * When any of this.collections updates we re-subscribe all itts models and fire render
   */
  private _onCollectionChange( collection: NgBackbone.Collection ){
    // @TODO control change of collection models
    this.render( collection );
  }

  /**
   * collections/models passed in options, take them
   */
  initializeOptions( options: NgBackbone.ViewOptions ) {
    if ( !( "models" in this ) ) {
      this.models = <NgBackbone.ModelMap> new Map();
    }
    if ( !( "collections" in this ) ) {
      this.collections = <NgBackbone.CollectionMap> new Map();
    }
    if ( "collections" in options ) {
      mapAssign( this.collections, options.collections );
    }
    if ( "models" in options ) {
      mapAssign( this.models, options.models );
    }
  }

  /**
   * Converts { foo: Collection, bar: Collection } into
   * { foo: [{},{}], bar: [{},{}] }
   */
  private static collectionsToScope(
    collections: NgBackbone.CollectionMap ): NgBackbone.DataMap<NgBackbone.ModelData> {
    let scope: NgBackbone.DataMap<NgBackbone.ModelData> = {};
    collections.forEach(( collection: Backbone.Collection<Backbone.Model>, key: string ) => {
      scope[ key ] = [];
      collection.forEach(( model: Backbone.Model ) => {
          let data: NgBackbone.ModelData = model.toJSON();
          if ( model.id ) {
            data.id = model.id;
          }
          ( <any[]> scope[ key ] ).push( data );
        });
    });
    return scope;
  }
  /**
   * Converts model map into JSON
   */
  private static modelsToScope( models: NgBackbone.ModelMap ): NgBackbone.ModelData {
    let scope: NgBackbone.ModelData = {};
   models.forEach(( model: Backbone.Model, key: string ) => {
      // "groupName.controlName" -> { groupName: { controlName: val } }
      if ( key.indexOf( "." ) !== -1 ) {
        let ref = key.split( "." );
        scope[ ref[ 0 ] ] = scope[ ref[ 0 ] ] || {};
        scope[ ref[ 0 ] ][ ref[ 1 ] ] = model.toJSON();
        return;
      }
      scope[ key ] = model.toJSON();
    });
    return scope;
  }
  /**
   * Render first and then sync the template
   */
  render( source?: NgBackbone.Model | NgBackbone.Collection ){
    let ms =  performance.now();
    let scope: NgBackbone.DataMap<any> = {};
    this.models && Object.assign( scope, View.modelsToScope( this.models ) );
    this.collections && Object.assign( scope, View.collectionsToScope( this.collections ) );
    try {
      this.template.sync( scope );
      this.trigger( "log", "synced template in " + ( performance.now() - ms ) + " ms", scope, source );
    } catch ( err ) {
      console.error( (<Error>err).message );
    }
    return this;
  }

  /**
  * Enhance listenTo to process maps
  * @example:
  * this.listenToMap( eventEmitter, {
  *     "cleanup-list": this.onCleanpList,
  *     "update-list": this.syncCollection
  *   });
  * @param {Backbone.Events} other
  * @param {NgBackbone.DataMap} event
  *
  * @returns {Backbone.NativeView}
  */
  listenToMap( eventEmitter: Backbone.Events, event: NgBackbone.DataMap<string> ): View {
    Object.keys( event ).forEach(function ( key ) {
      Backbone.NativeView.prototype.listenTo.call( this, eventEmitter, key, event[ key ] );
    }, this );
    return this;
  }

}
