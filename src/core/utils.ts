/**
 * Debounce a callback bound to a given context, tracking the pending timer on contextKey
 */
export function debounce( context: any, contextKey: string, wait: number, callback: Function, args: any[] ): void {
  clearTimeout( context[ contextKey ] );
  context[ contextKey ] = <any>setTimeout(() => {
    context[ contextKey ] = null;
    callback.apply( context, args );
  }, wait );
}

/**
 * Decorator to debounce
 */
export function Debounce( wait: number ): Function {
  return function( target: Object | Function, propKey: string, descriptor: PropertyDescriptor ): PropertyDescriptor {
    const callback = descriptor.value;
    return <PropertyDescriptor>Object.assign({}, descriptor, {
      value: function(): Promise<any> {
        const args = Array.from( arguments ),
              onFire = ( ...cbArgs: any[] ) => callback.apply( this, cbArgs );
        return new Promise(( resolve ) => {
          debounce( this, "_debounceTimer", wait, ( ...cbArgs: any[] ) => resolve( onFire( ...cbArgs ) ), args );
        });
      }
    });
  };
}

/**
 * Decorator to mixin
 */
export function Mixin( mixin: NgBackbone.DataMap<any> ): Function {
  return function( target: Function ){
    Object.assign( target.prototype, mixin );
  };
}


export function mapFrom( mixin: NgBackbone.DataMap<any> ): Map<string, any> {
  let map = <Map<string, any>>new Map();
  mapAssign( map, mixin );
  return map;
}

export function mapAssign( map: Map<any, any>, mixin: NgBackbone.DataMap<any> = {}) {
  Object.keys( mixin ).forEach(( key ) => {
    map.set( key, mixin[ key ] );
  });
}
