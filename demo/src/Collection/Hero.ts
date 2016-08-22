import { Collection } from "../../../src/core";
import { HeroModel } from "../Model/Hero";

export class HeroCollection extends Collection {
  localStorage = new Backbone.LocalStorage( "heroes" );
  model = HeroModel;

  /**
   * Shortcut for sorting
   */
  orderBy( key: string ): Collection {
    this.comparator = key;
    this.sort();
    return this;
  }
}
