"use strict";

function deleteFloThumbnail() {
    var sThumbnailPath = $('#thumbnail').val();
    
    if (sThumbnailPath !== 'images/thumbnail.svg') {
        sThumbnailPath = 'file://' + sThumbnailPath.slice(0, -24);
        FileIO.removeDeletedImage(sThumbnailPath);
    }
}

function startDeleteFlo() {
    $("#edit-form").fadeOut('fast', function () {
        deleteFloThumbnail();
        Flos.deleteFlo(gCurrentFlo);
        $.mobile.changePage('#list-page');
    });
}

function displayInsertResult(tx, rs) {
    gCurrentFlo = rs.insertId;
}

function resetEditPage() {
    $('#edit-form').resetForm();
    $('#thumbnail').val('images/thumbnail.svg');
    $('.thumbnail-button').attr('src', 'images/thumbnail.svg');
    $('#startDate').val(new Date().toJSON().slice(0, 10));
}

function createNewFlo() {
    resetEditPage();
    var myNewFlo = $('#edit-form').stringifyForm();
    Model.addFlo(myNewFlo);
}

function populateEditPage(e) {
	var row = globalFlos[e];
	gCurrentFlo = row.id;
	
	$('#name').val(row.name);
	$('#cycle').val(row.cycle).trigger('create');
	$('#long').val(row.long).trigger('create');
	$('#startDate').val(row.startDate);
    $('#thumbnail').val(row.thumbnail);
    $('.thumbnail-button').attr('src', row.thumbnail).nocacheImg();
}

function updateEditPage() {
	var myFloEdit = $('#edit-form').stringifyForm();
    Model.updateFlo(myFloEdit);
}

function makeList() {
	Model.openDB();
	Model.getFlos();
    //resetEditPage();
}

function checkNameDateFields() {
    $('#edit-form #startDate').on('blur', function () {
        var dateValue = this.value, bIsPast = makeSurePast(dateValue);
        if (!bIsPast) {
            $('#startDate').val(new Date().toJSON().slice(0, 10));
        }
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    });
    
    $('#edit-form #name').on('blur', function () {
        var nameValue = this.value;
        if (nameValue === '' || nameValue === null) {
            $('#name').val('Unnamed');
        }
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    });
}

function displayResultSet() {
	var myOutput = '';
    var myPredictOutput = '';
    
    if (globalFlos.length >= 1) {
        for (i = 0; i < globalFlos.length; i += 1) {
            var row = globalFlos[i];
            var myFloStatus = Flos.getStatus(currentTime, row.startDate, row.cycle, row.long);
            
            myOutput += "<div class='edit-button " + myFloStatus.code +
                "' href='#edit-page' data-id='" + i +
                "' data-role='button' data-transition='slide' data-shadow='false'>" +
//            "<div class='crtl-area'>" +
//            "<a href='#predict-page' data-icon='calendar' data-role='button' data-shadow='false' data-mini='true'>Predict</a>" +
//            "</div>" +
                "<div class='info-area snd-one'><image width='60' class='thumbnail' src='" + row.thumbnail + "' />" +
                "<image class='carat' src='css/images/icons-svg/carat-l-black.svg' />" +
                "<span class='name-title'>" + truncateString(row.name, 13) + "</span>" +
                " <span class='status-text'>is " + myFloStatus.text + "</span></div></div>";
            
            myPredictOutput += '<label><input type="radio" name="predictItem" id="pred-item-' + i + '" value="' + i + '" checked>' + row.name + '</label>';
        }
    } else {
        myOutput = "<div class='no-flo' data-shadow='false'>You're not tracking any flos at this time.</div>";
        myPredictOutput = myOutput;
    }
    checkForMaxFlos();
    updateFloListLayout(myOutput, myPredictOutput);
}

function setEditBtnActions() {
    $('.edit-button').on('click', function (event) {
        lowLag.play('btn-snd-1');
        var that = $(this);
        setEditBtnTap(that);
    }).on('swipeleft', function (event) {
        $(this).addClass('ui-btn-active');
        populateEditPage(
            $(this).attr('data-id')
        );
        $.mobile.changePage('#edit-page', { transition: 'slide' });
        lowLag.play('btn-snd-3');
    }).on('taphold', function (event) {
        var oThat = $(this);
        oThat.off('click');
        //showCntrlArea(oThat);
        $(this).on("tap", function () {
            var that = $(this);
            setEditBtnTap(that);
        });
    });
}

