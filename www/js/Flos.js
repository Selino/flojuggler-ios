gCurrentFlo = 'reset';
currentTime = new Date().getTime();

var Flos = {
    
    helloWorld : function(){
        return ("Hello flos!");
    },

    deleteFlo : function(id) {
        Model.deleteFlo(id);
    },

    initFlos : function(tx,rs,test) {
         gCurrentFlo = 'reset';
        globalFlos = [];
        if (rs.rows.length >= 1) {
            for(i=0; i < rs.rows.length; i++) {
                var row = rs.rows.item(i);
                globalFlos.push(row);
            }
        }
        
        if (!test) {
            displayResultSet();
        }
        return globalFlos;
    },

    detectFlo : function(time,startDate,cycle){
        var myTime = new Date(time).getTime();
        var myDate = new Date(startDate).getTime();
        var status = ( secToDays(myTime) - secToDays(myDate) ) % (cycle);
        return status;
    },

    getStatus : function(time,startDate,cycle,long) {
        var flo = Flos.detectFlo(time,startDate,cycle);
        var sDayDisplay = " days";
        var floStatus = {};
        
        if (flo < long) {
            var days = long - flo;
            days <= 1 ? sDayDisplay = " day" : sDayDisplay = " days";
            floStatus.code = 'status-red';
            floStatus.text = 'on her flo for ' + days + ' more' + sDayDisplay;
        } else {
            days = cycle - flo;
            days <= 1 ? sDayDisplay = " day" : sDayDisplay = " days";
            if (days <= 3) {
                floStatus.code = "status-yellow";
                floStatus.text = days + ' more' + sDayDisplay + ' to her flo';
            } else {
                floStatus.code = "status-green";
                floStatus.text = days + sDayDisplay + ' from her next flo';
            }
            
        }
        return floStatus;
    }
}
