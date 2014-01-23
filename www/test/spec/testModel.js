describe("Hello model", function() {
         it("says hello model", function() {
            expect(Model.helloWorld()).toEqual("Hello model!");
            });
         });

describe("Open database", function() {
         it("returns success", function() {
            expect(Model.openDB()).toEqual("success");
            });
         });