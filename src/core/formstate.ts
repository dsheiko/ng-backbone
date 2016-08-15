import { Model } from "./model";
import { Exception } from "./exception";
import { FormValidators } from "./formvalidators";
import { Debounce } from "./utils";

const ERR_TYPES = [
        "valueMissing", "rangeOverflow", "rangeUnderflow",
        "typeMismatch", "patternMismatch" ],

      SILENT = { silent: true };

export class FormState extends Model {

  private formValidators: FormValidators;

  defaults() {
    return {
      "value":    "",
      "valid":    true,  // Control's value is valid
      "touched":  false, // Control has been visited
      "dirty":    false, // Control's value has changed

      "valueMissing": false, // indicating the element has a required attribute, but no value.
      "rangeOverflow": false, // indicating the value is greater than the maximum specified by the max attribute.
      "rangeUnderflow": false, // indicating the value is less than the minimum specified by the min attribute.
      "typeMismatch": false, // indicating the value is not in the required syntax
      "patternMismatch": false, // indicating the value does not match the specified pattern
      "validationMessage": ""
    };
  }

  initialize( options: any ){
    this.formValidators = new FormValidators();
    // Inject custom formValidators
    if ( options && "formValidators" in options ) {
      this._assignFormValidators( options.formValidators );
    }
  }

  /**
   *
   */
  private _assignFormValidators( formValidators: any ): void {
      if ( typeof formValidators !== "function" ) {
        Object.assign( this.formValidators, formValidators );
        return;
      }
      this.formValidators = new formValidators();
      if ( !( this.formValidators instanceof FormValidators ) ) {
        throw new Exception( "Specified option formValidators has invalid type" );
      }
  }

  /**
   * Check if a given input is a checkbox or radio
   */
  isCheckboxRadio( el: HTMLElement ) {
    return el instanceof HTMLInputElement && [ "checkbox", "radio" ].indexOf( el.type ) !== -1;
  }

  /**
   * Update `valid` and `validationMessage` according to the current model state
   */
  checkValidity(){
    let invalid = ERR_TYPES.some(( key: string ) => {
      return this.attributes[ key ];
    });
    this.set( "valid", !invalid );
    if ( !invalid ) {
      this.set( "validationMessage", "", SILENT );
    }
  }

  /**
   * Validate <input required/> doesn't have an empty value
   */
  validateRequired( el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement ){
    if ( !el.hasAttribute( "required" ) ) {
      return;
    }
    let value: string = String( el.value ),
        valid = value.trim().length;


    this.set( "valueMissing", !valid, SILENT );
    valid || this.set( "validationMessage", "This field is mandatory", SILENT );
  }

  /**
   * Validate <input min max /> value in the given range
   */
  validateRange( el: HTMLInputElement ){
    if ( !( el instanceof HTMLInputElement ) ) {
      throw TypeError( "el must be instance of HTMLInputElement" );
    }
    if ( el.hasAttribute( "max" ) ) {
      let valid = Number( el.value ) < Number( el.getAttribute( "max" ) );
      this.set( "rangeOverflow", !valid, SILENT );
      valid || this.set( "validationMessage", "The value is too high", SILENT );
    }
    if ( el.hasAttribute( "min" ) ) {
      let valid = Number( el.value ) > Number( el.getAttribute( "min" ) );
      this.set( "rangeUnderflow",  !valid, SILENT );
      valid || this.set( "validationMessage", "The value is too low", SILENT );
    }
  }

  /**
   * Validate by `pattern`
   */
  patternMismatch( el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement ) {
    if ( !el.hasAttribute( "pattern" ) ) {
      return;
    }
    try {
      let pattern = new RegExp( el.getAttribute( "pattern" ) );
      this.set( "patternMismatch", !pattern.test( el.value ), SILENT );
      this.set( "validationMessage", "The value does not match the pattern", SILENT );
    } catch ( err ) {
      throw new Exception( "Invalid pattern " + el.getAttribute( "pattern" ) );
    }
  }

  validateTypeMismatch( el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement ): Promise<void> {
    let value = el.value,
        itype = el.getAttribute( "type" );
    if ( !( itype in this.formValidators ) ) {
      return Promise.resolve();
    }
    return this.formValidators[ itype ]( value )
      .catch (( err: string|Error ) => {
        if (  err instanceof Error ) {
          throw new Exception( err.message );
        }
        this.set( "typeMismatch", true, SILENT );
        this.set( "validationMessage", err, SILENT );
      });
  }

  @Debounce( 100 )
  /**
   * Handle change/input events on the input
   */
  onInputChange( el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement ){

    this.set( "dirty", true, SILENT );
    if ( !this.isCheckboxRadio( el ) ) {
      this.set( "value", el.value, SILENT );
      this.validateRequired( el );
      if ( el instanceof HTMLInputElement ) {
        this.validateRange( el );
      }
      this.patternMismatch( el );
      this.validateTypeMismatch( el )
        .then(() => {
          this.checkValidity();
        });
    } else {
      this.set( "value", ( <HTMLInputElement>el ).checked, SILENT );
      this.checkValidity();
    }
  }

  /**
   * Handle focus event on the input
   */
  onInputFocus(){
    this.set( "touched", true );
  }
}


export class GroupState extends FormState {

}
export class ControlState extends FormState {

}
