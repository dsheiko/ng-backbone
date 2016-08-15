const defineProperty = function( model:any, key:string ) {
    var d = Object.getOwnPropertyDescriptor( model, key );
    // If accesors are already set
    if ( d && ( "get" in d || "set" in d ) ) {
      return;
    }
    Object.defineProperty( model, key, {
        get: function () { return model.get( key ); },
        set: function ( value ) { return model.set( key, value ); }
    });
};

export const ObservableModel = Backbone.Model.extend({
  initialize() {
    let source = this.attributes || this.defaults;
    Object.keys( source ).forEach(( prop ) => {
      defineProperty( this, prop );
    });
  }
});
