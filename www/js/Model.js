var Model = {
    helloWorld : function(){
        return ("Hello model!");
    },
    
	openDB : function () {
		if (window.openDatabase) {
			db = window.openDatabase("Flos","1.0","Local database", 1024*1000);
			db.transaction(function(tx) {
                           tx.executeSql("CREATE TABLE IF NOT EXISTS Flos (id INTEGER PRIMARY KEY, name TEXT, cycle INTEGER, long INTEGER, startDate DATE, thumbnail TEXT)", []);
                           });
            return "success";
		} else {
			console.log("No browser support for DB");
            return "failure";
		}
	},
	
	addFlo : function(e) {
		e = $.parseJSON(e);
		
		db.transaction(
                       function(tx) {
                       tx.executeSql("INSERT INTO Flos (name,cycle,long,startDate,thumbnail) VALUES (?,?,?,?,?)", [e.name,e.cycle,e.long,e.startDate,e.thumbnail], displayInsertResult);
                       },
                       
                       function(err) {
                       console.log("Error: " + err.message);
                       }
                       );
	},
	
	updateFlo : function(e) {
		e = $.parseJSON(e);
		
		db.transaction(
                       function(tx) {
                       tx.executeSql("UPDATE Flos SET name=?,cycle=?,long=?,startDate=?,thumbnail=? WHERE id = " + gCurrentFlo, [e.name,e.cycle,e.long,e.startDate,e.thumbnail]);
                       },
                       
                       function(err) {
                       console.log("Error: " + err.message);
                       }
                       );
		
	},
	
	deleteFlo : function(id) {
		db.transaction(
                       function(tx) {
                       tx.executeSql("DELETE FROM Flos WHERE id = ?", [id]);
                       },
                       
                       function(err) {
                       console.log("Error: " + err.message);
                       }
                       );
		
	},
	
	getFlos : function() {
		db.transaction(
                       function(tx) {
                       tx.executeSql("SELECT * FROM Flos", [], Flos.initFlos);
                       });
	},
    
    clearTable: function() {
        db.transaction(function (tx) {
                       tx.executeSql("DROP TABLE Flos");
                       });
    }
} //end model