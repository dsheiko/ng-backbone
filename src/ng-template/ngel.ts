import { AbstractDirective } from "./abstract-directive";
/**
 * <span data-ng-el="this.setAttribute('ss', 11)">Error</span>
 */
export class NgEl extends AbstractDirective implements NgTemplate.Directive {
  nodes: NgTemplate.DirectiveNode[];

  constructor( el: HTMLElement ){
    super();
    this.nodes =  this.initNodes( el, "ng-el", ( node: HTMLElement, expr: string, evaluate: Function ) => {
      return {
        el: node,
        exp: evaluate( expr )
      };
    });
  }

  sync( data: NgTemplate.DataMap ){
    this.nodes.forEach(( node: NgTemplate.DirectiveNode ) => {
      node.exp.call( node.el, data );
    });
  }
}
