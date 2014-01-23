describe("Hello flos", function() {
         it("says hello flos", function() {
            expect(Flos.helloWorld()).toEqual("Hello flos!");
            });
         });

describe("Checks if global gCurrentFlo and currentTime exist", function() {
         it("gCurrentFlo = 0 & currentTime exist", function() {
            gCurrentFlo = 0;
            expect(gCurrentFlo).toEqual(0);
            
            var myTime = new Date().getTime();
            expect(currentTime).toBeDefined();
            });
         });

describe("Detect Flo", function() {
         it("returns 0", function() {
            var time = 1388135645554;
            var startDate = "2013-12-27";
            var cycle = 30;
            expect(Flos.detectFlo(time,startDate,cycle)).toEqual(0);
            });
         });

describe("Get Flo status red", function() {
         it("returns red flo object", function() {
            var time = 1388135645554;
            var startDate = "2013-12-27";
            var cycle = 30;
            var long = 7;
            expect(Flos.getStatus(time,startDate,cycle,long)).toEqual({ code : 'status-red', text : 'on her flo for 7 more days' });
            });
         });

describe("Get Flo status green", function() {
         it("returns green flo object", function() {
            var time = 1388135645554;
            var startDate = "2013-12-20";
            var cycle = 30;
            var long = 7;
            expect(Flos.getStatus(time,startDate,cycle,long)).toEqual({ code : 'status-green', text : '23 days from her next flo' });
            });
         });

describe("Get Flo status yellow", function() {
         it("returns yellow flo object", function() {
            var time = 1388135645554;
            var startDate = "2013-10-30";
            var cycle = 30;
            var long = 7;
            expect(Flos.getStatus(time,startDate,cycle,long)).toEqual({ code : 'status-yellow', text : '2 more days to her flo' } );
            });
         });

describe("Init flos", function() {
         it("returns globalFlo object of {id : 1, name : 'Unnamed', cycle : 30, long : 7, startDate : '2013-12-27', thumbnail : 'images/thumbnail.svg', alertStatus : null}", function() {
            var tx = '';
            var rs = makeTempFlos();
            expect( Flos.initFlos(tx,rs,1) ).toEqual([{id : 1, name : 'Unnamed', cycle : 30, long : 7, startDate : '2013-12-27', thumbnail : 'images/thumbnail.svg', alertStatus : null}]);
            });
         });

function makeTempFlos() {
    var qmlrs = [];
    qmlrs.push({id:1,name:"Unnamed",cycle:30,long:7,startDate:"2013-12-27",thumbnail:"images/thumbnail.svg",alertStatus:null});
    
    var rs = {
        insertId: 0,
        rowsAffected: 0,
        rows: {
            length: qmlrs.length,
            item: function(index) {
                return qmlrs[index];
            }
        }
    }
    return rs;
}