import { AbstractDirective } from "./abstract-directive";
/**
 * <span data-ng-switch="exp"></span>
 */
export class NgSwitchCase extends AbstractDirective implements NgTemplate.Directive {
  nodes: NgTemplate.DirectiveNode[];

  constructor( public el: HTMLElement ){
    super();
    this.nodes =  this.initNodes( el, "ng-switch-case", ( node: HTMLElement, expr: string, evaluate: Function ) => {
      return {
        el: node,
        outerHTML: node.outerHTML,
        exp: evaluate( expr )
      };
    });
  }

  sync( data: NgTemplate.DataMap ){
    if ( !this.nodes.length ) {
      return;
    }
    let match = this.nodes.find(( node: NgTemplate.DirectiveNode ) => {
      return data[ "$" ] === node.exp.call( node.el, data );
    });
    this.el.innerHTML = match ? match.outerHTML : "";
  }

}
