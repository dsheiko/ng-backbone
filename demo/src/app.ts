import { HeroView } from "./View/Hero";
import { HeroListView } from "./View/HeroList";
import { HeroCollection } from "./Collection/Hero";

let heroes = new HeroCollection();

let logger = {
  "log:sync log:template": function( msg: string, ...args: any[] ): void {
      console.log( `LOG(${this.cid}):`, msg, args );
   }
};

new HeroView({ collections: { heroes: heroes }, logger: logger });
new HeroListView({ collections: { heroes: heroes }, logger: logger });
