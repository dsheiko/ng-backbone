import { HeroView } from "./View/Hero";
import { HeroListView } from "./View/HeroList";
import { HeroCollection } from "./Collection/Hero";

let heroes = new HeroCollection();

let logger = function( msg: string, ...args: any[] ){
  msg.startsWith( "synced" ) && console.log( `LOG(${this.cid}):`, msg, args );
};

new HeroView({ collections: { heroes: heroes }, logger: logger });
new HeroListView({ collections: { heroes: heroes }, logger: logger });
