"use strict";
var Hero_1 = require("./View/Hero");
var HeroList_1 = require("./View/HeroList");
var Hero_2 = require("./Collection/Hero");
var heroes = new Hero_2.HeroCollection();
var logger = {};
new Hero_1.HeroView({ collections: { heroes: heroes }, logger: logger });
new HeroList_1.HeroListView({ collections: { heroes: heroes }, logger: logger });
//# sourceMappingURL=app.js.map