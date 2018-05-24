var mongoose = require("mongoose");

var modelSchema = new mongoose.Schema({
    userSearch  : { type : String, default : null},
    count       : { type : Number, default : 1},
    chosen      : { type : String, default : null},
    matches     : [{type : String, default : []}],
    created_at  : { type : Date, default   : Date.now() }
});

var model = mongoose.model('search', modelSchema);

module.exports = model;
