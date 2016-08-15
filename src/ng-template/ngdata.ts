import { AbstractDirective } from "./abstract-directive";
/**
 * <i data-ng-data="'someKey', value"></i>
 */
export class NgData extends AbstractDirective implements NgTemplate.Directive {
  nodes: NgTemplate.DirectiveNode[];

  constructor( el: HTMLElement ){
    super();
    this.nodes =  this.initNodes( el, "ng-data",
      ( node: HTMLElement, expr: string, evaluate: Function, cache: NgTemplate.Cache ) => {
      return {
        el: node,
        exp: evaluate( expr, "__toArray" ),
        cache: cache
      };
    });
  }

  sync( data: NgTemplate.DataMap ){
    this.nodes.forEach(( node: NgTemplate.DirectiveNode ) => {
      node.cache.evaluate( node.exp.call( node.el, data ), ( args: any[] ) => {
        let el = <HTMLElement>node.el;
        el.dataset[ args[ 0 ] ] = args[ 1 ];
      });
    });
  }
}

