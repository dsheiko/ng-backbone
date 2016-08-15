declare namespace NgTemplate {

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

  interface NgTemplate {
    sync( data:Object ):NgTemplate;
    pipe( cb:Function, context:Object ):NgTemplate;
  }


}