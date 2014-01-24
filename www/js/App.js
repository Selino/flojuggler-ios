$("#list-page").on('pagebeforeshow', function(evt) {
                   makeList();
                   });

$("#edit-page").on('pageinit', function (evt) {
                   checkNameDateFields();
                   }).on('pagebeforehide', function(evt) {
                         updateEditPage();
                         makeList();
                         });;

$("#delete-button").on('click', function() {
                       Flos.deleteFlo(gCurrentFlo);
                       $.mobile.changePage( '#list-page');
                       });

$(".thumbnail-button").on('click', function() {
                          getPhoto(pictureSource.PHOTOLIBRARY);
                          });

$("input[type=text]").on("keypress", function(e) {
                         if(e.which === 13) {
                             this.blur();
                         }
                         });

$("#add-flo-btn").on('click', function() {
                     console.log('add tapped');
                     createNewFlo();
                     });


function displayInsertResult(tx, rs){
    gCurrentFlo = rs.insertId;
    console.log('current flo is: ' + gCurrentFlo);
}

function createNewFlo(){
    var myNewFlo = $('#edit-form').stringifyForm();
    Model.addFlo(myNewFlo);
}

function displayDeleteResult(){
    $('#flos-list').html('');
	$.mobile.changePage( '#list-page');
}

function populateEditPage(e){
	var row = globalFlos[e];
	gCurrentFlo = row.id;
	
	$('#name').val(row.name);
	$('#cycle').val(row.cycle).trigger('create');
	$('#long').val(row.long).trigger('create');
	$('#startDate').val(row.startDate);
    $('#thumbnail').val(row.thumbnail);
    $('.thumbnail-button').attr('src',row.thumbnail);
}

function updateEditPage() {
	var myFloEdit = $('#edit-form').stringifyForm();
    Model.updateFlo(myFloEdit);
}

function makeList(){
	Model.openDB();
	Model.getFlos();
    resetEditPage();
}

function resetEditPage(){
    $('#edit-form').resetForm();
    $('#thumbnail').val('images/thumbnail.svg');
    $('.thumbnail-button').attr('src','images/thumbnail.svg');
    $('#startDate').val(new Date().toJSON().slice(0,10));
}

function checkNameDateFields() {
    $('#edit-form #startDate').on('blur', function() {
                                  var dateValue = this.value;
                                  if (dateValue == '' || dateValue == null) {
                                      $('#startDate').val(new Date().toJSON().slice(0,10));
                                  }
                                  })
    
    $('#edit-form #name').on('blur', function() {
                             var nameValue = this.value;
                             if (nameValue == '' || nameValue == null) {
                                 $('#name').val('Unnamed');
                             }
                             })
}

function displayResultSet(){
	var myOutput = '';
    var myPredictOutput = '';
    
    if (globalFlos.length >= 1) {
        for(i=0; i < globalFlos.length; i++) {
            var row = globalFlos[i];
            var myFloStatus = Flos.getStatus(currentTime,row.startDate,row.cycle,row.long);
            
            myOutput += "<a class='edit-button " + myFloStatus.code +
            "' href='#edit-page' data-id='" + i +
            "' data-icon='carat-r' data-iconpos='right' data-role='button' data-transition='slide' data-shadow='false'>" +
            "<image width='60' class='thumbnail' src='"+ row.thumbnail +"' />" +
            "<span class='name-title'>" + row.name + "</span>" +
            " <span class='status-text'>is "+ myFloStatus.text +"</span></a>";
            
            myPredictOutput += '<label><input type="radio" name="predictItem" id="pred-item-' + i + '" value="' + i + '" checked>' + row.name + '</label>';
            
        }
    } else {
        myOutput = "<div class='no-flo' data-shadow='false'>You're not tracking any flos at this time.</div>";
        myPredictOutput = myOutput;
    }
    
    checkForMaxFlos();
	
	$('#flos-list').html(myOutput).trigger('create');
    $('#predict-list').html(myPredictOutput).trigger('create');
	$('.edit-button').on('tap', function(){
                         populateEditPage(
                                      $(this).attr('data-id')
                                      );
                         });
}

function checkForMaxFlos(){
    if (globalFlos.length >= 10) {
        $('#add-flo-btn').hide();
    } else {
        $('#add-flo-btn').show();
    }
}

function updateImageSrc(path) {
    $('#thumbnail').val(path);
    $('.thumbnail-button').attr('src',path);
}

function secToDays(value) {
    var d = value/1000/60/60/24;
    return Math.round(d);
}

//helpers
$.fn.serializeForm = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
           if (o[this.name] !== undefined) {
           if (!o[this.name].push) {
           o[this.name] = [o[this.name]];
           }
           o[this.name].push(this.value || '');
           } else {
           o[this.name] = this.value || '';
           }
           });
    return o;
};

$.fn.stringifyForm = function(){
	var myData = JSON.stringify(this.serializeForm())
	return myData;
}

$.fn.resetForm = function(e){
	this[0].reset();
}
