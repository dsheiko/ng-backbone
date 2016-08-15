"use strict";
var core_1 = require("../src/core");
var formstate_1 = require("../src/core/formstate");
var expect = chai.expect;
function FormViewSpec() {
    describe("FormView", function () {
        describe("#_findGroups", function () {
            it("finds forms within boundinx box", function () {
                var el = document.createElement("div"), view = new core_1.FormView({
                    el: el
                });
                el.innerHTML = "<div><form data-ng-group=\"foo\"></form><form data-ng-group=\"bar\"></form></div>";
                var forms = view._findGroups();
                expect(Array.isArray(forms)).to.be.ok;
                expect(forms[0].dataset["ngGroup"]).to.eql("foo");
                expect(forms[1].dataset["ngGroup"]).to.eql("bar");
            });
            it("finds form on boundinx box", function () {
                var el = document.createElement("form"), view = new core_1.FormView({
                    el: el
                });
                el.innerHTML = "<div><form data-ng-group=\"foo\"></form><form data-ng-group=\"bar\"></form></div>";
                el.dataset["ngGroup"] = "baz";
                var forms = view._findGroups();
                // If boundinx box not inner forms allowed
                expect(forms.length).to.eql(1);
                expect(forms[0].dataset["ngGroup"]).to.eql("baz");
            });
        });
        describe("#_bindGroup", function () {
            it("sets a model to  this.models.FormName.form", function () {
                var el = document.createElement("form"), view = new core_1.FormView({
                    el: el
                });
                el.dataset["ngGroup"] = "baz";
                view._bindGroup(el, "baz");
                var model = view.models.get("baz.form");
                expect(model).to.be.an.instanceof(formstate_1.FormState);
            });
        });
        describe("#_findGroupElements", function () {
            it("finds all form inputs", function () {
                var el = document.createElement("form"), next, view = new core_1.FormView({
                    el: el
                });
                el.dataset["ngGroup"] = "baz";
                el.innerHTML = "<div>\n<input name=\"inputText\" />\n<input name=\"inputCheckbox\" type=\"checkbox\" />\n<input name=\"inputEmail\" type=\"email\" />\n<select name=\"select\"></select>\n<custom name=\"quiz\"></custom>\n</div>";
                var els = view._findGroupElements(el);
                expect(Array.isArray(els)).to.be.ok;
                expect(els.length).to.eql(4);
            });
        });
        describe("#_bindGroupElement", function () {
            it("finds all form elements", function () {
                var el = document.createElement("form"), next, view = new core_1.FormView({
                    el: el
                });
                el.dataset["ngGroup"] = "baz";
                view._bindGroup(el, "foo");
                view._bindGroupElement("foo", "bar");
                var model = view.models.get("foo.bar");
                expect(model).to.be.an.instanceof(formstate_1.FormState);
            });
        });
    });
}
exports.FormViewSpec = FormViewSpec;
