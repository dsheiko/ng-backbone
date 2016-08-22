"use strict";
var Hero_1 = require("./View/Hero");
var HeroList_1 = require("./View/HeroList");
var Hero_2 = require("./Collection/Hero");
var heroes = new Hero_2.HeroCollection();
var logger = {
    "log:sync": function (msg) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        console.log("LOG(" + this.cid + "):", msg, args);
    }
};
new Hero_1.HeroView({ collections: { heroes: heroes }, logger: logger });
new HeroList_1.HeroListView({ collections: { heroes: heroes }, logger: logger });
//# sourceMappingURL=app.js.map