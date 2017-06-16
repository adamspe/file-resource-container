angular.module('app-container-file',[
    'app-container-common',
    'templates-app-container-file',
    'odata-resource-file'
])
.provider('$appServiceFile',[function(){
    this.$get = ['$fileResource','$apiConfig',function($fileResource,$apiConfig){
        var apiRoot = $apiConfig.apiRoot;
        return function(path) {
            return $fileResource(apiRoot+path);
        };
    }];
}])
.service('Img',['$appServiceFile',function($appServiceFile){
    return $appServiceFile('fs/img/:id');
}])
.service('File',['$appServiceFile',function($appServiceFile){
    return $appServiceFile('fs/file/:id');
}])
.filter('fileSize',function(){
    var KD = 1024,
        MD = KD*1024;
    return function(f) {
        if(f && f.length) {
            return (f.length/MD < 1) ?
                Math.round(f.length/KD)+'K' :
                (f.length/MD).toFixed(2)+'M';
        }
    };
})
.filter('faFileTypeClass',function(){
    var TYPE_MAP = {
        'application/pdf': 'fa-file-pdf-o',
        'application/msword': 'fa-file-word-o',
        'application/zip': 'fa-file-archive-o'
    },
    TYPE_EXP = {
        'fa-file-text-o': /^text\//,
        'fa-file-picture-o': /^image\//,
        'fa-file-excel-o': /ms-excel/,
        'fa-file-audio-o': /^audio\//,
        'fa-file-movie-o': /^video\//,
        'fa-file-powerpoint-o': /ms-powerpoint/
    };
    return function(f) {
        var fa;
        if(f && f.contentType) {
            fa = TYPE_MAP[f.contentType]||Object.keys(TYPE_EXP).reduce(function(found,icon){
                    var exp = TYPE_EXP[icon];
                    return found ? found :
                        (f.contentType.match(exp) ? icon : undefined);
                },undefined);
        }
        return fa||'fa-file-o';
    };
})
.directive('fileInfo',[function(){
    return {
        restrict: 'EC',
        template: '<a class="file-info-link" ng-href="{{f._links.download}}" '+
            'title="{{f.filename}}" alt="{{f.filename}}">'+
            '<i class="fa {{f | faFileTypeClass}}" aria-hidden="true"></i> '+
            '{{f.filename}}'+
            '</a> <span class="file-info-details">{{f | fileSize}} (Uploaded: {{f.uploadDate | date:\'medium\'}})</span>',
        scope: {
            f: '=file'
        }
    };
}]);
