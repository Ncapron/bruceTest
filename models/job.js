var mongoose = require("mongoose");

var modelSchema = new mongoose.Schema({
    id          : {type: String,   default : null},
    title       : { type : String, default : null},
    created_at  : { type : Date, default : Date.now() }
});

var model = mongoose.model('job', modelSchema);

module.exports = model;
