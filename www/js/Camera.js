"use strict";

var pictureSource, destinationType;

// Called if something bad happens.
function onFail(message) {
    console.log('Failed because: ' + message);
}

// Called when a photo is successfully retrieved
function onPhotoDataSuccess(imageData) {
    FileIO.updateCameraImages(imageData);
}

// Called when a photo is successfully retrieved
function onPhotoURISuccess(imageURI) {
    FileIO.updateCameraImages(imageURI);
}

// A button will call this function
function capturePhoto() {
    // Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
                                destinationType: destinationType.DATA_URL });
}

// A button will call this function
function capturePhotoEdit() {
    // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true,
                                destinationType: destinationType.DATA_URL });
}

function getPhoto(source) {
    // Retrieve image file location from specified source
    navigator.camera.getPicture(onPhotoURISuccess, onFail, {
        quality: 50,
        destinationType: destinationType.FILE_URI,
        saveToPhotoAlbum: false,
        sourceType: source,
        allowEdit: true
    });
}
