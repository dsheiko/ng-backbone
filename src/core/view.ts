import { NgTemplate } from "../ngtemplate";
import { ViewHelper } from "./view/helper";

export class View extends Backbone.NativeView<Backbone.Model> {
  // bounding box
  el: HTMLElement;
  // models to bind to the template
  models: NgBackbone.ModelMap;
  // collections to bind to the template
  collections: NgBackbone.CollectionMap;
  // array of subviews
  views: NgBackbone.ViewMap;
  // instance of NgTemplate
  template: NgTemplate;
  // constructor options getting available across the prototype
  options: NgBackbone.ViewOptions = {};
  // template errors/warnings
  errors: string[] = [];
  // is this view ever rendered
  isRendered: boolean = false;
  // link to parent view
  parent: View;
  // @Component payload for this class
  _component: NgBackbone.ComponentDto;
  // receives `initialize` of extending class to perform lazy load trick
  _initialize: Function;

  _debounceTimer: number;

  constructor( options: NgBackbone.ViewOptions = {} ) {
    super( options );
    Object.assign( this.options, options );
    if ( options.parent ) {
      this.parent = <View>options.parent;
    }
    // If we want to listen to log events
    options.logger && ViewHelper.subscribeLogger( this, options.logger );
    ViewHelper.initializeOptions( this, options );
    this.models.size && ViewHelper.bindModels( this );
    this.collections && ViewHelper.bindCollections( this );
    // Call earlier cached this.initialize
    this._initialize && this._initialize( options );
  }
  /**
   * Abstract method: implement it when you want to plug in straight before el.innerHTML populated
   */
  componentWillMount(): void {

  }
  /**
   * Abstract method: implement it when you want to plug in straight after el.innerHTML populated
   */
  componentDidMount(): void {

  }
  /**
   * Abstract method: implement it when you want to control manually if the template requires re-sync
   */
  shouldComponentUpdate( nextScope: NgBackbone.DataMap<any> ): boolean {
    return true;
  }
  /**
   * Abstract method: implement it when you need preparation before an template sync occurs
   */
  componentWillUpdate( nextScope: NgBackbone.DataMap<any> ): void {
  }
  /**
   * Abstract method: implement it when you need operate on the DOM after template sync
   */
  componentDidUpdate( prevScope: NgBackbone.DataMap<any> ): void {
  }

  /**
   * Render first and then sync the template
   */
  render( source?: NgBackbone.Model | NgBackbone.Collection ): any {
    let ms =  performance.now(),
        focusEl: HTMLElement,
        scope: NgBackbone.DataMap<any> = {};
    // When template is not ready yet - e.g. loading via XHR
    if ( !this.template ) {
      return;
    }
    this.models && Object.assign( scope, ViewHelper.modelsToScope( this.models ) );
    this.collections && Object.assign( scope, ViewHelper.collectionsToScope( this.collections ) );

    try {
      if ( this.shouldComponentUpdate( scope ) ) {
        this.trigger( "component-will-update", scope );
        this.componentWillUpdate( scope );
        focusEl = this.el.querySelector( ":focus" ) as HTMLElement;
        this.errors = this.template.sync( scope ).report()[ "errors" ];
        focusEl && focusEl.focus();
        this.options.logger && this.errors.forEach(( msg: string ) => {
          this.trigger( "log:template", msg );
        });
        this.options.logger &&
          this.trigger( "log:sync", "synced template on in " + ( performance.now() - ms ) + " ms", scope, source );
        this.componentDidUpdate( scope );
        this.trigger( "component-did-update", scope );
      }
    } catch ( err ) {
      console.error( (<Error>err).message );
    }
    if ( !this.isRendered ) {
      this.onceOnRender();
    }
    this.isRendered = true;
    return this;
  }

  /**
   * Handler that called once after view first rendered
   */
  onceOnRender(){
    ViewHelper.initSubViews( this, this._component.views );
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
