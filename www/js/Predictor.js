var Predictor = {
    
	runPrediction : function () {
        var predictionData = $('#predict-form').serializeForm();
        var myFlo = globalFlos[predictionData.predictItem];
        var myPrediction = Flos.getStatus(predictionData.predictDate,myFlo.startDate,myFlo.cycle,myFlo.long);
        Predictor.reportPrediction(predictionData,myFlo,myPrediction);
	},
    
    reportPrediction : function(predictionData,myFlo,myPrediction) {
        //var myTime = new Date(predictionData.predictDate).getTime();
        var newDateFormat = moment(predictionData.predictDate).format('MMMM Do, YYYY');
        var bIsFuture = makeSureFuture(predictionData.predictDate);
        
        if(!bIsFuture) {
            $("#prediction-text").html("Please choose a date in the future.");
        } else {
            $("#prediction-text").html(myFlo.name + " will be " + myPrediction.text + " on " + newDateFormat + ".");
        }
        
        $("#popupDialog").popup('open');
    },
    
    getNextDay : function() {
        var myDate = new Date();
        myDate.setDate(myDate.getDate() + 1);
        //return myDate;
        $("#predictDate").val(myDate.toJSON().slice(0,10));
        
    }
}

$("#predict-page").on('pagebeforeshow', function(evt) {
                      Predictor.getNextDay();
                      });

$("#predict-button").on('tap', function(evt){
                        Predictor.runPrediction();
                        });

$("#predict-form #predictDate").on('blur', function() {
                              var dateValue = this.value;
                              var bIsFuture = makeSureFuture(dateValue);
                              
                              if (!bIsFuture) {
                                  Predictor.getNextDay();
                              }
                              
                              document.body.scrollTop = document.documentElement.scrollTop = 0;
                              })