angular.module('app-container-file',[
    'app-container-common',
    'templates-app-container-file',
    'odata-resource-file'
])
.provider('$appServiceFile',[function(){
    // wrap the $fileResource provider to impose a configurable apiRoot
    // as is done for $appService
    this.apiRoot = '/api/v1/';
    this.$get = ['$fileResource',function($fileResource){
        var apiRoot = this.apiRoot;
        return function(path) {
            return $fileResource(apiRoot+path);
        };
    }];
}])
.service('Img',['$appServiceFile',function($appServiceFile){
    return $appServiceFile('file/img/:id');
}])
.service('File',['$appServiceFile',function($appServiceFile){
    return $appServiceFile('file/file/:id');
}])
.service('FileMeta',['$appServiceFile',function($appServiceFile){
    return $appServiceFile('file/fileMeta/:id');
}]);