function showCntrlArea(oEditItem) {
    oEditItem.children(".crtl-area").slideToggle('fast');
}

function setEditBtnTap(e) {
    populateEditPage($(e).attr('data-id'));
    $.mobile.changePage('#edit-page', { transition: 'slide' });
}

function updateFloListLayout(myOutput,myPredictOutput) {
    $('#flos-list').html(myOutput);
    $('#predict-list').html(myPredictOutput);
	setEditBtnActions();
    $('.thumbnail').nocacheImg();
}

function checkForMaxFlos() {
    if (globalFlos.length >= 10) {
        $('#add-flo-btn').hide();
    } else {
        $('#add-flo-btn').show();
    }
}

function updateImageSrc(path) {
    $('#thumbnail').val(path);
    $('.thumbnail-button').attr('src', path).nocacheImg();
}

//primitive helpers
function secToDays(value) {
    var d = value / 1000 / 60 / 60 / 24;
    return Math.round(d);
}

function truncateString(string, max) {
    if (string.length >= max) {
        return string.slice(0, max) + "…";
    } else {
        return string;
    }
}

function makeSurePast(date) {
    if (date !== '' && date !== null) {
        var myTime = new Date(date).getTime();
        if (myTime >= currentTime) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}

function makeSureFuture(date) {
    if (date !== '' && date !== null) {
        var myTime = new Date(date).getTime();
        if (myTime <= currentTime) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}

function swipeEditPage() {
    if ($('#edit-page').hasClass('swap-off') === false) {
        $.mobile.changePage('#list-page', {transition: 'slide', reverse: true});
        lowLag.play('btn-snd-3');
    }
}

function onResume() {
    var activePage = $.mobile.activePage.attr("id");
    if (activePage === "list-page") {
        makeList();
    }
}

//JQuery helpers
$.fn.extend({
    nocacheImg : function () {
        return this.each(function () {
            var myNow = new Date().getTime();
            this.src = this.src + "?localtime=" + myNow;
        });
    },
            
    resetForm : function () {
        this[0].reset();
    },
            
    stringifyForm : function () {
        var myData = JSON.stringify(this.serializeForm());
        return myData;
    },
    
    serializeForm : function () {
        var o = {}, a = this.serializeArray();
        $.each(a, function () {
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

//initializers
lowLag.init({
    'urlPrefix': 'audio/',
    'debug': 'none'
});
lowLag.load("button-31.mp3", 'btn-snd-1');
lowLag.load("button-32.mp3", 'btn-snd-2');
lowLag.load("button-43.mp3", 'btn-snd-3');

$('[data-id=header] a,.ui-btn').on('click', function () {
    lowLag.play('btn-snd-2');
});

$("#list-page").on('pagebeforeshow', function (evt) {
    makeList();
});

$("#edit-page").on('pageinit', function (evt) {
    checkNameDateFields();
}).on('pagebeforehide', function (evt) {
    updateEditPage();
}).on('pagebeforeshow', function (evt) {
    updateEditPage();
    $("#edit-form").show();
}).on('swiperight', swipeEditPage);

$("#delete-button").on('click', function () {
    var deleteName = $("#name").val();
    $("#delete-popup-name").html(deleteName);
    $("#popup-delete").popup('open');
});

$("#list-page-button").on('click', function () {
    $.mobile.changePage('#list-page', { transition: 'slide', reverse: true});
});

$("#delete-popup-confirm-btn").on('click', function () {
    startDeleteFlo();
});

$(".thumbnail-button").on('click', function () {
    lowLag.play('btn-snd-1');
    getPhoto(pictureSource.PHOTOLIBRARY);
});

$("input[type=text]").on("keypress", function (e) {
    if(e.which === 13) {
        this.blur();
    }
});

$("#add-flo-btn").on('click', function () {
    createNewFlo();
});

$('#edit-page').on('slidestart', '#edit-form input[type=number]', function () {
    $("#edit-page").addClass('swap-off');
}).on('slidestop', '#edit-form input[type=number]', function () {
    $("#edit-page").removeClass('swap-off');
});
