import { AbstractDirective } from "./abstract-directive";
/**
 * <span data-ng-text="foo">...</span>
 */
export class NgText extends AbstractDirective implements NgTemplate.Directive {
  nodes: NgTemplate.DirectiveNode[];

  constructor( el: HTMLElement ){
    super();
    this.nodes =  this.initNodes( el, "ng-text",
      ( node: HTMLElement, expr: string, evaluate: Function, cache: NgTemplate.Cache ) => {
      return {
        el: node,
        exp: evaluate( expr, "String" ),
        cache: cache
      };
    });
  }

  sync( data: NgTemplate.DataMap ){
    this.nodes.forEach(( node: NgTemplate.DirectiveNode ) => {
      node.cache.evaluate( node.exp.call( node.el, data ), ( val: string ) => {
        this.setText( node.el, val );
      });
    });
  }
}
