import { AbstractDirective } from "./abstract-directive";
/**
 * <span data-ng-switch="exp"></span>
 */
export class NgSwitch extends AbstractDirective implements NgTemplate.Directive {
  nodes: NgTemplate.DirectiveNode[];

  constructor( el: HTMLElement ){
    super();
    this.nodes =  this.initNodes( el, "ng-switch",
      ( node: HTMLElement, expr: string, evaluate: Function, cache: NgTemplate.Cache ) => {
      return {
        el: node,
        exp: evaluate( expr ),
        cache: cache
      };
    });
  }

  sync( data: NgTemplate.DataMap, Ctor: NgTemplate.NgTemplateCtor ){
    this.nodes.forEach(( node: NgTemplate.DirectiveNode ) => {
      let tpl = new Ctor( node.el, node.outerHTML );
      node.cache.evaluate( node.exp.call( node.el, data ), ( val: any ) => {
        data[ "$" ] = val;
        tpl.sync( data );
      });

    });
  }
}
