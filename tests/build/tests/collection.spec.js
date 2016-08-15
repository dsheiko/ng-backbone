"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var core_1 = require("../src/core");
var expect = chai.expect;
var HeroNameModel = (function (_super) {
    __extends(HeroNameModel, _super);
    function HeroNameModel() {
        _super.apply(this, arguments);
    }
    HeroNameModel.prototype.parse = function (data) {
        return {
            item: data
        };
    };
    return HeroNameModel;
}(core_1.Model));
exports.HeroNameModel = HeroNameModel;
var FixtureCollection = (function (_super) {
    __extends(FixtureCollection, _super);
    function FixtureCollection() {
        _super.apply(this, arguments);
        this.url = "./fixture/names.json";
    }
    return FixtureCollection;
}(core_1.Collection));
exports.FixtureCollection = FixtureCollection;
function CollectionSpec() {
    describe("Collection", function () {
        describe("#fetch", function () {
            it("converts object literal for map ", function () {
                fetch = function () {
                    return Promise.resolve("ok");
                };
                //
                //        Backbone.ajax = function( options ): JQueryXHR {
                //          options.success( "ok" );
                //        };
                var col = new FixtureCollection();
                col.fetch().then(function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i - 0] = arguments[_i];
                    }
                    console.log("!!>>>", args);
                });
                //        expect( map ).to.be.instanceOf( Map );
                //        expect( map.get( "foo" ) ).to.eql( 1 );
            });
        });
    });
}
exports.CollectionSpec = CollectionSpec;
