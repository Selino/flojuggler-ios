var gImageURI = '', gFileSystem = {};

var FileIO = {

    gotFS : function (fileSystem) {
        gFileSystem = fileSystem;
    },

    updateCameraImages : function(imageURI) {
        gImageURI = imageURI;
        window.resolveLocalFileSystemURI(imageURI, FileIO.gotImageURI, FileIO.errorHandler);
    },

    gotImageURI : function(fileEntry) {
        var newName = "thumbnail_" + gCurrentFlo + ".jpg";
        fileEntry.moveTo(gFileSystem.root, newName, FileIO.movedImageSuccess, FileIO.errorHandler);
    },

    movedImageSuccess : function(fileEntry) {
        updateImageSrc(fileEntry.fullPath);
    },

    removeDeletedImage : function (imageURI) {
        window.resolveLocalFileSystemURI(imageURI, FileIO.removeFile, FileIO.errorHandler);
    },

    removeFile : function(fileEntry) {
        fileEntry.remove();
    },

    errorHandler : function(e) {
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
                msg = e.code;
                break;
        };
        console.log('Error: ' + msg);
    }
}
