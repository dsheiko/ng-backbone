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
      view.options.logger && view.trigger( "log:listen", "subscribes for `change destroy sync sort`", collection );
      view.listenTo( collection, "change destroy sync sort", ( ...args: any[] ) => {
        // Slightly debounced for repeating calls like collection.sync/sort
        clearTimeout( view._debounceTimer );
        view._debounceTimer = <any>setTimeout(() => {
          view._debounceTimer = null;
          view.render.apply( view, args );
        }, 50 );
      });
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

  private static resetComponentDto( view: View )
  {
      view._component = {
        models: {},
        collections: {},
        views: mapFrom({}),
        template: null
      }
  }

  /**
   * collections/models passed in options, take them
   */
  static initializeOptions( view: View, options: NgBackbone.ViewOptions ) {
    // When @Component isn't defined
    if ( !( "_component" in view ) ) {
      ViewHelper.resetComponentDto( view );
    }

    let template = view._component.template;
    // shared template
    if ( "template" in options && view.options.template ) {
      template = view.options.template;
    }
    // process Component's payload
    view.template = new NgTemplate( view.el, template ),

    view.models = mapFrom( view._component.models );
    view.collections = mapFrom( view._component.collections );
    view.views = mapFrom({});


    if ( "collections" in options ) {
      mapAssign( view.collections, options.collections );
    }
    if ( "models" in options ) {
      mapAssign( view.models, options.models );
    }

    if ( "views" in options ) {
      mapAssign( view._component.views, options.views );
    }
  }

   /**
   * Initialize subview
   */
  static initSubViews( view: View, viewCtorMap: NgBackbone.ViewCtorMap ){
    viewCtorMap.forEach(( Ctor: any, key: string ) => {
      let dto: NgBackbone.ViewCtorOptions,
          instance: View;
      if ( typeof Ctor === "function" ) {
        instance = ViewHelper.createSubView( view, <ViewConstructor>Ctor );
      } else {
        dto = <NgBackbone.ViewCtorOptions>Ctor;
        instance = ViewHelper.createSubView( view, <ViewConstructor>dto[ 0 ], <NgBackbone.ViewOptions>dto[ 1 ] );
      }
      view.views.set( key, instance );
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
