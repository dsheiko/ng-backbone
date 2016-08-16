let fetchOrigin = ( <any>window ).fetch;

export class utils {

  static mockFetch( json: NgBackbone.DataMap<any> ){
    ( <any>window ).fetch = function( url: string|Request, init?: RequestInit ): Promise<any> {
      let blob = new Blob([ JSON.stringify( json, null, 2 ) ], { type : 'application/json' }),
          rsp = new Response( blob, { "status" : 200 });
      return Promise.resolve( rsp );
    }
  }

  static restoreFetch(){
    ( <any>window ).fetch = fetchOrigin;
  }
}
