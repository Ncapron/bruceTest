var mongoose = require("mongoose");

var modelSchema = new mongoose.Schema({
    id          : {type: String,   default : null},
    title       : { type : String, default : null},
    created_at  : { type : Date, default : Date.now() }
});

// indexed fields
modelSchema.index({title: 'text'});


// plugin paginate
modelSchema.plugin(require('mongoose-paginate'));

const model = mongoose.model('job', modelSchema);

module.exports = model;
