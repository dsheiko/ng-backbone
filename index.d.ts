export * from "./src/ngtemplate";
export * from "./src/core";

class View extends Backbone.NativeView<Backbone.Model> {
  // bounding box
  el: HTMLElement;
  // models to bind to the template
  models: NgBackbone.ModelMap;
  // collections to bind to the template
  collections: NgBackbone.CollectionMap;
  // array of subviews
  views: NgBackbone.ViewMap;
  // instance of NgTemplate
  template: NgTemplate;
  // constructor options getting available across the prototype
  options: NgBackbone.ViewOptions = {};
  // template errors/warnings
  errors: string[] = [];
  // is this view ever rendered
  isRendered: boolean = false;
  // link to parent view
  parent: View;

  constructor( options: NgBackbone.ViewOptions = {} ): void ;
  /**
   * Abstract method: implement it when you want to plug in straight before el.innerHTML populated
   */
  componentWillMount(): void;
  /**
   * Abstract method: implement it when you want to plug in straight after el.innerHTML populated
   */
  componentDidMount(): void;
  /**
   * Abstract method: implement it when you want to control manually if the template requires re-sync
   */
  shouldComponentUpdate( nextScope: NgBackbone.DataMap<any> ): boolean;
  /**
   * Abstract method: implement it when you need preparation before an template sync occurs
   */
  componentWillUpdate( nextScope: NgBackbone.DataMap<any> ): void;
  /**
   * Abstract method: implement it when you need operate on the DOM after template sync
   */
  componentDidUpdate( prevScope: NgBackbone.DataMap<any> ): void;

  /**
   * Render first and then sync the template
   */
  render( source?: NgBackbone.Model | NgBackbone.Collection ): any;

  /**
   * Handler that called once after view first rendered
   */
  onceOnRender(): void;


  /**
  * Enhance listenTo to process maps
  * @example:
  * this.listenToMap( eventEmitter, {
  *     "cleanup-list": this.onCleanpList,
  *     "update-list": this.syncCollection
  *   });
  * @param {Backbone.Events} other
  * @param {NgBackbone.DataMap} event
  *
  * @returns {Backbone.NativeView}
  */
  listenToMap( eventEmitter: Backbone.Events, event: NgBackbone.DataMap<string> ): View;

  /**
   * Remove all the nested view on parent removal
   */
  remove(): void;

}


class FormView extends View {

  el: HTMLElement;
  models: NgBackbone.ModelMap;
  formValidators: { [key: string]: Function; };

  /**
   * Bind form and inputs
   */
  bindGroups(): void;

  /**
   * helpere to test states control/group on input
   */
  testInput( pointer: string, value: any ): Promise<any>;

  /**
   * Get form data of a specified form
   */
  getData( groupName: string ): NgBackbone.DataMap<string | boolean>;

  reset( groupName: string ): void;
}

function Component( options: NgBackbone.ComponentOptions ): Function;

class Collection extends Backbone.Collection<Backbone.Model> {
  constructor( models?: Backbone.Model[], options?: NgBackbone.DataMap<any>): void;
}

class Model extends Backbone.Model {
  constructor( attributes?: NgBackbone.DataMap<any>, options?: NgBackbone.DataMap<any>): void;
}