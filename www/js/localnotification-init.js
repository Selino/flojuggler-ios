var notify = {
    
    trigger :function(c){
        //var myObj = $('#edit-form').serializeForm();
        //var myFireDateSec = new Date(myObj.startDate).getTime();
        //var myFireDate = myFireDateSec + (myObj.cycle * 86400);
        //var myFireDate = Math.round(new Date().getTime()/1000 + 10)
        
        console.log(c);
        
//        window.addNotification({
//                               fireDate        : e.startDate,
//                               alertBody       : e.name + " is about to start her flo.",
//                               repeatInterval  : "",
//                               soundName       : "",
//                               badge           : 1,
//                               notificationId  : String(e.id),
//                               foreground      : function(){
//                                   alert("Hello World! This alert was triggered by notification ");
//                               },
//                               background	: function(){
//                                   alert("Hello World! This alert was triggered by notification ");
//                               }    		
//                               });
    },
    
    cancelOne : function(id) {
        window.cancelNotification(String(id));
    },
    
    cancelAll : function() {
        window.cancelAllNotifications();
    }
}

/*

 ON BOX CHECKED
 set the notification date to the current user's start date + cycle days.
 
 startDate = starDate to epoch time
 cycleDays = cycle days to seconds

 notificationDate = startDate + cycleDays
 
 set localNotification(notificationDate, reocurring(every cycleDays)
 
 ON BOX UNCHECKED
 clear all notifications with user ID
 
 plugins.localNotification.cancel('123');
 
 ISSUES
 Callbacks not working at all.
 Cannot specicy repeat interval in days or seconds.
 
 <fieldset data-role="controlgroup">
 <label for="alertStatus">Send alerts before flo</label>
 <input type="checkbox" name="alertStatus" id="alertStatus">
 </fieldset>
 
*/