var AppContainer = require('app-container'),
    conf = require('app-container-conf'),
    prefix = (conf.get('resources:$apiRoot')||'/api/v1/'),
    odataFile = require('odata-resource-file'),
    Resource = require('odata-resource'),
    _ = require('lodash'),
    appModule = {
        File: odataFile.File,
        Image: odataFile.img({ collection: 'Image', formats: (conf.get('resources:image:formats')||[]) }),
        FileMeta: require('./FileMeta'),
        appInit: function(app) {
            appModule.fileResource = odataFile.fileResource({
                rel: prefix+'file',
                tmp: 'tmp/'
            },app);

            appModule.fileMetaResource = new Resource({
                rel: prefix+'fileMeta',
                model: appModule.FileMeta
            }).instanceLink('file',{
                otherSide: appModule.fileResource,
                key: '_file'
            });
            appModule.fileMetaResource.initRouter(app);

            appModule.imageResource = odataFile.imgResource({
                rel: prefix+'image',
                model: appModule.Image
            },appModule.fileResource,app);
        },
        init: function(container) {
            appModule.appInit(container.app());
            return container;
        },
        container: function(initPipeline) {
            initPipeline = initPipeline||{};
            var epp = initPipeline.post_passport||_.noop,
                pipeline = _.extend({},initPipeline,{
                    post_passport: function(app) {
                        epp(app);
                        appModule.appInit(app);
                    }
                });
            return appModule.init(new AppContainer().init(pipeline));
        }
    };

module.exports = appModule;
