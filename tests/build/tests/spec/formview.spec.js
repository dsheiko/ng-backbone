"use strict";
var core_1 = require("../../src/core");
var formstate_1 = require("../../src/core/formstate");
function FormViewSpec() {
    describe("FormView", function () {
        describe("#_findGroups", function () {
            it("finds forms within boundinx box", function () {
                var el = document.createElement("div"), view = new core_1.FormView({
                    el: el
                });
                el.innerHTML = "<div><form data-ng-group=\"foo\"></form><form data-ng-group=\"bar\"></form></div>";
                var forms = view._findGroups();
                expect(Array.isArray(forms)).toBe(true);
                expect(forms[0].dataset["ngGroup"]).toBe("foo");
                expect(forms[1].dataset["ngGroup"]).toBe("bar");
            });
            it("finds form on boundinx box", function () {
                var el = document.createElement("form"), view = new core_1.FormView({
                    el: el
                });
                el.innerHTML = "<div><form data-ng-group=\"foo\"></form><form data-ng-group=\"bar\"></form></div>";
                el.dataset["ngGroup"] = "baz";
                var forms = view._findGroups();
                // If boundinx box not inner forms allowed
                expect(forms.length).toBe(1);
                expect(forms[0].dataset["ngGroup"]).toBe("baz");
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
                expect(model instanceof formstate_1.FormState).toBe(true);
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
                expect(Array.isArray(els)).toBe(true);
                expect(els.length).toBe(4);
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
                expect(model instanceof formstate_1.FormState).toBe(true);
            });
        });
    });
}
exports.FormViewSpec = FormViewSpec;
