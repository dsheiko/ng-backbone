let fetchOrigin = ( <any>window ).fetch;

export class MockFetch {
  url: string | Request;
  init: RequestInit;
  constructor( stored?: NgBackbone.DataMap<any>, err?: Error ){
    let that = this;
    ( <any>window ).fetch = function( url: string | Request, init?: RequestInit ): Promise<any> {
      if ( err ) {
        throw err;
      }
      let jsonStr = stored ? JSON.stringify( stored, null, 2 ) : init.body;
      let blob = new Blob([ jsonStr ], { type : 'application/json' }),
          rsp = new Response( blob, { "status" : 200 });
      that.url = url;
      that.init = init;
      return Promise.resolve( rsp );
    }
  }
  restore(){
    ( <any>window ).fetch = fetchOrigin;
  }
}