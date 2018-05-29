const async = require('async');
const natural = require('natural');
const searchModel  = require('models/search');
const _ = require('lodash');

const checkForm = {
    pourcent: function (form, jobs, callback) {
        if (jobs.length == 0) {
            return callback('noData');
        }
        async.waterfall([
            function data(cb){
                let results = [];
                let search = form.userSearch.charAt(0).toUpperCase() + form.userSearch.slice(1);
                async.each(jobs, function(job, cback){
                    if (natural.JaroWinklerDistance(search,job.title) > 0.52) {
                        results.push(job.id);
                    }
                    return cback();
                }, function(err){
                    return cb(null, results);
                });
            }
        ], function(err, results){
            if (err) {
                console.log('err', err);
                return callback(err);
            }
            return callback(null, results);
        });
    }
};

module.exports = checkForm;
