import { View } from "../view";
import { NgTemplate } from "../../ngtemplate";
import { mapFrom, mapAssign } from "../utils";

export class ViewHelper {

  /**
   * Converts { foo: Collection, bar: Collection } into
   * { foo: [{},{}], bar: [{},{}] }
   */
  static collectionsToScope(
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
  static modelsToScope( models: NgBackbone.ModelMap ): NgBackbone.ModelData {
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
   * Bind specified models to the template
   */
  static bindModels( view: View ){
      view.models.forEach(( model: Backbone.Model ): void => {
        view.stopListening( model );
        view.options.logger && view.trigger( "log:listen", "subscribes for `change`", model );
        view.listenTo( model, "change", view.render );
      });
  }
  /**
   * Bind specified collections to the template
   */
  static bindCollections( view: View ){
    view.collections.forEach(( collection: Backbone.Collection<Backbone.Model> ) => {
      view.stopListening( collection );
      view.options.logger && view.trigger( "log:listen", "subscribes for `change destroy sync`", collection );
      view.listenTo( collection, "change destroy sync", view.render );
    });
  }

  /**
   * Subscribe logger handlers from options
   */
  static subscribeLogger( view: View, logger: NgBackbone.LoggerOption ): void {
    Object.keys( logger ).forEach(( events: string ) => {
      view.listenTo( view, events, logger[ events ] );
    });
  }


  /**
   * collections/models passed in options, take them
   */
  static initializeOptions( view: View, options: NgBackbone.ViewOptions ) {
    let template = "_component" in view ? view._component.template : null;
    // shared template
    if ( "template" in options && view.options.template ) {
      template = view.options.template;
    }
    // process Component's payload
    view.template = new NgTemplate( view.el, template ),

    view.models = mapFrom({});
    view.collections = mapFrom({});

    if ( "_component" in view ) {
      view.models = view._component.models;
      view.collections = view._component.collections;
    }
    if ( "collections" in options ) {
      mapAssign( view.collections, options.collections );
    }
    if ( "models" in options ) {
      mapAssign( view.models, options.models );
    }

    // init views
    if ( !view.options.views.length ) {
      view.options.views = "_component" in view ? view._component.views : [];
    }

    if ( view.options.views.find(( mix: any ) => typeof mix === "undefined" )){
      throw new SyntaxError( "Invalid content of options.views" );
    }
  }

  /**
   * Hendler that called once after view first rendered
   */
  static onceOnRender( view: View ){
    ViewHelper.initSubViews( view, view.options.views );
  }

  /**
   * Initialize subview
   */
  static initSubViews( view: View, constructors: NgBackbone.Views ){
    view.views = constructors.map(( item: Function | NgBackbone.ViewConstructors ) => {
      let dto: NgBackbone.ViewConstructors;
      if ( typeof item === "function" ) {
        return ViewHelper.createSubView( view, <ViewConstructor>item );
      }
      dto = <NgBackbone.ViewConstructors>item;
      return ViewHelper.createSubView( view, <ViewConstructor>dto[ 0 ], <NgBackbone.ViewOptions>dto[ 1 ] );
    });
  }
  /**
   * Factory: create a subview
   */
  private static createSubView( view: View, ViewCtor: ViewConstructor, options: NgBackbone.ViewOptions = {}): View {
    let el = ViewHelper.findSubViewEl( view, ViewCtor.prototype[ "el" ] );
    return new ViewCtor( Object.assign( options, { el: el }) );
  }
  /**
   * Find inner el
   */
  private static findSubViewEl( view: View, selector: string ){
    if ( typeof selector !== "string" ) {
      throw new SyntaxError( "Invalid options.el type, must be a string" );
    }
    return view.el.querySelector( selector );
  }

}

interface ViewConstructor {
    new( options?: NgBackbone.ViewOptions ): View;
}