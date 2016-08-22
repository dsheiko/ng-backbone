import { NgTemplate } from "../ngtemplate";
import { ViewHelper } from "./view/helper";
import { Debounce } from "./utils";

export class View extends Backbone.NativeView<Backbone.Model> {
  // bounding box
  el: HTMLElement;
  // models to bind to the template
  models: NgBackbone.ModelMap;
  // collections to bind to the template
  collections: NgBackbone.CollectionMap;
  // array of subviews
  views: View[] = [];
  // instance of NgTemplate
  template: NgTemplate;
  // constructor options getting available across the prototype
  options: NgBackbone.ViewOptions = {
    views: []
  };
  // template errors/warnings
  errors: string[] = [];
  // is this view ever rendered
  isRendered: boolean = false;
  // @Component payload for this class
  _component: NgBackbone.ComponentDto;
  // receives `initialize` of extending class to perform lazy load trick
  _initialize: Function;


  constructor( options: NgBackbone.ViewOptions = {} ) {
    super( options );
    Object.assign( this.options, options );
    // If we want to listen to log events
    options.logger && ViewHelper.subscribeLogger( this, options.logger );
    ViewHelper.initializeOptions( this, options );
    this.models.size && ViewHelper.bindModels( this );
    this.collections && ViewHelper.bindCollections( this );
    // Call earlier cached this.initialize
    this._initialize && this._initialize( options );
  }


  /**
   * Render first and then sync the template
   * Slightly debounced for repeating calls like collection.sync/sort
   */
  @Debounce( 50 )
  render( source?: NgBackbone.Model | NgBackbone.Collection ){
    let ms =  performance.now();
    let scope: NgBackbone.DataMap<any> = {};
    this.models && Object.assign( scope, ViewHelper.modelsToScope( this.models ) );
    this.collections && Object.assign( scope, ViewHelper.collectionsToScope( this.collections ) );
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
    if ( !this.isRendered ) {
      ViewHelper.onceOnRender( this );
    }
    this.isRendered = true;
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

  /**
   * Remove all the nested view on parent removal
   */
  remove() {
    this.views.forEach(( view: View ) => {
      view.remove();
    });
    return Backbone.NativeView.prototype.remove.call( this );
  }

}
