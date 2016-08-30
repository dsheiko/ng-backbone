export declare namespace NgBackbone {

  interface ModelData {
    id?: string | number;
    [key: string]: any;
  }

  interface DataMap<V> {
    [key: string]: V;
  }


  interface AbstractState extends Backbone.Model {
    isCheckboxRadio( el: HTMLElement ): boolean;
    checkValidity(): void;
    validateRequired( el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement ): void;
    validateRange( el: HTMLInputElement ): void;
    patternMismatch( el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement ): void;
    validateTypeMismatch( el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement ): Promise<void>;
    onInputChange( el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement ): void;
    setState( el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement ): Promise<void>;
    onInputFocus(): void;
  }
  interface GroupState extends AbstractState {
  }
  interface ControlState extends AbstractState {
  }

  interface GroupStateValidationMsg {
    control: string;
    message: string;
  }
  interface GroupStateAttrs {
    valid:  boolean;
    dirty:  boolean;
    validationMessage: string;
    validationMessages: GroupStateValidationMsg[];
  }
  interface ControlStateAttrs {
    valid:  boolean;
    dirty:  boolean;
    touched: boolean;
    validationMessage: string;
    valueMissing: boolean;
    rangeOverflow: boolean;
    rangeUnderflow: boolean;
    typeMismatch: boolean;
    patternMismatch: boolean;
  }

  interface Model extends Backbone.Model {

  }
  interface Collection extends Backbone.Collection<Backbone.Model> {
    orderBy( key: string ): Collection;
  }

  interface ModelMap extends  Map<string, Backbone.Model> {
  }

  interface CollectionMap extends Map<string, Collection> {
  }

  interface Models {
    [key: string]: any;
  }
  interface Collections {
    [key: string]: Backbone.Collection<Backbone.Model>;
  }

  interface View extends Backbone.NativeView<Backbone.Model> {
    models: ModelMap;
    collections: CollectionMap;
    views: ViewMap;
    parent?: View;
  }

  interface ViewCtorOptions {
    [index: number]: Function | ViewOptions;
  }

  interface Views {
    [index: number]: Function | ViewCtorOptions;
  }

  interface ViewCtorMap extends Map<string, Function | ViewCtorOptions> {
  }

  interface ViewMap extends Map<string, View> {
  }


  interface LoggerHandler {
     ( msg: string, ...args: any[] ): void
  }

  interface LoggerOption extends DataMap<any> {
  }

  interface ViewOptions extends Backbone.ViewOptions<Backbone.Model>{
    [key: string]: any;
    models?: Models;
    collections?: Collections;
    views?: Views;
    formValidators?: { [key: string]: Function; };
    logger?: LoggerOption;
    template?: string;
    parent?: View;
  }

  interface ComponentDto {
    models: Models;
    collections: Collections;
    template: string;
    views?: ViewCtorMap;
  }

  interface ComponentOptions {
    template: string;
    models?: Models;
    collections?: Collections;
    views?: Views;
    el?: any;
    events?: Backbone.EventsHash;
    id?: string;
    className?: string;
    tagName?: string;
    formValidators?: { [key: string]: Function; };
  }
}

