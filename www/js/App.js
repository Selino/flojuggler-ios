$("#list-page").on('pagebeforeshow', function(evt) {
                   makeList();
                   });

$("#edit-page").on('pageinit', function (evt) {
                   checkNameDateFields();
                   }).on('pagebeforehide', function(evt) {
                         updateEditPage();
                         makeList();
                         }).on('pagebeforeshow', function(evt) {
                               $("#edit-form").show();
                               });;

$("#delete-button").on('click', function() {
                           var deleteName = $("#name").val();
                           $("#delete-popup-name").html(deleteName)
                           $("#popup-delete").popup('open');
                       });

$("#delete-popup-confirm-btn").on('click', function() {
                                  startDeleteFlo();
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
                     createNewFlo();
                     });

function onResume(){
    makeList();
}

function startDeleteFlo(){
    $("#edit-form").fadeOut('fast', function(){
                            deleteFloThumbnail();
                            Flos.deleteFlo(gCurrentFlo);
                            $.mobile.changePage( '#list-page');
                            });
}

function deleteFloThumbnail(){
    var sThumbnailPath = $('#thumbnail').val();
    
    if (sThumbnailPath != 'images/thumbnail.svg') {
        sThumbnailPath = 'file://' + sThumbnailPath.slice(0, - 24);
        FileIO.removeDeletedImage(sThumbnailPath);
    }
}

function displayInsertResult(tx, rs){
    gCurrentFlo = rs.insertId;
}

function createNewFlo(){
    var myNewFlo = $('#edit-form').stringifyForm();
    Model.addFlo(myNewFlo);
}

function populateEditPage(e){
	var row = globalFlos[e];
	gCurrentFlo = row.id;
	
	$('#name').val(row.name);
	$('#cycle').val(row.cycle).trigger('create');
	$('#long').val(row.long).trigger('create');
	$('#startDate').val(row.startDate);
    $('#thumbnail').val(row.thumbnail);
    $('.thumbnail-button').attr('src',row.thumbnail).nocacheImg();
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
                                  var bIspast = makeSurePast(dateValue);
                                  
                                  if (!bIspast) {
                                      $('#startDate').val(new Date().toJSON().slice(0,10));
                                  }
                                  
                                  document.body.scrollTop = document.documentElement.scrollTop = 0;
                                  })
    
    $('#edit-form #name').on('blur', function() {
                             var nameValue = this.value;
                             if (nameValue == '' || nameValue == null) {
                                 $('#name').val('Unnamed');
                             }
                             document.body.scrollTop = document.documentElement.scrollTop = 0;
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
            "<span class='name-title'>" + truncateString(row.name, 13) + "</span>" +
            " <span class='status-text'>is "+ myFloStatus.text +"</span></a>";
            
            myPredictOutput += '<label><input type="radio" name="predictItem" id="pred-item-' + i + '" value="' + i + '" checked>' + row.name + '</label>';
        }
    } else {
        myOutput = "<div class='no-flo' data-shadow='false'>You're not tracking any flos at this time.</div>";
        myPredictOutput = myOutput;
    }
    checkForMaxFlos();
    updateFloListLayout(myOutput,myPredictOutput);
}

function updateFloListLayout(myOutput,myPredictOutput){
    $('#flos-list').html(myOutput).trigger('create');
    $('#predict-list').html(myPredictOutput).trigger('create');
	$('.edit-button').on('tap', function(){
                         populateEditPage(
                                          $(this).attr('data-id')
                                          );
                         });
    $('.thumbnail').nocacheImg();
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
    $('.thumbnail-button').attr('src',path).nocacheImg();
}

//primitive helpers
function secToDays(value) {
    var d = value/1000/60/60/24;
    return Math.round(d);
}

function truncateString(string,max){
    if(string.length >= max){
        return string.slice(0,max) + "…";
    } else {
        return string;
    }
}

function makeSurePast(date){
    var myTime = new Date(date).getTime();
    if (myTime > currentTime) {
        return false;
    } else {
        return true;
    }
}

function makeSureFuture(date){
    var myTime = new Date(date).getTime();
    if (myTime <= currentTime) {
        return false;
    } else {
        return true;
    }
}

//JQuery helpers
$.fn.extend({
    nocacheImg : function(){
        return this.each(function(){
                         var myNow = new Date().getTime();
                         this.src = this.src + "?localtime=" + myNow;
                         });
    },
            
    resetForm : function(){
            this[0].reset();
    },
            
    stringifyForm : function(){
        var myData = JSON.stringify(this.serializeForm())
        return myData;
    },
    
    serializeForm : function(){
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
    }
});
