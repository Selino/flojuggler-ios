var Predictor = {
    
	runPrediction : function () {
        var predictionData = $('#predict-form').serializeForm();
        var myFlo = globalFlos[predictionData.predictItem];
        var myPrediction = Flos.getStatus(predictionData.predictDate,myFlo.startDate,myFlo.cycle,myFlo.long);
        Predictor.reportPrediction(predictionData,myFlo,myPrediction);
	},
    
    reportPrediction : function(predictionData,myFlo,myPrediction) {
        var myTime = new Date(predictionData.predictDate).getTime();
        
        if(myTime <= currentTime) {
            $('#prediction-text').html("Please choose a date in the future.");
        } else {
            $('#prediction-text').html(myFlo.name + " will be " + myPrediction.text + " on " + humanDate(predictionData.predictDate) + ".");
        }
        
        $('#popupDialog').popup('open');
    }
}

$("#predict-page").on('pagebeforeshow', function(evt) {
                      var myDate = new Date();
                      myDate.setDate(myDate.getDate() + 1);
                      $('#predictDate').val(myDate.toJSON().slice(0,10));
                      });

$("#predict-button").on('tap', function(evt){
                        Predictor.runPrediction();
                        });