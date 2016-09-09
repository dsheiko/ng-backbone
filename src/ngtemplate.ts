import { NgIf } from "./ng-template/ngif";
import { NgEl } from "./ng-template/ngel";
import { NgText } from "./ng-template/ngtext";
import { NgFor } from "./ng-template/ngfor";
import { NgSwitch } from "./ng-template/ngswitch";
import { NgSwitchCase } from "./ng-template/ngswitchcase";
import { NgSwitchCaseDefault } from "./ng-template/ngswitchcasedefault";
import { NgClass } from "./ng-template/ngclass";
import { NgProp } from "./ng-template/ngprop";
import { NgAttr } from "./ng-template/ngattr";
import { NgData } from "./ng-template/ngdata";
import { Exception } from "./ng-template/exception";
import { Reporter } from "./ng-template/reporter";

const REPEATING_DIR_LIMIT = 9; // 0-9

let DIRECTIVES = [ NgFor, NgSwitch, NgSwitchCase, NgSwitchCaseDefault, NgIf,
      NgClass, NgData, NgProp, NgAttr, NgEl, NgText ],
    counter = 0;

export class NgTemplate {
  private directives: NgTemplate.Directive[] = [];
  private reporter: Reporter;
  private isMounted: boolean = false;
  id: string;

  static factory( el: Element, template?: string, options?: NgTemplate.Options ): NgTemplate {
    return new NgTemplate( el, template || null, options );
  }

  /**
   * Initialize template for a given Element
   * If template passed, load it into the Element
   */

  constructor( public el: Element, public template?: string, public options: NgTemplate.Options = {}){
    if ( !this.el ) {
      throw new Exception( "(NgTemplate) Invalid first parameter: must be an existing DOM node" );
    }
    this.id = "id" + ( ++counter );
    this.reporter = new Reporter();
    this.template || this.init( DIRECTIVES );
  }

  private swapDirectives( el: HTMLElement, selector: string, inx: number ){
    let rSel = `data-${selector}-${inx}`,
        oSel = `data-${selector}`,
        exp =  el.getAttribute( rSel );
    el.setAttribute( oSel, exp );
    el.removeAttribute( rSel );
  }

  private assignRepeatingDirectives( Directive: NgTemplate.DirectiveCtor ): void {
    let inx = -1;
    if ( Directive.selector ) {
      while ( inx++ < REPEATING_DIR_LIMIT ) {
        let rSel = `[data-${Directive.selector}-${inx}]`,
            list = Array.from( this.el.querySelectorAll( rSel ) );
        if ( this.el.matches( rSel ) ) {
          list.push( this.el );
        }
        if ( !list ) {
          return;
        }
        list.forEach(( el: HTMLElement ) => {
          this.swapDirectives( el, Directive.selector, inx );
        });
        this.directives.push( new Directive( this.el as HTMLElement, this.reporter ) );
      }
    }
  }

  private init( directives: NgTemplate.DirectiveCtor[] ){
    directives.forEach(( Directive: NgTemplate.DirectiveCtor ) => {
      this.directives.push( new Directive( this.el as HTMLElement, this.reporter ) );
      this.assignRepeatingDirectives( Directive );
    });
  }

  report(): any {
    return this.reporter.get();
  }

  sync( data: NgTemplate.DataMap ): NgTemplate {
    // Late initialization: renders from a given template on first sync
    if ( this.template ) {
      typeof this.options.willMount === "function" && this.options.willMount();
      this.el.innerHTML = this.template;
      this.init( DIRECTIVES );
      this.template = null;
    }
    this.directives.forEach(( d ) => {
      d.sync( data, NgTemplate );
    });
    if ( !this.isMounted ) {
      typeof this.options.didMount === "function" && this.options.didMount();
      this.isMounted = true;
    }
    return this;
  }

  pipe( cb: Function, context: Object = this ): NgTemplate {
    cb.call( context, this.el, this.reporter );
    return this;
  }
}

// element.matches polyfill
// @link https://developer.mozilla.org/en/docs/Web/API/Element/matches
if ( !Element.prototype.matches ) {
  let eProto = <any>Element.prototype;
  Element.prototype.matches =
    eProto.matchesSelector ||
    eProto.mozMatchesSelector ||
    eProto.msMatchesSelector ||
    eProto.oMatchesSelector ||
    eProto.webkitMatchesSelector ||
    function( s: string ) {
      var matches = ( this.document || this.ownerDocument ).querySelectorAll( s ),
          i = matches.length;
      while ( --i >= 0 && matches.item( i ) !== this ) {}
      return i > -1;
    };
}
