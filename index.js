var AppContainer = require('app-container'),
    conf = require('app-container-conf'),
    prefix = (conf.get('resources:$apiRoot')||'/api/v1/'),
    odataFile = require('odata-resource-file'),
    _ = require('lodash'),
    appModule = {
        appInit: function(app) {
            appModule.File = odataFile.File;
            appModule.fileResource = odataFile.fileResource({
                rel: prefix+'file',
                tmp: 'tmp/'
            },app);
            appModule.Image = odataFile.img({
                collection: 'Image',
                formats:[{
                    format: 'thumbnail',
                    transformations:[{
                        fn: 'cover',
                        args: [200,200]
                    }]
                }]
            });
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
