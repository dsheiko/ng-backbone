import { AbstractDirective } from "./abstract-directive";

/**
 * Shared base for directives that compile their expression via `__toArray`
 * and evaluate a cached [key, value]-shaped args tuple on sync
 * (ngattr, ngclass, ngdata, ngprop)
 */
export abstract class AbstractArgsDirective extends AbstractDirective implements NgTemplate.Directive {
  nodes: NgTemplate.DirectiveNode[];

  constructor( el: HTMLElement, reporter: NgTemplate.Reporter, identifier: string ){
    super( el, reporter );
    this.nodes =  this.initNodes( el, identifier,
      ( node: HTMLElement, expr: string, compile: Function, cache: NgTemplate.Cache ) => {
      return {
        el: node,
        exp: compile( expr, "__toArray", reporter ),
        cache: cache
      };
    });
  }

  sync( data: NgTemplate.DataMap ){
    this.nodes.forEach(( node: NgTemplate.DirectiveNode ) => {
      node.cache.evaluate( node.exp.call( node.el, data ), ( args: any[] ) => {
        this.apply( node.el, args );
      });
    });
  }

  protected abstract apply( el: HTMLElement, args: any[] ): void;
}
