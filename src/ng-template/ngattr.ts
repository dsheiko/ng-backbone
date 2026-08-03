import { AbstractArgsDirective } from "./abstract-args-directive";
/**
 * <i data-ng-attr="'checked', true"></i>
 */
export class NgAttr extends AbstractArgsDirective {
  static selector: string  = "ng-attr";

  constructor( el: HTMLElement, reporter: NgTemplate.Reporter ){
    super( el, reporter, "ng-attr" );
  }

  protected apply( el: HTMLElement, args: any[] ): void {
    if ( !args[ 1 ] ) {
      el.removeAttribute( args[ 0 ] );
      return;
    }
    el.setAttribute( args[ 0 ], args[ 1 ] );
  }
}
