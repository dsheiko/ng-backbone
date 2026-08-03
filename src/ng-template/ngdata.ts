import { AbstractArgsDirective } from "./abstract-args-directive";
/**
 * <i data-ng-data="'someKey', value"></i>
 */
export class NgData extends AbstractArgsDirective {
  static selector: string  = "ng-data";

  constructor( el: HTMLElement, reporter: NgTemplate.Reporter ){
    super( el, reporter, "ng-data" );
  }

  protected apply( el: HTMLElement, args: any[] ): void {
    el.dataset[ args[ 0 ] ] = args[ 1 ];
  }
}
