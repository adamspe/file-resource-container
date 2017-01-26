var AppContainer = require('app-container'),
    conf = require('app-container-conf'),
    prefix = (conf.get('resources:$apiRoot')||'/api/v1/')+'file/',
    odataFile = require('odata-resource-file'),
    Resource = require('odata-resource'),
    _ = require('lodash'),
    appModule = {
        File: odataFile.File,
        Image: odataFile.img({ collection: 'Image', formats: (conf.get('resources:image:formats')||[]) }),
        appInit: function(app) {
            var file = appModule.fileResource = odataFile.fileResource({
                rel: prefix+'file',
                tmp: 'tmp/'
            },app);
            function addMeta(superFunc) {
                return function(req,res){
                    var meta = req.body.metadata;
                    if(meta && typeof(meta) === 'string') {
                        meta = JSON.parse(meta);
                    }
                    meta = meta||{};
                    req.body.metadata = _.extend(meta,{
                        // store the user id as a string (not id) since File's schema
                        // is not strict otherwise we can't find like $filter=metadata._user eq '...'
                        _user: req.user._id.toString()
                    });
                    superFunc.apply(this,arguments);
                };
            }
            file.create = addMeta(file.create);
            file.update = addMeta(file.update);

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
