import { Exception } from "./exception";
import { View } from "./view";
import { FormState, GroupState, ControlState } from "./formstate";
import { mapFrom } from "./utils";

class ControlUpdateStates {
  valid: boolean[] = [];
  dirty: boolean[] = [];
}

export class FormView extends View {

  el: HTMLElement;
  models: NgBackbone.ModelMap;
  formValidators: { [key: string]: Function; };
  private _groupBound: boolean = false;

  render( ...args: any[] ){
    View.prototype.render.apply( this, args );
    this._groupBound || this.bindGroups();
    return this;
  }
  /**
   * Bind form and inputs
   */
  bindGroups(): void {
    this._groupBound = true;
    this._findGroups().forEach(( groupEl ) => {
      let groupName: string =  groupEl.dataset[ "ngGroup" ];

       this._bindGroup( groupEl, groupName );

       // this form is already bound
       if ( !groupName ){
         return;
       }
       this._findGroupElements( groupEl )
         .forEach(( inputEl: HTMLInputElement ) => {
          this._bindGroupElement( groupName, inputEl.name );
          this._subscribeGroupElement( groupName, inputEl );
        });

        // set initial state (.eg. requried contols - are invalid already)
        this._updateGroupValidatity( groupName );
        this.render();
    });
  }

  /**
   * Return array of form elements (either with all the forms found in the view
   * or with only form which is this.el)
   */
  private _findGroups(): HTMLElement[] {
    if ( this.el.dataset[ "ngGroup" ] ) {
      return [ <HTMLElement> this.el ];
    }
    return <HTMLElement[]> Array.from( this.el.querySelectorAll( "[data-ng-group]" ) );
  }

  /**
   * Bind a given form to State model ( myform.group = state model )
   */
  private _bindGroup( el: HTMLElement, groupName: string ): void {
    if ( this.models.has( groupName ) ) {
      return;
    }
    // make sure form is not self-validated
    el.setAttribute( "novalidate", "true" );
    let model = <GroupState> new GroupState({ formValidators:  this.formValidators });
    this.models.set(  FormView.getKey( groupName, "group" ),  model );
    this.stopListening( model );
    this.options.logger && this.trigger( "log:listen", "subscribes for `change`", model );
    this.listenTo( model, "change", this.render );
  }

  private static getKey( groupName: string, controlName: string ): string {
    return `${groupName}.${controlName}`;
  }
  /**
   * Bind a given input to State model ( myform.myInput = state model )
   */
  private _bindGroupElement( groupName: string, controlName: string ): void {
    let key = FormView.getKey( groupName, controlName );
    if ( this.models.has( key ) ) {
      return;
    }
    let model = <ControlState> new ControlState({ formValidators:  this.formValidators });
    this.models.set( key, model );
    this.stopListening( model );
    this.options.logger && this.trigger( "log:listen", "subscribes for `change`", model );
    this.listenTo( model, "change", () => {
      this._onFromControlModelChange( groupName );
    });

  }
  /**
   * Find all the inputs in the given form
   */
  private _findGroupElements( groupEl: HTMLElement ): Element[] {
    return Array.from( groupEl.querySelectorAll( "[name]" ) )
      .filter(( el: Element ) => {
        return el instanceof HTMLInputElement
        || el instanceof HTMLSelectElement
        || el instanceof HTMLTextAreaElement;
      });
  }

  /**
   * Subscribe handlers for input events
   */
  private _subscribeGroupElement( groupName: string, inputEl: HTMLInputElement ) {
     let controlName = inputEl.name,
         inputModel: ControlState,
         key = FormView.getKey( groupName, controlName ),
         // find input elements within this.el
         sel = "[name=\"" + controlName + "\"]";

     if ( !this.el.dataset[ "ngGroup" ] ) {
      // find input elements per form
      sel = `[data-ng-group="${groupName}"] ${sel}`;
     }

     inputModel = <ControlState> this.models.get( key );

     let onChange = () => {
       inputModel.onInputChange( inputEl );
     };

     this.delegate( "change", sel, onChange );
     this.delegate( "input", sel, onChange );
     this.delegate( "focus", sel, () => {
       inputModel.onInputFocus();
     });

  }

  private _onFromControlModelChange( groupName: string ){
    this._updateGroupValidatity( groupName );
    this.render();
  }

  private _updateGroupValidatity( groupName: string ){
    let groupModel = this.models.get( FormView.getKey( groupName, "group" ) ),
        states = new ControlUpdateStates(),
        curValid: boolean,
        curDirty: boolean;

    FormView.filterModels( this.models, groupName )
        .forEach(( model: ControlState ) => {
        states.valid.push( model.get( "valid" ) );
        states.dirty.push( model.get( "dirty" ) );
     });

    curValid = !states.valid.some( toogle => toogle === false );
    curDirty = states.dirty.every( toogle => toogle );
    groupModel.set( "valid", curValid );
    groupModel.set( "dirty", curDirty );
    // console.info( `group ${groupName}: valid: ${curValid}, dirty: ${curDirty}` );
  }

  private static filterModels( models: NgBackbone.ModelMap, groupName: string ): NgBackbone.ModelMap {
    let filtered: NgBackbone.ModelMap = mapFrom({});
    models.forEach(( model: GroupState, key: string ) => {
      if ( key !==  `${groupName}.group` && key.startsWith( `${groupName}.` ) ) {
        filtered.set( key, model );
      }
    });
    return filtered;
  }

  /**
   * Get form data of a specified form
   */
  getData( groupName: string ): NgBackbone.DataMap<string | boolean>{
    let data: NgBackbone.DataMap<string | boolean> = {};

    FormView.filterModels( this.models, groupName )
      .forEach(( model: FormState, key: string ) => {
        let tmp: string, controlName: string;
        [ tmp, controlName ] = key.split( "." );
        if ( controlName === "group" ){
          return;
        }
        data[ controlName ] = model.get( "value" );
      });
    return data;
  }


}
