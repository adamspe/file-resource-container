var mongoose = require('mongoose'),
    schema = new mongoose.Schema({
        _file: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'File' },
        data: {type: mongoose.Schema.Types.Mixed }
    });
schema.set('collection','FileMeta');


var FileMeta = mongoose.model('FileMeta',schema);

module.exports = FileMeta;
