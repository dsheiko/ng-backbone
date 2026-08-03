import { AbstractArgsDirective } from "./abstract-args-directive";
/**
 * <i data-ng-prop="'disabled', isDisabled"></i>
 */
export class NgProp extends AbstractArgsDirective {
  static selector: string  = "ng-prop";

  constructor( el: HTMLElement, reporter: NgTemplate.Reporter ){
    super( el, reporter, "ng-prop" );
  }

  protected apply( el: HTMLElement, args: any[] ): void {
    let target = <NgTemplate.Element>el;
    target[ args[ 0 ] ] = args[ 1 ];
  }
}
