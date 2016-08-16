"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var core_1 = require("../src/core");
window.fetch = function (url, init) {
    var json = { hello: "world" };
    //      blob = new Blob([ JSON.stringify( json, null, 2 ) ], { type : 'application/json' }),
    //      rsp = new Response( blob, { "status" : 200 });
    var rsp = Promise.resolve({
        json: function () {
            return json;
        }
    });
    console.log("rsp", rsp);
    return Promise.resolve(rsp);
};
var TestCollection = (function (_super) {
    __extends(TestCollection, _super);
    function TestCollection() {
        _super.apply(this, arguments);
        this.url = "./names.json";
    }
    return TestCollection;
}(core_1.Collection));
function UtilsSpec() {
    describe("Collection", function () {
        describe("#fetch", function () {
            it("returns Promise", function () {
                var p = new Promise(function (resolve) {
                    resolve("hohop");
                });
                p.then(function (vv) {
                    console.log("!!!", vv);
                });
                //        let col = new TestCollection();
                //        col.fetch().then(( a: any ) => {
                //          console.log( "A", a );
                //        });
                //        (<any>window).fetch("some")
                //          .then( ( rsp: any ) => {
                //            console.info("???!!!!!", rsp);
                //            return rsp.json();
                //          })
                //          .then(( json: any ) => {
                //            console.log( "json", json );
                //          });
                //expect( map.get( "foo" ) ).to.eql( 1 );
                expect(true).toBe(true);
            });
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UtilsSpec;
