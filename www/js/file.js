var gImageURI = '';
var gFileSystem = {};
var gImageFile = {};

function gotFS(fileSystem) {
    gFileSystem = fileSystem;
}

function gotImageURI(fileEntry) {
    var newName = 'thumbnail_' + gCurrentFlo + ".jpg";
    fileEntry.moveTo(gFileSystem.root, newName, movedImageSuccess, errorHandler);
}

function movedImageSuccess(fileEntry) {
    var myTime = new Date();
    myTime = myTime.getTime();
    var newPath = fileEntry.fullPath + "?localtime=" + myTime;
    updateImageSrc(newPath);
}

function updateCameraImages(imageURI) {
    gImageURI = imageURI;
    window.resolveLocalFileSystemURI(imageURI, gotImageURI, errorHandler);
}

function errorHandler(e) {
    var msg = '';
    switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'QUOTA_EXCEEDED_ERR';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'NOT_FOUND_ERR';
            break;
        case FileError.SECURITY_ERR:
            msg = 'SECURITY_ERR';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'INVALID_MODIFICATION_ERR';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'INVALID_STATE_ERR';
            break;
        default:
            msg = 'Unknown Error';
            break;
    };
    console.log('Error: ' + msg);
}
