import { AbstractArgsDirective } from "./abstract-args-directive";
/**
 * <i data-ng-class="'is-hidden', isHidden"></i>
 */
export class NgClass extends AbstractArgsDirective {
  static selector: string  = "ng-class";

  constructor( el: HTMLElement, reporter: NgTemplate.Reporter ){
    super( el, reporter, NgClass.selector );
  }

  protected apply( el: HTMLElement, args: any[] ): void {
    args[ 0 ] && el.classList.toggle( args[ 0 ], Boolean( args[ 1 ] ) );
  }
}
