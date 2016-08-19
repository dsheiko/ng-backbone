import { NgTemplate } from "../ngtemplate";
import { mapFrom, mapAssign, Debounce } from "./utils";

export class View extends Backbone.NativeView<Backbone.Model> {
  el: HTMLElement;
  models: NgBackbone.ModelMap;
  collections: NgBackbone.CollectionMap;
  template: NgTemplate;
  options: NgBackbone.ViewOptions = {};
  errors: string[] = [];
  private _component: NgBackbone.ComponentDto;

  _initialize: Function;

  constructor( options: NgBackbone.ViewOptions = {} ) {
    super( options );

    Object.assign( this.options, options );
    // If we want to listen to log events
    options.logger && this._subscribeLogger( options.logger );
    this.initializeOptions( options );
    this.models.size && this._bindModels();
    this.collections && this._bindCollections();
    // Call earlier cached this.initialize
    this._initialize && this._initialize( options );
  }

  /**
   * collections/models passed in options, take them
   */
  initializeOptions( options: NgBackbone.ViewOptions ) {
    let template = "_component" in this ? this._component.template : null;
    // shared template
    if ( "template" in options && this.options.template ) {
      template = this.options.template;
    }
    // process Component's payload
    this.template = new NgTemplate( this.el, template ),

    this.models = mapFrom({});
    this.collections = mapFrom({});

    if ( "_component" in this ) {
      this.models = this._component.models;
      this.collections = this._component.collections;
    }

    if ( "collections" in options ) {
      mapAssign( this.collections, options.collections );
    }
    if ( "models" in options ) {
      mapAssign( this.models, options.models );
    }
  }


  private _subscribeLogger( logger: NgBackbone.LoggerOption ): void {
    Object.keys( logger ).forEach(( events: string ) => {
      this.listenTo( this, events, logger[ events ] );
    });
  }

  private _bindModels(){
      this.models.forEach(( model: Backbone.Model ): void => {
        this.stopListening( model );
        this.options.logger && this.trigger( "log:listen", "subscribes for `change`", model );
        this.listenTo( model, "change", this.render );
      });
  }

  private _bindCollections(){
    this.collections.forEach(( collection: Backbone.Collection<Backbone.Model> ) => {
      this.stopListening( collection );
      this.options.logger && this.trigger( "log:listen", "subscribes for `change destroy sync`", collection );
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
      this.errors = this.template.sync( scope ).report()[ "errors" ];
      this.options.logger && this.errors.forEach(( msg: string ) => {
        this.trigger( "log:template", msg );
      });
      this.options.logger &&
        this.trigger( "log:sync", "synced template on in " + ( performance.now() - ms ) + " ms", scope, source );
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
