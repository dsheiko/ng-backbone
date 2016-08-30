export declare namespace NgTemplate {

  interface Report extends DataMap {
    errors: string[];
    log: string[];
    tokens: DataMap[];
  }

  interface Reporter {
    get( key?: string ): NgTemplate.Report;
    addError( msg: string ): void;
    addLog( msg: string ): void;
    addTokens( tokens: NgTemplate.Token[] ): void;
    isParsed(): boolean;
  }

  interface Token {
    name: string;
    resolveValue( data: any ): any;
    toJSON(): NgTemplate.DataMap;
  }

  interface DataMap { [s: string]: any; }

  interface DirectiveNode {
    el: HTMLElement;
    anchor?: HTMLElement;
    parentNode?: HTMLElement;
    outerHTML?: string;
    cache?: Cache;
    exp: Function;
    id?: string;
  }

  interface SyncCallback {
    (el: HTMLElement): void;
  }

  class Directive {
    constructor( el:HTMLElement );
    nodes: DirectiveNode[];
    sync( data:DataMap, Ctor?: NgTemplateCtor ):void;
  }

  interface NgForExprVo {
    variable: string;
    iterable: string;
  }

  interface CacheCb {
    (exVal: any): void
  }

  class Cache {
    match( exVal:any ):boolean;
    evaluate( exVal:any, cb:CacheCb ):void;
  }

  interface Element {
    [ key: string ]: any;
  }

  interface NgTemplateCtor {
    new( el:Element, template?:string ): NgTemplate;
  }

  interface Options {
    willMount?: Function;
    didMount?: Function;
  }

  interface NgTemplate {
    report(): Report;
    sync( data:Object ):NgTemplate;
    pipe( cb:Function, context:Object ):NgTemplate;
  }


}